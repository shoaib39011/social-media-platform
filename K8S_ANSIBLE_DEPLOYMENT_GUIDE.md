# Social Spark - Full Stack Kubernetes & Ansible Deployment Guide

## Project Structure Overview

```
social-spark-47-main/
├── backend-project/          # Node.js Express Backend
├── social-spark-47-main/     # React Frontend
├── spring-boot-backend/      # Spring Boot Backend (Optional)
├── docker/                   # Docker configuration files
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── k8s/                      # Kubernetes manifests
│   ├── 01-namespace.yaml
│   ├── 02-mysql-pv.yaml
│   ├── 03-mysql-config.yaml
│   ├── 04-mysql-deployment.yaml
│   ├── 05-backend-config.yaml
│   ├── 06-backend-deployment.yaml
│   ├── 07-frontend-deployment.yaml
│   ├── 08-ingress.yaml
│   ├── 09-hpa.yaml
│   └── 10-monitoring.yaml
└── ansible/                  # Ansible automation
    ├── inventory.ini
    ├── ansible.cfg
    ├── install-kubernetes.yml
    ├── init-kubernetes.yml
    ├── deploy-app.yml
    ├── manage-app.yml
    ├── backup-restore.yml
    └── master-deploy.yml
```

## Prerequisites

### System Requirements
- 3+ Virtual Machines (1 Master, 2+ Workers)
- Minimum 2 vCPUs per node
- Minimum 4GB RAM per node
- Ubuntu 20.04 LTS or later
- Network connectivity between all nodes

### Local Machine Requirements
- Ansible 2.10+
- kubectl 1.28+
- Docker (for building images)
- Python 3.8+
- SSH access to all nodes

### Installation Instructions

#### 1. Install Ansible
```bash
# On control machine (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt-get install ansible

# Or using pip
pip install ansible
```

#### 2. Install kubectl
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

#### 3. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

## Kubernetes Manifests Explanation

### 01. Namespace (01-namespace.yaml)
Creates an isolated namespace `social-spark` for the application.

### 02. Storage (02-mysql-pv.yaml)
- Creates PersistentVolume (10GB)
- Creates PersistentVolumeClaim for MySQL data persistence

### 03. Configuration (03-mysql-config.yaml)
- ConfigMap for MySQL configuration
- Secret for sensitive data (passwords)

### 04. MySQL (04-mysql-deployment.yaml)
- MySQL 8.0 deployment with 1 replica
- Readiness and liveness probes
- Health checks

### 05. Backend Config (05-backend-config.yaml)
- Environment variables for Node.js backend
- Database connection details

### 06. Backend Deployment (06-backend-deployment.yaml)
- Node.js Express backend with 2 replicas
- Load balanced service
- Health checks and resource limits

### 07. Frontend Deployment (07-frontend-deployment.yaml)
- React frontend with 2 replicas
- Served via 'serve' package
- Load balanced service

### 08. Ingress (08-ingress.yaml)
- NGINX Ingress controller
- SSL/TLS support (requires cert-manager)
- Domain routing (social-spark.example.com, api.social-spark.example.com)

### 09. Horizontal Pod Autoscaler (09-hpa.yaml)
- Backend: 2-10 replicas based on CPU/Memory
- Frontend: 2-5 replicas based on CPU/Memory

### 10. Monitoring (10-monitoring.yaml)
- Prometheus for metrics collection
- Scrapes backend and MySQL metrics

## Docker Configuration

### docker-compose.yml
Local development setup with MySQL, Backend, and Frontend services.

**To run locally:**
```bash
cd docker
docker-compose up -d

# Access:
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
# MySQL: localhost:3306
```

### Dockerfile.backend
Multi-stage build for Node.js backend.
- Base image: node:18-alpine
- Installs production dependencies
- Health check endpoint

### Dockerfile.frontend
Multi-stage build for React frontend.
- Build stage: installs devDependencies and builds
- Production stage: serves static files with 'serve'
- Optimized for production

## Ansible Playbooks

### Step 1: Update Inventory
Edit `ansible/inventory.ini` with your server IPs:
```ini
[k8s_masters]
master1 ansible_host=192.168.1.10 ansible_user=ubuntu

[k8s_workers]
worker1 ansible_host=192.168.1.11 ansible_user=ubuntu
worker2 ansible_host=192.168.1.12 ansible_user=ubuntu
```

### Step 2: Set up SSH Keys
```bash
# Generate SSH keys
ssh-keygen -t rsa -b 4096

# Copy keys to all nodes
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@192.168.1.10
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@192.168.1.11
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@192.168.1.12
```

### Step 3: Run Master Deployment
```bash
cd ansible
ansible-playbook master-deploy.yml
```

This will execute:
1. **install-kubernetes.yml** - Install Docker, kubelet, kubeadm, kubectl
2. **init-kubernetes.yml** - Initialize cluster and join nodes
3. **deploy-app.yml** - Deploy applications to Kubernetes

### Step 4: Verify Deployment
```bash
# Check nodes
kubectl get nodes

# Check pods
kubectl get pods -n social-spark

# Check services
kubectl get svc -n social-spark

# Check ingress
kubectl get ingress -n social-spark
```

## Playbook Details

### install-kubernetes.yml
**Purpose:** Install Kubernetes components on all nodes

**Tasks:**
- Update system packages
- Install required packages (curl, wget, git, etc.)
- Configure kernel modules (overlay, br_netfilter)
- Configure sysctl for Kubernetes networking
- Disable swap (required for Kubernetes)
- Install Docker
- Install Kubernetes components (kubelet, kubeadm, kubectl)

**Variables:**
- `kubernetes_version`: 1.28.0
- `docker_version`: 24.0

### init-kubernetes.yml
**Purpose:** Initialize Kubernetes cluster

**Tasks:**
1. Initialize master node with kubeadm
2. Create .kube directory and copy admin config
3. Install Flannel CNI (networking plugin)
4. Install metrics-server (for HPA)
5. Generate join command for workers
6. Join worker nodes to cluster

**Output:**
- Kubernetes cluster initialized
- Workers joined to cluster
- CNI and metrics configured

### deploy-app.yml
**Purpose:** Deploy Social Spark application to Kubernetes

**Tasks:**
- Create namespace
- Apply storage configurations
- Deploy MySQL with persistent storage
- Wait for MySQL to be ready
- Deploy backend with 2 replicas
- Deploy frontend with 2 replicas
- Configure Ingress
- Set up Horizontal Pod Autoscaler
- Deploy Prometheus monitoring

**Services Created:**
- Frontend: frontend.social-spark.svc.cluster.local:5173
- Backend: backend.social-spark.svc.cluster.local:3001
- MySQL: mysql.social-spark.svc.cluster.local:3306

### manage-app.yml
**Purpose:** Manage running application

**Available Operations:**

1. **Scale Application**
   ```bash
   ansible-playbook manage-app.yml -e "backend_replicas=5 frontend_replicas=3"
   ```

2. **Update Images**
   ```bash
   ansible-playbook manage-app.yml -e "new_image_tag=v1.0.0"
   ```

3. **Monitor Health**
   ```bash
   ansible-playbook manage-app.yml
   ```

### backup-restore.yml
**Purpose:** Backup and restore application data

**Backup:**
```bash
ansible-playbook backup-restore.yml --tags backup
```

**Restore:**
```bash
ansible-playbook backup-restore.yml --tags restore -e "backup_file=/backups/backup_restore.tar.gz"
```

## Post-Deployment Configuration

### 1. Configure Domain Names
Update your DNS or hosts file:
```
# /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
192.168.1.10 social-spark.example.com
192.168.1.10 api.social-spark.example.com
```

### 2. Install Cert-Manager for HTTPS
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

### 3. Configure TLS Certificate
```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 4. Verify Access
```bash
# Port forward to test locally
kubectl port-forward -n social-spark svc/frontend 5173:5173 &
kubectl port-forward -n social-spark svc/backend 3001:3001 &

# Test API
curl http://localhost:3001/api/test-db
```

## Monitoring and Logging

### Access Prometheus
```bash
kubectl port-forward -n social-spark svc/prometheus 9090:9090
# Visit http://localhost:9090
```

### View Logs
```bash
# Backend logs
kubectl logs -n social-spark -l app=backend -f

# Frontend logs
kubectl logs -n social-spark -l app=frontend -f

# MySQL logs
kubectl logs -n social-spark -l app=mysql -f
```

### Describe Resources
```bash
# Get deployment details
kubectl describe deployment -n social-spark backend

# Get pod details
kubectl describe pod -n social-spark <pod-name>

# Get events
kubectl get events -n social-spark
```

## Troubleshooting

### Pods not starting
```bash
# Check pod status
kubectl describe pod -n social-spark <pod-name>

# Check events
kubectl get events -n social-spark --sort-by='.lastTimestamp'
```

### Database connection issues
```bash
# Test MySQL connectivity
kubectl exec -it -n social-spark $(kubectl get pods -n social-spark -l app=mysql -o jsonpath='{.items[0].metadata.name}') \
-- mysql -u social_spark_user -p -e "SELECT VERSION();"
```

### Image pull errors
```bash
# Check image registry credentials
kubectl get secrets -n social-spark

# Create image pull secret if needed
kubectl create secret docker-registry regcred \
  --docker-server=your-registry \
  --docker-username=username \
  --docker-password=password \
  -n social-spark
```

## Maintenance Tasks

### Update Application
```bash
# Build new image
docker build -t your-registry/social-spark-backend:v1.0.0 ./backend-project
docker push your-registry/social-spark-backend:v1.0.0

# Update deployment
kubectl set image deployment/backend -n social-spark backend=your-registry/social-spark-backend:v1.0.0
```

### Scale Resources
```bash
# Scale backend to 5 replicas
kubectl scale deployment backend -n social-spark --replicas=5

# Check scaling
kubectl get deployment -n social-spark
```

### Clean Up
```bash
# Delete all resources in namespace
kubectl delete namespace social-spark

# Or delete specific resources
kubectl delete deployment backend -n social-spark
```

## Useful Commands

```bash
# General
kubectl cluster-info
kubectl get nodes
kubectl get namespaces

# Check resources
kubectl get deployments -n social-spark
kubectl get pods -n social-spark
kubectl get services -n social-spark
kubectl get pvc -n social-spark

# Port forwarding
kubectl port-forward -n social-spark svc/frontend 5173:5173
kubectl port-forward -n social-spark svc/backend 3001:3001

# Execute commands in pods
kubectl exec -it -n social-spark <pod-name> -- /bin/sh

# View logs
kubectl logs -n social-spark <pod-name>
kubectl logs -n social-spark -f deployment/backend

# Apply/Delete resources
kubectl apply -f k8s/
kubectl delete -f k8s/
```

## Security Considerations

1. **Change Default Passwords**
   - Update MySQL root and user passwords in `03-mysql-config.yaml`
   - Update backend database credentials in `05-backend-config.yaml`

2. **Use Private Container Registry**
   - Update `06-backend-deployment.yaml` and `07-frontend-deployment.yaml`
   - Set correct image registry paths

3. **Enable RBAC**
   - Create service accounts and role bindings
   - Restrict pod permissions

4. **Network Policies**
   - Implement network segmentation
   - Restrict traffic between namespaces

5. **Resource Quotas**
   - Set memory and CPU limits
   - Prevent resource exhaustion

## Performance Tuning

### Backend HPA Configuration
Modify `09-hpa.yaml`:
```yaml
minReplicas: 2
maxReplicas: 10
targetCPUUtilizationPercentage: 70  # Lower = more aggressive scaling
```

### MySQL Optimization
- Increase allocated memory in `04-mysql-deployment.yaml`
- Add MySQL configuration file to ConfigMap
- Enable query caching

### Frontend Caching
- Add CDN configuration to Ingress
- Enable browser caching headers

## Conclusion

You now have a fully automated, scalable Kubernetes deployment with Ansible automation. The system includes:
- ✅ Kubernetes cluster with 1 master and 2+ workers
- ✅ MySQL database with persistent storage
- ✅ Node.js backend with load balancing and auto-scaling
- ✅ React frontend with 2 replicas
- ✅ Ingress for domain-based routing
- ✅ Horizontal Pod Autoscaler for auto-scaling
- ✅ Prometheus for monitoring
- ✅ Ansible automation for deployment and management

For support or additional configurations, refer to the Kubernetes and Ansible documentation.
