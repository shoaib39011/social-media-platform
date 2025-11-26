# Social Spark - Complete Project Presentation & Implementation Guide

## Project Overview

Social Spark is a full-stack social media application with:
- ✅ **React Frontend** (Vite + TypeScript)
- ✅ **Node.js Express Backend** (MySQL)
- ✅ **MySQL Database**
- ✅ **Docker Containerization**
- ✅ **Kubernetes Orchestration**
- ✅ **Ansible Automation**
- ✅ **Jenkins CI/CD Pipeline**

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Ansible Automation](#ansible-automation)
6. [Jenkins CI/CD](#jenkins-cicd)
7. [Commands Reference](#commands-reference)

---

## Project Structure

```
social-spark-47-main/
├── backend-project/                    # Node.js Express Backend
│   ├── src/
│   │   ├── server.js                  # Express server
│   │   ├── config/
│   │   │   └── database.js            # MySQL connection
│   │   └── routes/
│   ├── package.json
│   └── Dockerfile
│
├── social-spark-47-main/              # React Frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── MessagesPage.tsx
│   │   └── components/
│   ├── package.json
│   └── vite.config.ts
│
├── docker/                             # Docker Configuration
│   ├── docker-compose.yml             # Local development stack
│   ├── Dockerfile.backend             # Backend image
│   └── Dockerfile.frontend            # Frontend image
│
├── k8s/                               # Kubernetes Manifests
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
│
├── ansible/                           # Ansible Playbooks
│   ├── inventory.ini                 # Server inventory
│   ├── ansible.cfg
│   ├── install-kubernetes.yml
│   ├── init-kubernetes.yml
│   ├── deploy-app.yml
│   ├── manage-app.yml
│   ├── backup-restore.yml
│   └── master-deploy.yml
│
├── Jenkinsfile                        # CI/CD Pipeline
├── K8S_ANSIBLE_DEPLOYMENT_GUIDE.md
├── QUICKSTART.md
├── REQUIREMENTS.md
└── DEPLOYMENT_CHECKLIST.md
```

---

## Local Development Setup

### Prerequisites
```bash
# Check system requirements
- Node.js 18+ installed
- MySQL 8.0+ running
- npm or yarn package manager
- Git for version control
```

### Step 1: Clone and Setup Backend
```bash
# Navigate to backend directory
cd backend-project

# Install dependencies
npm install

# Create .env file (if needed)
cat > .env << EOF
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=ssa@100ssa
DB_NAME=social_spark
PORT=3001
EOF

# Start MySQL (ensure it's running on your system)
# Windows: Use MySQL Workbench or command line
# Linux/Mac: brew services start mysql

# Initialize database (if needed)
npm run init-db

# Start backend server
npm start

# Or for development with auto-reload
npm run dev
```

**Backend runs on:** `http://localhost:3001`

### Step 2: Setup Frontend
```bash
# Navigate to frontend directory
cd social-spark-47-main

# Install dependencies
npm install

# Start development server
npm run dev

# Or build for production
npm run build
```

**Frontend runs on:** `http://localhost:5173`

### Step 3: Test Connection
```bash
# Test backend API
curl http://localhost:3001/api/test-db

# Response should show database connection status
# Expected: {"success":true,"timestamp":"2025-11-26T..."}
```

### Verification Checklist
- [ ] Backend server running on port 3001
- [ ] Frontend accessible on port 5173
- [ ] Can register new user via frontend
- [ ] Can login with credentials
- [ ] Can view/edit profile
- [ ] Database records appear correctly

---

## Docker Deployment

### Prerequisites
```bash
# Install Docker and Docker Compose
- Docker 24.0+
- Docker Compose 2.0+

# Verify installation
docker --version
docker-compose --version
```

### Step 1: Build Docker Images
```bash
# Build backend image
docker build -t social-spark-backend:latest -f docker/Dockerfile.backend ./backend-project

# Build frontend image
docker build -t social-spark-frontend:latest -f docker/Dockerfile.frontend ./social-spark-47-main

# Verify images
docker images | grep social-spark
```

### Step 2: Run with Docker Compose
```bash
# Navigate to docker directory
cd docker

# Start all services (MySQL, Backend, Frontend)
docker-compose up -d

# Check running containers
docker-compose ps

# Output should show:
# social-spark-mysql      - RUNNING
# social-spark-backend    - RUNNING
# social-spark-frontend   - RUNNING
```

### Step 3: Verify Services
```bash
# Check MySQL is ready
docker-compose logs mysql | grep "ready for connections"

# Check backend logs
docker-compose logs backend

# Check frontend logs
docker-compose logs frontend

# Test API
curl http://localhost:3001/api/test-db

# Access frontend
# Open browser: http://localhost:5173
```

### Step 4: Stop Services
```bash
# Stop all containers
docker-compose down

# Remove volumes (careful - deletes data)
docker-compose down -v
```

### Docker Useful Commands
```bash
# View logs
docker-compose logs -f backend        # Follow backend logs
docker-compose logs mysql             # View MySQL logs

# Execute commands
docker-compose exec mysql mysql -u root -p   # Access MySQL CLI
docker-compose exec backend npm test           # Run backend tests

# Rebuild images
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Kubernetes Deployment

### Prerequisites
```bash
# System Requirements
- 3+ Ubuntu servers (20.04 LTS or later)
  * 1 Master node
  * 2+ Worker nodes
- 2+ vCPUs per node
- 4GB RAM per node
- SSH access configured
- Ansible 2.10+ installed on control machine
- kubectl installed on control machine
```

### Step 1: Prepare Kubernetes Cluster

#### Option A: Using Ansible (Automated)
```bash
# Navigate to ansible directory
cd ansible

# Step 1: Update inventory with your server IPs
vim inventory.ini

# Expected format:
# [k8s_masters]
# master1 ansible_host=192.168.1.10 ansible_user=ubuntu
#
# [k8s_workers]
# worker1 ansible_host=192.168.1.11 ansible_user=ubuntu
# worker2 ansible_host=192.168.1.12 ansible_user=ubuntu

# Step 2: Setup SSH keys
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa
for host in 192.168.1.10 192.168.1.11 192.168.1.12; do
    ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@$host
done

# Step 3: Verify SSH connectivity
ansible -i inventory.ini all -m ping

# Expected output: All hosts should show "pong"

# Step 4: Install Kubernetes
ansible-playbook install-kubernetes.yml

# Step 5: Initialize cluster
ansible-playbook init-kubernetes.yml

# Step 6: Deploy application
ansible-playbook deploy-app.yml
```

#### Option B: Manual Setup (if needed)
```bash
# On Master Node
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Install CNI (Flannel)
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

# Get join command for workers
kubeadm token create --print-join-command

# On Worker Nodes
# Copy and run the join command from above
sudo kubeadm join 192.168.1.10:6443 --token ... --discovery-token-ca-cert-hash ...
```

### Step 2: Deploy Application Manifests
```bash
# Apply all Kubernetes manifests
cd k8s
kubectl apply -f 01-namespace.yaml
kubectl apply -f 02-mysql-pv.yaml
kubectl apply -f 03-mysql-config.yaml
kubectl apply -f 04-mysql-deployment.yaml
kubectl apply -f 05-backend-config.yaml
kubectl apply -f 06-backend-deployment.yaml
kubectl apply -f 07-frontend-deployment.yaml
kubectl apply -f 08-ingress.yaml
kubectl apply -f 09-hpa.yaml
kubectl apply -f 10-monitoring.yaml

# Or apply all at once
kubectl apply -f .
```

### Step 3: Verify Kubernetes Deployment
```bash
# Check cluster status
kubectl cluster-info
kubectl get nodes

# Check namespace
kubectl get namespace social-spark

# Check all resources
kubectl get all -n social-spark

# Check pods status
kubectl get pods -n social-spark

# Expected output:
# NAME                        READY   STATUS    RESTARTS   AGE
# mysql-xxxxx                 1/1     Running   0          2m
# backend-xxxxx               1/1     Running   0          2m
# frontend-xxxxx              1/1     Running   0          2m
# backend-xxxxx               1/1     Running   0          2m
# frontend-xxxxx              1/1     Running   0          2m

# Check services
kubectl get svc -n social-spark

# Check Ingress
kubectl get ingress -n social-spark

# Check HPA
kubectl get hpa -n social-spark

# View logs
kubectl logs -n social-spark deployment/backend
kubectl logs -n social-spark deployment/frontend
kubectl logs -n social-spark deployment/mysql
```

### Step 4: Access Application
```bash
# Port forward to access locally
kubectl port-forward -n social-spark svc/frontend 5173:5173 &
kubectl port-forward -n social-spark svc/backend 3001:3001 &

# Test API
curl http://localhost:3001/api/test-db

# Access frontend
# Open browser: http://localhost:5173

# For production access:
# Update DNS: social-spark.example.com -> Ingress IP
# kubectl get ingress -n social-spark
```

### Step 5: Monitor Deployment
```bash
# Watch pod status
kubectl get pods -n social-spark -w

# Get detailed pod info
kubectl describe pod -n social-spark <pod-name>

# View all events
kubectl get events -n social-spark --sort-by='.lastTimestamp'

# Check resource usage
kubectl top nodes
kubectl top pods -n social-spark

# Access Prometheus metrics
kubectl port-forward -n social-spark svc/prometheus 9090:9090
# Visit: http://localhost:9090
```

---

## Ansible Automation

### Playbook Reference

#### 1. Install Kubernetes Components
```bash
ansible-playbook ansible/install-kubernetes.yml
```
**What it does:**
- Updates system packages on all nodes
- Installs Docker
- Installs kubelet, kubeadm, kubectl
- Configures kernel modules
- Disables swap

**Time:** ~10-15 minutes per node

#### 2. Initialize Kubernetes Cluster
```bash
ansible-playbook ansible/init-kubernetes.yml
```
**What it does:**
- Initializes Kubernetes master
- Joins worker nodes to cluster
- Installs Flannel CNI
- Installs metrics-server
- Configures kubectl

**Time:** ~5-10 minutes

#### 3. Deploy Application
```bash
ansible-playbook ansible/deploy-app.yml
```
**What it does:**
- Creates namespace
- Deploys MySQL with storage
- Deploys backend (2 replicas)
- Deploys frontend (2 replicas)
- Configures Ingress
- Sets up HPA
- Deploys Prometheus

**Time:** ~5 minutes

#### 4. Manage Application
```bash
# Scale backend to 5 replicas
ansible-playbook ansible/manage-app.yml -e "backend_replicas=5"

# Update image tag
ansible-playbook ansible/manage-app.yml -e "new_image_tag=v1.0.0"

# Monitor health
ansible-playbook ansible/manage-app.yml
```

#### 5. Backup and Restore
```bash
# Create backup
ansible-playbook ansible/backup-restore.yml --tags backup

# Restore from backup
ansible-playbook ansible/backup-restore.yml --tags restore -e "backup_file=/backups/backup_restore.tar.gz"
```

#### 6. Master Deployment (All-in-One)
```bash
# Execute entire deployment in sequence
ansible-playbook ansible/master-deploy.yml

# This runs:
# 1. install-kubernetes.yml
# 2. init-kubernetes.yml
# 3. deploy-app.yml
```

---

## Jenkins CI/CD

### Prerequisites
```bash
# Jenkins server (2GB RAM, 1 vCPU minimum)
# Java 11+ installed
# Git installed
```

### Step 1: Access Jenkins
```bash
# Jenkins UI (usually)
http://<jenkins-host>:8080

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### Step 2: Create Pipeline Job
```bash
# In Jenkins:
1. Click "New Item"
2. Enter job name: "Social-Spark-Pipeline"
3. Select "Pipeline"
4. Click OK

# Configure:
1. Go to "Pipeline" section
2. Select "Pipeline script from SCM"
3. Set SCM to "Git"
4. Enter repository: https://github.com/shoaib39011/social-media-platform.git
5. Set branch: */main
6. Script path: Jenkinsfile
7. Click "Save"
```

### Step 3: Trigger Build
```bash
# Manual trigger:
1. Click "Build Now"

# Automatic trigger (webhook):
1. Go to GitHub repository settings
2. Add webhook: http://<jenkins-host>:8080/github-webhook/
3. Select "push events"
4. Click "Add webhook"

# Now builds trigger on every push
```

### Step 4: Monitor Build
```bash
# View build progress
1. Click build number in "Build History"
2. Click "Console Output"
3. Watch logs in real-time

# Check specific stages:
- Checkout: Git clone
- Install Dependencies: npm install
- Build Frontend: vite build
- Verify Backend: Database connection test
- Build Applications: Compile and package
- Test: Run test suite
- Package: Create artifacts
- Deploy: Upload to staging
```

### Jenkins Pipeline Stages
```
┌─────────────────────────────────────────────────┐
│ 1. Checkout - Clone source code                │
├─────────────────────────────────────────────────┤
│ 2. Install Dependencies - npm install           │
│    ├─ Frontend Dependencies                    │
│    └─ Backend Dependencies                     │
├─────────────────────────────────────────────────┤
│ 3. Build Applications - npm run build           │
│    ├─ Build Frontend (Vite)                    │
│    └─ Verify Backend                           │
├─────────────────────────────────────────────────┤
│ 4. Test Applications - npm test                 │
│    ├─ Frontend Tests                           │
│    └─ Backend Tests                            │
├─────────────────────────────────────────────────┤
│ 5. Package Applications - Archive               │
│    ├─ Frontend Build                           │
│    ├─ Backend Source                           │
│    └─ MySQL Init Scripts                       │
├─────────────────────────────────────────────────┤
│ 6. Quality Checks - Linting & Analysis         │
├─────────────────────────────────────────────────┤
│ 7. Deploy to Staging - Upload artifacts        │
└─────────────────────────────────────────────────┘
```

---

## Commands Reference

### Backend Commands
```bash
# Install dependencies
cd backend-project
npm install

# Start server
npm start

# Start with auto-reload
npm run dev

# Initialize database
npm run init-db

# Check database
node src/config/checkDatabase.js

# Test API endpoints
curl -X GET http://localhost:3001/api/test-db
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","username":"testuser","city":"City"}'
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Frontend Commands
```bash
# Install dependencies
cd social-spark-47-main
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm start

# Lint code
npm run lint
```

### Docker Commands
```bash
# Build images
docker build -t social-spark-backend:latest -f docker/Dockerfile.backend ./backend-project
docker build -t social-spark-frontend:latest -f docker/Dockerfile.frontend ./social-spark-47-main

# Run with Compose
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f backend

# Stop services
docker-compose -f docker/docker-compose.yml down
```

### Kubernetes Commands
```bash
# Check cluster
kubectl cluster-info
kubectl get nodes
kubectl get nodes -o wide

# Check application
kubectl get all -n social-spark
kubectl get pods -n social-spark -w
kubectl get svc -n social-spark
kubectl get ingress -n social-spark

# View logs
kubectl logs -n social-spark deployment/backend -f
kubectl logs -n social-spark deployment/frontend -f
kubectl logs -n social-spark deployment/mysql

# Execute commands
kubectl exec -it -n social-spark <pod-name> -- /bin/sh
kubectl exec -it -n social-spark mysql-xxx -- mysql -u root -p

# Port forward
kubectl port-forward -n social-spark svc/backend 3001:3001
kubectl port-forward -n social-spark svc/frontend 5173:5173

# Scale deployment
kubectl scale deployment backend -n social-spark --replicas=5

# Update image
kubectl set image deployment/backend -n social-spark backend=your-registry/social-spark-backend:v1.0.0

# View events
kubectl get events -n social-spark --sort-by='.lastTimestamp'

# Describe resource
kubectl describe deployment -n social-spark backend
```

### Ansible Commands
```bash
# Check connectivity
ansible -i ansible/inventory.ini all -m ping

# Run playbook
ansible-playbook ansible/install-kubernetes.yml
ansible-playbook ansible/init-kubernetes.yml
ansible-playbook ansible/deploy-app.yml
ansible-playbook ansible/manage-app.yml
ansible-playbook ansible/backup-restore.yml

# Dry run (preview changes)
ansible-playbook ansible/install-kubernetes.yml --check

# Verbose output
ansible-playbook ansible/install-kubernetes.yml -v
```

### Git Commands
```bash
# Clone repository
git clone https://github.com/shoaib39011/social-media-platform.git

# Check status
git status

# View commit history
git log --oneline

# Make changes and commit
git add .
git commit -m "Your message"
git push origin main

# View branches
git branch -a

# Create new branch
git checkout -b feature/your-feature
```

---

## Troubleshooting Commands

### Backend Issues
```bash
# Check if port is in use
lsof -i :3001      # Linux/Mac
netstat -ano | findstr :3001  # Windows

# Check MySQL connection
node src/config/checkDatabase.js

# View server logs
tail -f /var/log/social-spark/backend.log

# Restart backend
npm start
```

### Frontend Issues
```bash
# Check Vite build
npm run build

# Check for errors
npm run build 2>&1 | head -50

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Kubernetes Issues
```bash
# Check pod status
kubectl describe pod -n social-spark <pod-name>

# Check resource constraints
kubectl top pods -n social-spark

# Check node status
kubectl describe node <node-name>

# View cluster events
kubectl get events --all-namespaces --sort-by='.lastTimestamp'

# Check ingress
kubectl describe ingress -n social-spark

# Test service connectivity
kubectl exec -it -n social-spark <pod> -- curl http://mysql:3306
```

### Docker Issues
```bash
# Check image existence
docker images | grep social-spark

# View container logs
docker logs social-spark-backend

# Check resource usage
docker stats social-spark-mysql

# Rebuild image
docker build --no-cache -t social-spark-backend:latest -f docker/Dockerfile.backend ./backend-project
```

---

## Testing the Application

### Frontend Testing
```bash
# Open browser and test:
1. Navigate to http://localhost:5173
2. Register new user
3. Login with credentials
4. View profile
5. Create post
6. View posts feed
7. Send message
8. Logout
```

### Backend API Testing
```bash
# Test endpoints with curl or Postman

# 1. Test database connection
curl http://localhost:3001/api/test-db

# 2. Register user
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123",
    "fullName":"John Doe",
    "username":"johndoe",
    "city":"New York"
  }'

# 3. Login user
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"password123"
  }'

# 4. Get profile
curl "http://localhost:3001/api/profile?userId=1"

# 5. Update profile
curl -X PATCH http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "userId":1,
    "fullName":"John Updated",
    "username":"johndoe2",
    "bio":"Updated bio",
    "city":"Los Angeles"
  }'
```

---

## Performance Metrics

### Application Metrics
```bash
# Check pod resource usage
kubectl top pods -n social-spark

# Expected output:
# NAME                     CPU(cores)   MEMORY(Mi)
# mysql-xxx                50m          256Mi
# backend-xxx              25m          128Mi
# backend-xxx              25m          128Mi
# frontend-xxx             10m          64Mi
# frontend-xxx             10m          64Mi

# Check node resource usage
kubectl top nodes

# Monitor CPU and memory scaling
kubectl get hpa -n social-spark
```

### Database Metrics
```bash
# Check database size
kubectl exec -it -n social-spark mysql-xxx -- \
  mysql -u root -p -e "SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size FROM information_schema.TABLES WHERE table_schema = 'social_spark';"

# Check connections
kubectl exec -it -n social-spark mysql-xxx -- \
  mysql -u root -p -e "SHOW PROCESSLIST;"
```

---

## Production Considerations

### Security Checklist
- [ ] Change MySQL root password in `k8s/03-mysql-config.yaml`
- [ ] Change database user password in `k8s/05-backend-config.yaml`
- [ ] Enable SSL/TLS certificates (cert-manager)
- [ ] Set up network policies for pod communication
- [ ] Enable RBAC for Kubernetes access control
- [ ] Configure firewall rules
- [ ] Use private container registry
- [ ] Enable pod security standards
- [ ] Implement rate limiting
- [ ] Set up WAF (Web Application Firewall)

### Backup Strategy
- [ ] Schedule daily MySQL backups: `ansible-playbook ansible/backup-restore.yml --tags backup`
- [ ] Store backups in multiple locations
- [ ] Test backup restoration regularly
- [ ] Archive old backups to cold storage
- [ ] Monitor backup success in logs

### Monitoring Setup
```bash
# Access Prometheus
kubectl port-forward -n social-spark svc/prometheus 9090:9090

# Check metrics:
# - container_cpu_usage_seconds_total
# - container_memory_usage_bytes
# - http_requests_total
# - mysql_global_status_threads_connected
```

### Logging Setup (Optional)
```bash
# View application logs
kubectl logs -f -n social-spark deployment/backend
kubectl logs -f -n social-spark deployment/frontend

# Setup ELK Stack (optional)
# Or use cloud logging services (AWS CloudWatch, Google Cloud Logging)
```

---

## Useful Resources

### Documentation Links
- **K8S_ANSIBLE_DEPLOYMENT_GUIDE.md** - Complete deployment guide
- **QUICKSTART.md** - Quick start instructions
- **REQUIREMENTS.md** - System requirements
- **DEPLOYMENT_CHECKLIST.md** - Deployment validation
- **Jenkinsfile** - CI/CD pipeline definition

### External Resources
- Kubernetes Docs: https://kubernetes.io/docs/
- Ansible Docs: https://docs.ansible.com/
- Docker Docs: https://docs.docker.com/
- kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- Express.js Docs: https://expressjs.com/
- React Docs: https://react.dev/
- MySQL Docs: https://dev.mysql.com/doc/
- Jenkins Docs: https://www.jenkins.io/doc/

---

## Quick Reference Summary

| Task | Command | Location |
|------|---------|----------|
| Local Dev - Backend | `npm start` | `backend-project/` |
| Local Dev - Frontend | `npm run dev` | `social-spark-47-main/` |
| Docker - Build | `docker-compose up -d` | `docker/` |
| Docker - Stop | `docker-compose down` | `docker/` |
| K8s - Deploy | `ansible-playbook ansible/master-deploy.yml` | `ansible/` |
| K8s - Check Status | `kubectl get all -n social-spark` | Anywhere |
| Jenkins - View | Open browser to Jenkins URL | N/A |
| Backup Database | `ansible-playbook ansible/backup-restore.yml --tags backup` | `ansible/` |

---

## Support & Next Steps

1. **For Detailed Setup**: Read `K8S_ANSIBLE_DEPLOYMENT_GUIDE.md`
2. **For Quick Start**: Follow `QUICKSTART.md`
3. **For System Requirements**: Check `REQUIREMENTS.md`
4. **For Validation**: Use `DEPLOYMENT_CHECKLIST.md`

**Questions or Issues?** Refer to troubleshooting sections above or check documentation files.

---

**Last Updated:** November 26, 2025
**Version:** 1.0.0
**Status:** Production Ready
