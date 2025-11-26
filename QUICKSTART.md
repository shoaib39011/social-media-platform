# Quick Start Guide - Kubernetes & Ansible Deployment

## 1. Prerequisites Checklist

- [ ] 3+ Ubuntu servers (20.04 LTS or later)
- [ ] SSH access configured to all servers
- [ ] Ansible 2.10+ installed on control machine
- [ ] kubectl installed on control machine
- [ ] Docker installed on control machine (for building images)
- [ ] Network connectivity between all nodes

## 2. Step-by-Step Deployment

### Step 1: Prepare Infrastructure
```bash
# Set up 3 servers:
# - master1: 192.168.1.10
# - worker1: 192.168.1.11
# - worker2: 192.168.1.12

# Install Ansible on your control machine
sudo apt-get install ansible
```

### Step 2: Configure Inventory
```bash
cd ansible
vim inventory.ini

# Update with your server IPs:
# [k8s_masters]
# master1 ansible_host=192.168.1.10 ansible_user=ubuntu
#
# [k8s_workers]
# worker1 ansible_host=192.168.1.11 ansible_user=ubuntu
# worker2 ansible_host=192.168.1.12 ansible_user=ubuntu
```

### Step 3: Set Up SSH Keys
```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096

# Copy to all servers
for host in 192.168.1.10 192.168.1.11 192.168.1.12; do
    ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@$host
done
```

### Step 4: Deploy Kubernetes Cluster
```bash
# Run the master deployment playbook
cd ansible
ansible-playbook master-deploy.yml

# This will:
# 1. Install Docker and Kubernetes on all nodes
# 2. Initialize the Kubernetes cluster
# 3. Join worker nodes
# 4. Deploy Social Spark application
# 5. Configure storage, networking, and monitoring
```

### Step 5: Verify Deployment
```bash
# Get cluster info
kubectl cluster-info

# Check all nodes are ready
kubectl get nodes

# Check all pods in social-spark namespace
kubectl get pods -n social-spark

# Check services
kubectl get svc -n social-spark
```

### Step 6: Access Application
```bash
# For local testing, use port forwarding:
kubectl port-forward -n social-spark svc/frontend 5173:5173
kubectl port-forward -n social-spark svc/backend 3001:3001

# Visit http://localhost:5173 for the frontend
# API available at http://localhost:3001
```

## 3. Key File Locations

### Kubernetes Manifests
- `k8s/01-namespace.yaml` - Application namespace
- `k8s/02-mysql-pv.yaml` - MySQL persistent storage
- `k8s/03-mysql-config.yaml` - MySQL configuration and secrets
- `k8s/04-mysql-deployment.yaml` - MySQL deployment and service
- `k8s/05-backend-config.yaml` - Backend configuration and secrets
- `k8s/06-backend-deployment.yaml` - Backend deployment and service
- `k8s/07-frontend-deployment.yaml` - Frontend deployment and service
- `k8s/08-ingress.yaml` - Ingress configuration
- `k8s/09-hpa.yaml` - Auto-scaling configuration
- `k8s/10-monitoring.yaml` - Prometheus monitoring

### Ansible Playbooks
- `ansible/install-kubernetes.yml` - Install K8s components
- `ansible/init-kubernetes.yml` - Initialize cluster
- `ansible/deploy-app.yml` - Deploy applications
- `ansible/manage-app.yml` - Application management
- `ansible/backup-restore.yml` - Data backup/restore
- `ansible/master-deploy.yml` - Orchestrate full deployment

### Docker Files
- `docker/docker-compose.yml` - Local development stack
- `docker/Dockerfile.backend` - Backend Docker image
- `docker/Dockerfile.frontend` - Frontend Docker image

## 4. Common Commands

### Check Status
```bash
# Node status
kubectl get nodes

# Pod status
kubectl get pods -n social-spark

# Service status
kubectl get svc -n social-spark

# All resources
kubectl get all -n social-spark
```

### View Logs
```bash
# Backend logs
kubectl logs -n social-spark -l app=backend

# Frontend logs
kubectl logs -n social-spark -l app=frontend

# MySQL logs
kubectl logs -n social-spark -l app=mysql

# Follow logs
kubectl logs -n social-spark -f deployment/backend
```

### Scale Deployment
```bash
# Scale backend to 5 replicas
kubectl scale deployment backend -n social-spark --replicas=5

# Scale frontend to 3 replicas
kubectl scale deployment frontend -n social-spark --replicas=3
```

### Port Forwarding
```bash
# Access frontend locally
kubectl port-forward -n social-spark svc/frontend 5173:5173

# Access backend API locally
kubectl port-forward -n social-spark svc/backend 3001:3001

# Access MySQL locally
kubectl port-forward -n social-spark svc/mysql 3306:3306
```

## 5. Troubleshooting

### Pods not starting?
```bash
# Check pod status and events
kubectl describe pod -n social-spark <pod-name>

# Check deployment status
kubectl describe deployment -n social-spark backend
```

### MySQL connection issues?
```bash
# Execute into MySQL pod
kubectl exec -it -n social-spark $(kubectl get pods -n social-spark -l app=mysql -o jsonpath='{.items[0].metadata.name}') -- mysql -u root -p

# Test from backend pod
kubectl exec -it -n social-spark $(kubectl get pods -n social-spark -l app=backend -o jsonpath='{.items[0].metadata.name}') -- /bin/sh
```

### Check cluster resources
```bash
# Node capacity
kubectl describe nodes

# Resource usage
kubectl top nodes
kubectl top pods -n social-spark
```

## 6. Application Management

### Update Application
```bash
# Update image tag in deployment
kubectl set image deployment/backend -n social-spark backend=your-registry/social-spark-backend:v1.0.0

# Restart deployment
kubectl rollout restart deployment/backend -n social-spark
```

### Check Deployment History
```bash
# Rollout history
kubectl rollout history deployment/backend -n social-spark

# Revert to previous version
kubectl rollout undo deployment/backend -n social-spark
```

### Database Management
```bash
# Backup database
kubectl exec -it -n social-spark $(kubectl get pods -n social-spark -l app=mysql -o jsonpath='{.items[0].metadata.name}') \
  -- mysqldump -u social_spark_user -p --all-databases > backup.sql

# Restore database
cat backup.sql | kubectl exec -i -n social-spark $(kubectl get pods -n social-spark -l app=mysql -o jsonpath='{.items[0].metadata.name}') \
  -- mysql -u social_spark_user -p
```

## 7. Production Configuration

Before going to production:

1. **Change Passwords**
   - Update MySQL root password in `k8s/03-mysql-config.yaml`
   - Update backend DB password in `k8s/05-backend-config.yaml`

2. **Configure Domain**
   - Update domain names in `k8s/08-ingress.yaml`
   - Update DNS records to point to ingress IP

3. **Set Up HTTPS**
   - Install cert-manager
   - Configure Let's Encrypt issuer
   - Enable TLS in ingress

4. **Configure Registry**
   - Update image paths in deployments
   - Create image pull secrets if using private registry

5. **Enable Monitoring**
   - Access Prometheus: `kubectl port-forward -n social-spark svc/prometheus 9090:9090`
   - Configure alerts and dashboards
   - Set up log aggregation

## 8. Support Resources

- Kubernetes Documentation: https://kubernetes.io/docs/
- Ansible Documentation: https://docs.ansible.com/
- kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- Troubleshooting: See `K8S_ANSIBLE_DEPLOYMENT_GUIDE.md`

## 9. Next Steps

After successful deployment:

1. ✅ Access your application at the configured domain
2. ✅ Test user registration and login
3. ✅ Verify database connectivity
4. ✅ Monitor application performance
5. ✅ Set up automated backups
6. ✅ Configure SSL/TLS certificates
7. ✅ Set up log aggregation
8. ✅ Configure email notifications

---

For detailed information, refer to `K8S_ANSIBLE_DEPLOYMENT_GUIDE.md`
