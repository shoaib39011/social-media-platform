# Jenkins Setup Guide for Social Spark Platform

## 🚀 Overview
This guide helps you set up Jenkins to build your multi-technology stack:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + PostgreSQL
- **Demo**: Spring Boot + Maven + MySQL

## 📋 Prerequisites

### 1. Jenkins Installation
- Install Jenkins on your server/local machine
- Ensure Jenkins is running on `http://localhost:8080`

### 2. Required Jenkins Plugins
Install these plugins in Jenkins (Manage Jenkins → Plugins):

```
✅ Pipeline (Pipeline Plugin)
✅ Git (Git Plugin)
✅ NodeJS (NodeJS Plugin)
✅ Maven Integration (Maven Integration Plugin)
✅ Build Timeout (Build Timeout Plugin)
✅ Workspace Cleanup (Workspace Cleanup Plugin)
✅ Pipeline Stage View (Pipeline Stage View Plugin)
```

### 3. Global Tool Configuration
Configure tools in Jenkins (Manage Jenkins → Tools):

#### Node.js Configuration:
- **Name**: `NodeJS-20`
- **Version**: Node.js 20.x
- **Global npm packages**: (leave empty)

#### Maven Configuration:
- **Name**: `Maven-3.9`
- **Version**: Maven 3.9.x
- **Install automatically**: ✅

## 🔧 Jenkins Job Setup

### Step 1: Create New Pipeline Job
1. Go to Jenkins Dashboard
2. Click "New Item"
3. Enter job name: `social-spark-platform`
4. Select "Pipeline"
5. Click "OK"

### Step 2: Configure Pipeline
1. **General Settings**:
   - ✅ GitHub project
   - Project URL: `https://github.com/shoaib39011/social-media-platform`

2. **Build Triggers**:
   - ✅ GitHub hook trigger for GITScm polling
   - ✅ Poll SCM: `H/5 * * * *` (every 5 minutes)

3. **Pipeline Configuration**:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/shoaib39011/social-media-platform.git`
   - Branch: `*/main`
   - Script Path: `social-spark-47-main/Jenkinsfile`

### Step 3: Environment Variables (Optional)
Add these in Pipeline configuration if needed:
```
NODE_ENV=production
BACKEND_PORT=3001
FRONTEND_PORT=4173
SPRING_PORT=8080
```

## 🏗️ Pipeline Stages Explained

### 1. **Checkout** 📥
- Pulls latest code from GitHub repository
- Switches to specified branch (main)

### 2. **Install Dependencies** 📦
**Parallel execution**:
- **Frontend**: `npm install` in `social-spark-47-main/`
- **Backend**: `npm install` in `backend-project/`

### 3. **Build Applications** 🔨
**Parallel execution**:
- **Frontend**: `npm run build` (creates production build)
- **Spring Boot**: `mvn clean compile` (compiles Java code)

### 4. **Test Applications** 🧪
**Parallel execution**:
- **Frontend**: `npm test --watchAll=false`
- **Backend**: `npm test` (if tests exist)
- **Spring Boot**: `mvn test`

### 5. **Package Applications** 📦
**Parallel execution**:
- **Spring Boot**: `mvn clean package` (creates JAR file)
- **Frontend**: Archives `dist/` folder

### 6. **Quality Checks** ✅
- Placeholder for SonarQube or other quality tools
- Code coverage analysis
- Security scans

### 7. **Deploy to Staging** 🚀
- Only runs for `main` branch
- Placeholder for deployment scripts

## 📊 Build Artifacts

The pipeline will create these artifacts:
- **Frontend**: `social-spark-47-main/dist/**/*`
- **Spring Boot**: `demo/target/*.jar`
- **Build logs**: Available in Jenkins UI

## 🔍 Monitoring & Notifications

### Build Status
Monitor builds via:
- Jenkins Dashboard
- Email notifications (configure SMTP)
- Slack/Teams integration
- GitHub status checks

### Build History
- View build trends in Jenkins
- Compare build times
- Track success/failure rates

## 🚨 Troubleshooting

### Common Issues:

#### 1. **Node.js not found**
```bash
Solution: Configure NodeJS tool in Global Tool Configuration
Name: NodeJS-20, Version: 20.x
```

#### 2. **Maven not found**
```bash
Solution: Configure Maven tool in Global Tool Configuration
Name: Maven-3.9, Version: 3.9.x
```

#### 3. **Git authentication issues**
```bash
Solution: Add GitHub credentials in Jenkins
Manage Jenkins → Credentials → Add GitHub token
```

#### 4. **Build timeouts**
```bash
Solution: Add timeout in pipeline:
options {
    timeout(time: 30, unit: 'MINUTES')
}
```

#### 5. **Test failures**
```bash
Current pipeline handles test failures gracefully
Check logs for specific test issues
```

## 🔐 Security Best Practices

1. **Credentials Management**:
   - Store database passwords in Jenkins credentials
   - Use environment variables for sensitive data
   - Never commit secrets to repository

2. **Access Control**:
   - Configure proper user permissions
   - Use Matrix-based security
   - Audit user access regularly

3. **Pipeline Security**:
   - Sandbox untrusted pipeline scripts
   - Review pipeline changes
   - Use approved libraries only

## 📈 Performance Optimization

1. **Parallel Execution**:
   - Frontend and backend builds run in parallel
   - Reduces total build time by ~50%

2. **Caching**:
   - Add npm cache for faster installs
   - Maven local repository caching
   - Docker layer caching if using containers

3. **Resource Management**:
   - Configure build agents appropriately
   - Monitor CPU/memory usage
   - Scale agents based on load

## 🔄 Continuous Deployment

To extend this pipeline for CD:

1. **Add deployment stages**:
   ```groovy
   stage('Deploy to Production') {
       when { branch 'main' }
       steps {
           // Add deployment scripts
       }
   }
   ```

2. **Environment-specific deployments**:
   - Dev: Auto-deploy on every commit
   - Staging: Auto-deploy on main branch
   - Production: Manual approval required

3. **Rollback capability**:
   - Keep previous versions
   - Implement blue-green deployment
   - Health checks post-deployment

## 📞 Support

For issues with this Jenkins setup:
1. Check Jenkins logs: `Manage Jenkins → System Log`
2. Review build console output
3. Check GitHub webhook configuration
4. Verify tool configurations

## 🎯 Next Steps

1. **Set up Jenkins** with required plugins
2. **Configure tools** (Node.js, Maven)
3. **Create pipeline job** with provided configuration
4. **Test the pipeline** with a sample commit
5. **Add deployment scripts** for your target environment
6. **Configure notifications** for build status
7. **Set up monitoring** and alerting

Happy building! 🚀