# Jenkins Pipeline Setup - Step by Step Guide

## Part 1: Jenkins Configuration

### 1. Install Required Plugins
In Jenkins Dashboard → Manage Jenkins → Manage Plugins:
- [x] NodeJS Plugin
- [x] Maven Integration Plugin
- [x] Pipeline Plugin (usually pre-installed)
- [x] Git Plugin (usually pre-installed)
- [x] Workspace Cleanup Plugin

### 2. Configure Global Tools
Go to Jenkins Dashboard → Manage Jenkins → Global Tool Configuration:

#### A. NodeJS Configuration:
- Click "Add NodeJS"
- Name: `NodeJS-20` (EXACT name as in Jenkinsfile)
- Version: Select "NodeJS 20.x.x" (latest LTS)
- Check "Install automatically"
- Save

#### B. Maven Configuration:
- Click "Add Maven"
- Name: `Maven-3.9` (EXACT name as in Jenkinsfile)
- Version: Select "3.9.x" (latest)
- Check "Install automatically"
- Save

### 3. Configure Git (if not already done)
- Go to Manage Jenkins → Global Tool Configuration
- Git section should show "Default" - this is usually sufficient
- If git is not installed on Jenkins server, install Git

## Part 2: Create Pipeline Job

### 1. Create New Job
- Click "New Item"
- Enter name: `social-spark-pipeline`
- Select "Pipeline"
- Click OK

### 2. Configure Pipeline
#### General Settings:
- Description: "Social Spark Application Build Pipeline"
- Check "GitHub project" if using GitHub
- URL: Your repository URL

#### Build Triggers (Optional):
- Check "GitHub hook trigger for GITScm polling" if you want automatic builds
- Or check "Poll SCM" with schedule like `H/5 * * * *` (every 5 minutes)

#### Pipeline Configuration:
- Definition: "Pipeline script from SCM"
- SCM: Git
- Repository URL: Your Git repository URL
- Credentials: Add your Git credentials if private repo
- Branch: `*/main` (or your default branch)
- Script Path: `social-spark-47-main/Jenkinsfile` (relative path from repo root)

### 3. Save and Test
- Click "Save"
- Click "Build Now"

## Part 3: Troubleshooting Common Issues

### Issue 1: "Tool Not Found"
```
ERROR: NodeJS-20 doesn't exist. Check the configuration
```
**Solution:** 
- Go to Global Tool Configuration
- Ensure tool name exactly matches: `NodeJS-20` and `Maven-3.9`
- Check "Install automatically"

### Issue 2: "npm command not found"
**Solution:**
- Wait for NodeJS installation to complete
- Check Jenkins build logs for tool installation status

### Issue 3: "Permission Denied"
**Solution:**
- Ensure Jenkins service has proper permissions
- On Windows: Jenkins service should run as a user with admin rights

### Issue 4: "Build Fails on npm install"
**Solution:**
- Check if your local npm install works
- Clear Jenkins workspace and retry
- Check for proxy settings if behind corporate firewall

### Issue 5: "Workspace Issues"
**Solution:**
- The pipeline includes `cleanWs()` to clean workspace after each build
- If build fails, try "Delete Workspace" and rebuild

## Part 4: Expected Build Flow

### 1. Checkout Stage
```
Checking out source code...
```

### 2. Install Dependencies
```
Installing frontend dependencies...
Installing backend dependencies...
```

### 3. Build Applications
```
Building React frontend...
Verifying Node.js backend...
```

### 4. Test Applications (Optional)
```
Testing React frontend...
Testing Node.js backend...
```

### 5. Package Applications
```
Archiving frontend build...
Archiving Node.js backend...
```

### 6. Success Output
```
Build successful! 🎉
```

## Part 5: Advanced Configuration

### Environment Variables
The pipeline sets these environment variables:
- `NODE_ENV=production`
- `BACKEND_PORT=3001`
- `FRONTEND_PORT=4173`

### Build Artifacts
After successful build, these artifacts are archived:
- Frontend: `social-spark-47-main/dist/**/*`
- Backend: `backend-project/src/**/*` and `package.json`

### Branch-specific Deployment
- Deployment to staging only happens on `main` branch
- Modify the `when { branch 'main' }` condition as needed

## Part 6: Testing Your Setup

1. **Verify tools are installed:**
   - Go to Jenkins Dashboard → Manage Jenkins → Global Tool Configuration
   - Verify both NodeJS-20 and Maven-3.9 are listed

2. **Run a manual build:**
   - Go to your pipeline job
   - Click "Build Now"
   - Watch the console output

3. **Check build artifacts:**
   - After successful build, click "Last Successful Artifacts"
   - Verify files are archived correctly

## Part 7: Webhook Setup (Optional)

To trigger builds automatically when you push to Git:

### For GitHub:
1. Go to your GitHub repository
2. Settings → Webhooks → Add webhook
3. Payload URL: `http://your-jenkins-url/github-webhook/`
4. Content type: `application/json`
5. Events: "Just the push event"

### For GitLab:
1. Go to your GitLab project
2. Settings → Webhooks
3. URL: `http://your-jenkins-url/project/social-spark-pipeline`
4. Trigger: Push events

## Your Build is Ready! 🚀

Your local test showed successful builds, so Jenkins should work perfectly with this configuration.