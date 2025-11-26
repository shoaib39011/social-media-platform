# Kubernetes & Ansible Deployment Requirements

## System Requirements

### Minimum Infrastructure
- **3 Virtual Machines minimum**
  - 1 Master node
  - 2 Worker nodes
- **Per Node:**
  - 2 vCPUs minimum (4 recommended)
  - 4GB RAM minimum (8GB recommended)
  - 20GB disk space minimum
  - Ubuntu 20.04 LTS or later

### Network Requirements
- All nodes must be on the same network or properly routed
- SSH access from control machine to all nodes (port 22)
- Port 6443 (Kubernetes API) - internal
- Port 10250 (kubelet) - internal
- Port 3000-4000 range for services
- Outbound internet access for package downloads

## Control Machine (Ansible Controller)

### Operating System
- Ubuntu 20.04 LTS or later
- Debian 10+
- CentOS 7+
- macOS 10.14+
- Windows with WSL2

### Software Requirements

#### Ansible
```bash
# Ubuntu/Debian
sudo apt-get install ansible

# Or via pip (Python 3.8+)
pip install ansible>=2.10

# Verify installation
ansible --version
```

#### kubectl
```bash
# Download
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

#### Docker (for building images)
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add to group
sudo usermod -aG docker $USER

# Verify installation
docker --version
```

#### SSH Client
- Usually pre-installed on Linux/macOS
- Windows: Use OpenSSH or PuTTY

#### Git (optional, for cloning repos)
```bash
# Ubuntu/Debian
sudo apt-get install git

# macOS
brew install git
```

#### Python (for Ansible)
```bash
# Check version
python3 --version  # Should be 3.8 or higher

# Install pip
sudo apt-get install python3-pip

# Ansible requirements
pip install -r requirements.txt
```

## Kubernetes Node Requirements

### Operating System
- Ubuntu 20.04 LTS, 22.04 LTS
- Debian 10, 11
- CentOS 7, 8
- All nodes must have consistent OS version

### Required Packages (Auto-installed by Ansible)
- curl
- wget
- git
- apt-transport-https
- ca-certificates
- gnupg
- Docker CE 24.0
- kubelet 1.28.0
- kubeadm 1.28.0
- kubectl 1.28.0

## Container Registry Requirements

### For Local Testing
- Docker installed on control machine
- Local Docker daemon running

### For Production Deployment
- Docker Registry (Docker Hub, ECR, GCR, or self-hosted)
- Registry credentials configured
- Image names: 
  - `your-registry/social-spark-backend:latest`
  - `your-registry/social-spark-frontend:latest`

## Storage Requirements

### For Single Node Clusters
- hostPath storage (automatic)
- 10GB minimum for MySQL data

### For Multi-Node Clusters
- Network storage (NFS, iSCSI, or cloud provider)
- Or distributed storage (Ceph, Longhorn)
- 10GB minimum per storage volume

## Database Requirements

### MySQL
- Version: 8.0
- Storage: 10GB minimum
- User: social_spark_user
- Database: social_spark
- RAM: 256MB minimum

## Application Requirements

### Backend (Node.js)
- Node.js 18+
- Express.js 4.17+
- MySQL2 driver
- bcrypt for password hashing
- RAM: 256MB per pod
- CPU: 250m (0.25 cores)

### Frontend (React)
- React 18.3+
- Vite 5.0+
- Node 18+ (for build only)
- RAM: 128MB per pod
- CPU: 100m (0.1 cores)

### Dependencies Installation

#### Backend Dependencies
```bash
cd backend-project
npm install
```

#### Frontend Dependencies
```bash
cd social-spark-47-main
npm install
```

## Python Ansible Requirements

Create `requirements.txt`:
```
ansible>=2.10
ansible-core>=2.13
jinja2>=3.0
netaddr>=0.10.0
requests>=2.20.0
PyYAML>=5.4.1
kubernetes>=12.0.0
```

Install:
```bash
pip install -r requirements.txt
```

## Ansible Collections Required

Install collections:
```bash
ansible-galaxy collection install community.general
ansible-galaxy collection install community.kubernetes
ansible-galaxy collection install ansible.posix
```

Or from requirements file:
```bash
ansible-galaxy collection install -r requirements.yml
```

`requirements.yml`:
```yaml
---
collections:
  - name: community.general
    version: ">=5.0.0"
  - name: community.kubernetes
    version: ">=2.0.0"
  - name: ansible.posix
    version: ">=1.3.0"
```

## DNS Configuration

### Domain Names Required
- `social-spark.example.com` - Frontend
- `api.social-spark.example.com` - Backend API

### Configuration Options
1. **DNS Records**
   ```
   social-spark.example.com A 192.168.1.10
   api.social-spark.example.com A 192.168.1.10
   ```

2. **Local /etc/hosts (for testing)**
   ```
   192.168.1.10 social-spark.example.com
   192.168.1.10 api.social-spark.example.com
   ```

3. **Ingress IP Configuration**
   - Update after Ingress controller is deployed
   - Get IP: `kubectl get ingress -n social-spark`

## SSL/TLS Requirements (Optional but Recommended)

### cert-manager
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# For Let's Encrypt:
# - Valid domain name
# - Email for notifications
# - ACME HTTP-01 challenge support
```

## Resource Quotas

### Minimum Cluster Resources
```
Master Node:
- Memory: 4GB (2GB minimum)
- CPU: 2 cores
- Disk: 20GB

Worker Nodes (each):
- Memory: 4GB
- CPU: 2 cores
- Disk: 20GB

Total for 3-node cluster:
- Memory: 12GB
- CPU: 6 cores
- Disk: 60GB
```

### Application Resource Limits
```
MySQL:
- Memory: 256Mi requests, 512Mi limits
- CPU: 250m requests, 500m limits

Backend:
- Memory: 256Mi requests, 512Mi limits
- CPU: 250m requests, 500m limits (per pod)

Frontend:
- Memory: 128Mi requests, 256Mi limits
- CPU: 100m requests, 250m limits (per pod)
```

## Network Requirements

### Required Ports
```
Master Node:
- 6443: Kubernetes API
- 2379-2380: etcd
- 10250: kubelet API
- 10251: scheduler
- 10252: controller-manager

Worker Nodes:
- 10250: kubelet API
- 30000-32767: NodePort services

All Nodes:
- 53: DNS (coredns)
- 10256: kube-proxy healthz
```

### Application Ports
```
Frontend: 5173 (http), 443 (https via Ingress)
Backend API: 3001 (http), 443 (https via Ingress)
MySQL: 3306 (internal only)
Prometheus: 9090 (internal only)
```

## Firewall Rules

### Between Nodes
- Allow all traffic between nodes (private network assumed)

### To Nodes (from external)
- Port 22 (SSH) - restricted to admin machines
- Port 80 (HTTP) - for Ingress
- Port 443 (HTTPS) - for Ingress

### From Nodes (outbound)
- Allow all to download packages
- Allow to container registries
- Allow to NTP servers

## Backup Requirements

### Storage for Backups
- 10GB+ for database backups
- Location: `/backups` on master node or external storage

### Backup Schedule
- Daily database backups recommended
- Weekly Kubernetes manifest backups
- Store backups in multiple locations

## Monitoring & Logging (Optional)

### Prometheus (included)
- Storage: 5GB minimum
- Memory: 256MB per replica

### ELK Stack (optional)
- Elasticsearch
- Logstash
- Kibana

### Memory Requirements for Monitoring
- Prometheus: 256MB
- Total with monitoring: ~3GB RAM per pod

## API Keys and Secrets

### Generate Secrets Before Deployment
```bash
# MySQL root password
openssl rand -base64 32

# Database user password
openssl rand -base64 32

# JWT secret (if implemented)
openssl rand -base64 64
```

## Version Compatibility

### Supported Versions
- Kubernetes: 1.27, 1.28, 1.29
- Docker: 24.0, 24.0.1+
- Ansible: 2.10, 2.11, 2.12, 2.13+
- Ubuntu: 20.04 LTS, 22.04 LTS
- Node.js: 18.x, 20.x
- React: 18.x

### Upgrade Path
- Minor version upgrades (1.27 → 1.28): Supported
- Major version upgrades: Requires re-deployment

## Troubleshooting Checklist

- [ ] SSH keys configured for all nodes
- [ ] All nodes can ping each other
- [ ] No swap on any node
- [ ] Docker running on all nodes
- [ ] Sufficient disk space (20GB+ per node)
- [ ] Sufficient RAM (4GB+ per node)
- [ ] Internet connectivity for package downloads
- [ ] DNS resolves properly
- [ ] Firewall rules configured
- [ ] Time synchronized across nodes (NTP)

## Conclusion

Ensure all requirements are met before starting deployment. Missing requirements will cause playbooks to fail or behave unexpectedly.

Refer to `K8S_ANSIBLE_DEPLOYMENT_GUIDE.md` for detailed setup instructions.
