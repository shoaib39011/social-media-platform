# Social Spark Deployment Checklist

## Pre-Deployment Phase

### Infrastructure Setup
- [ ] 3+ Ubuntu servers provisioned (20.04 LTS or later)
- [ ] Servers assigned static IP addresses
- [ ] Network connectivity verified between all nodes
- [ ] SSH access configured from control machine
- [ ] SSH keys generated and distributed to all nodes
- [ ] Control machine has Ansible 2.10+ installed
- [ ] Control machine has kubectl installed
- [ ] Control machine has Docker installed

### Kubernetes Planning
- [ ] Master node IP recorded: _______________
- [ ] Worker node IPs recorded: _______________, _______________
- [ ] Determine storage solution (hostPath/NFS/Cloud)
- [ ] Plan pod network CIDR: ________________ (default: 10.244.0.0/16)
- [ ] Determine Kubernetes version: _____________ (1.28.0 recommended)
- [ ] Review resource requirements for your cluster

### Application Configuration
- [ ] Backend source code ready in `backend-project/`
- [ ] Frontend source code ready in `social-spark-47-main/`
- [ ] Database schema prepared
- [ ] Container registry account created (Docker Hub/ECR/GCR)
- [ ] Container registry credentials available
- [ ] Domain name(s) prepared for Ingress
- [ ] SSL/TLS certificate plan (self-signed or Let's Encrypt)

### Inventory Configuration
- [ ] `ansible/inventory.ini` updated with actual server IPs
- [ ] All hostnames resolvable via DNS or /etc/hosts
- [ ] Test SSH connectivity to each node:
  ```bash
  ansible -i inventory.ini all -m ping
  ```

## Deployment Phase

### Step 1: Install Kubernetes Infrastructure
- [ ] Run initial installation playbook:
  ```bash
  ansible-playbook install-kubernetes.yml
  ```
- [ ] Verify Docker is running on all nodes
- [ ] Verify kubelet is running on all nodes
- [ ] Check for any Ansible errors/warnings
- [ ] SSH into each node and verify installations

### Step 2: Initialize Kubernetes Cluster
- [ ] Run cluster initialization:
  ```bash
  ansible-playbook init-kubernetes.yml
  ```
- [ ] Verify cluster initialization succeeded
- [ ] Verify all nodes have joined the cluster:
  ```bash
  kubectl get nodes
  ```
- [ ] Verify Flannel CNI is deployed
- [ ] Verify metrics-server is deployed
- [ ] Check all kube-system pods are running

### Step 3: Prepare Container Images
- [ ] Build backend Docker image:
  ```bash
  docker build -t your-registry/social-spark-backend:latest ./backend-project
  ```
- [ ] Build frontend Docker image:
  ```bash
  docker build -t your-registry/social-spark-frontend:latest ./social-spark-47-main
  ```
- [ ] Push images to registry:
  ```bash
  docker push your-registry/social-spark-backend:latest
  docker push your-registry/social-spark-frontend:latest
  ```
- [ ] Verify images are accessible from cluster nodes

### Step 4: Update Deployment Manifests
- [ ] Update image registry in `k8s/06-backend-deployment.yaml`
- [ ] Update image registry in `k8s/07-frontend-deployment.yaml`
- [ ] Update MySQL passwords in `k8s/03-mysql-config.yaml`
- [ ] Update backend DB password in `k8s/05-backend-config.yaml`
- [ ] Update domain names in `k8s/08-ingress.yaml` if needed
- [ ] Update API base URL in `k8s/07-frontend-deployment.yaml`

### Step 5: Deploy Application
- [ ] Run deployment playbook:
  ```bash
  ansible-playbook deploy-app.yml
  ```
- [ ] Verify namespace is created:
  ```bash
  kubectl get namespace social-spark
  ```
- [ ] Verify PVs and PVCs are created:
  ```bash
  kubectl get pv,pvc -n social-spark
  ```
- [ ] Verify MySQL pod is running and ready:
  ```bash
  kubectl get pod -n social-spark -l app=mysql
  ```
- [ ] Verify backend pods are running:
  ```bash
  kubectl get pod -n social-spark -l app=backend
  ```
- [ ] Verify frontend pods are running:
  ```bash
  kubectl get pod -n social-spark -l app=frontend
  ```

## Post-Deployment Verification

### Verify All Components
- [ ] Get all resources:
  ```bash
  kubectl get all -n social-spark
  ```
- [ ] Verify services are created:
  ```bash
  kubectl get svc -n social-spark
  ```
- [ ] Verify ingress is created:
  ```bash
  kubectl get ingress -n social-spark
  ```
- [ ] Verify HPA is created:
  ```bash
  kubectl get hpa -n social-spark
  ```

### Test Database Connectivity
- [ ] Check MySQL logs for startup messages:
  ```bash
  kubectl logs -n social-spark -l app=mysql
  ```
- [ ] Execute into MySQL pod and verify database:
  ```bash
  kubectl exec -it -n social-spark <mysql-pod> -- mysql -u root -p -e "SHOW DATABASES;"
  ```
- [ ] Verify database user and permissions

### Test Backend Connectivity
- [ ] Check backend logs:
  ```bash
  kubectl logs -n social-spark -l app=backend
  ```
- [ ] Port forward to backend:
  ```bash
  kubectl port-forward -n social-spark svc/backend 3001:3001
  ```
- [ ] Test API endpoint:
  ```bash
  curl http://localhost:3001/api/test-db
  ```
- [ ] Verify database connection shows in logs

### Test Frontend Connectivity
- [ ] Check frontend logs:
  ```bash
  kubectl logs -n social-spark -l app=frontend
  ```
- [ ] Port forward to frontend:
  ```bash
  kubectl port-forward -n social-spark svc/frontend 5173:5173
  ```
- [ ] Access http://localhost:5173 in browser
- [ ] Verify page loads without errors
- [ ] Check browser console for any errors

### Test End-to-End Flow
- [ ] Register new user via frontend
- [ ] Verify user data in database
- [ ] Login with test credentials
- [ ] Create test post
- [ ] Verify post in database
- [ ] Check all API calls complete successfully

## Configuration Phase

### DNS Configuration
- [ ] Update DNS records for domain (if applicable):
  ```
  social-spark.example.com A <ingress-ip>
  api.social-spark.example.com A <ingress-ip>
  ```
- [ ] Or update local /etc/hosts for testing
- [ ] Test DNS resolution:
  ```bash
  nslookup social-spark.example.com
  ```

### HTTPS/TLS Configuration (Optional)
- [ ] Install cert-manager:
  ```bash
  kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
  ```
- [ ] Wait for cert-manager to be ready
- [ ] Create ClusterIssuer for Let's Encrypt
- [ ] Update Ingress with TLS configuration
- [ ] Verify certificate is issued:
  ```bash
  kubectl get certificate -n social-spark
  ```

### Application Configuration
- [ ] Verify environment variables are set correctly
- [ ] Check ConfigMaps:
  ```bash
  kubectl get configmap -n social-spark
  ```
- [ ] Check Secrets:
  ```bash
  kubectl get secret -n social-spark
  ```
- [ ] Test application functionality end-to-end

## Monitoring & Logging Setup

### Monitoring
- [ ] Verify Prometheus is running:
  ```bash
  kubectl get pod -n social-spark -l app=prometheus
  ```
- [ ] Access Prometheus UI:
  ```bash
  kubectl port-forward -n social-spark svc/prometheus 9090:9090
  ```
- [ ] Verify metrics are being collected
- [ ] Create dashboards for key metrics

### Logging
- [ ] Verify all components are logging properly
- [ ] Check log retention policies
- [ ] Set up log aggregation if needed
- [ ] Configure log rotation

### Alerting (Optional)
- [ ] Configure Prometheus alerts
- [ ] Set up alert notification channels
- [ ] Test alert triggering
- [ ] Document on-call procedures

## Backup & Disaster Recovery

### Backup Configuration
- [ ] Create backup directory:
  ```bash
  mkdir -p /backups
  ```
- [ ] Schedule database backups:
  ```bash
  ansible-playbook backup-restore.yml
  ```
- [ ] Test backup restore process
- [ ] Verify backup storage location
- [ ] Document backup retention policy

### Disaster Recovery Plan
- [ ] Document recovery procedures
- [ ] Test cluster recovery from backups
- [ ] Document critical data locations
- [ ] Create runbook for common issues

## Performance Tuning

### Resource Limits
- [ ] Review resource requests/limits for all pods
- [ ] Adjust based on actual usage patterns
- [ ] Monitor resource utilization:
  ```bash
  kubectl top nodes
  kubectl top pods -n social-spark
  ```

### Scaling Configuration
- [ ] Review HPA settings in `k8s/09-hpa.yaml`
- [ ] Adjust min/max replicas based on load
- [ ] Test auto-scaling behavior
- [ ] Monitor scaling events in logs

### Database Optimization
- [ ] Enable MySQL query log if needed
- [ ] Review slow query log
- [ ] Optimize indexes for common queries
- [ ] Consider connection pooling

## Security Hardening

### Access Control
- [ ] Review RBAC policies
- [ ] Create service accounts for applications
- [ ] Limit pod permissions
- [ ] Enable Pod Security Standards

### Network Security
- [ ] Implement NetworkPolicies if needed
- [ ] Restrict ingress/egress traffic
- [ ] Enable network segmentation
- [ ] Review firewall rules

### Secrets Management
- [ ] Change all default passwords
- [ ] Rotate MySQL credentials
- [ ] Secure API keys and tokens
- [ ] Consider using external secret management (Vault)

### Container Security
- [ ] Scan images for vulnerabilities
- [ ] Use minimal base images
- [ ] Run containers as non-root
- [ ] Enable admission controllers

## Final Validation

### Functionality Testing
- [ ] All user flows work correctly
- [ ] Database operations work properly
- [ ] API endpoints respond correctly
- [ ] Frontend displays properly
- [ ] Error handling works as expected

### Performance Testing
- [ ] Load test with expected traffic
- [ ] Verify auto-scaling works
- [ ] Check response times
- [ ] Monitor resource usage

### Documentation
- [ ] Document deployment configuration
- [ ] Record access credentials (securely)
- [ ] Document troubleshooting procedures
- [ ] Create runbooks for common tasks

### Handover
- [ ] Train operations team
- [ ] Provide documentation
- [ ] Establish monitoring alerts
- [ ] Set up support channels
- [ ] Schedule follow-up review

## Post-Deployment Support

### Monitoring
- [ ] Monitor system for 24 hours post-deployment
- [ ] Address any issues that arise
- [ ] Fine-tune performance settings

### User Communication
- [ ] Notify users of deployment
- [ ] Provide access information
- [ ] Document known issues (if any)
- [ ] Set up support contact

### Continuous Improvement
- [ ] Gather performance metrics
- [ ] Identify optimization opportunities
- [ ] Plan for future scaling
- [ ] Schedule regular reviews

---

## Deployment Sign-Off

- [ ] All phases completed
- [ ] All tests passed
- [ ] Documentation complete
- [ ] Team trained and ready
- [ ] Production ready

**Deployment Date**: _______________

**Deployed By**: _______________

**Reviewed By**: _______________

**Approved By**: _______________

---

For issues or clarifications, refer to:
- K8S_ANSIBLE_DEPLOYMENT_GUIDE.md
- QUICKSTART.md
- REQUIREMENTS.md
