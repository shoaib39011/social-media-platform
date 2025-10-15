# Jenkins Pipeline Setup Guide

## Prerequisites

### 1. Configure Tools in Jenkins
Go to Jenkins Dashboard → Manage Jenkins → Global Tool Configuration:

#### Node.js Configuration:
- Name: `NodeJS-20`
- Version: NodeJS 20.x (latest LTS)
- Global npm packages: Leave empty or add any global packages needed

#### Maven Configuration:
- Name: `Maven-3.9`
- Version: Maven 3.9.x
- Install automatically: Check this option

### 2. Required Jenkins Plugins
Make sure these plugins are installed:
- NodeJS Plugin
- Maven Integration Plugin
- Pipeline Plugin
- Git Plugin
- Workspace Cleanup Plugin

### 3. Environment Setup
The pipeline expects this project structure:
```
social-spark-47-main/
├── social-spark-47-main/     # Frontend React app
├── backend-project/          # Node.js backend
├── demo/                     # Optional Spring Boot demo
└── Jenkinsfile              # Pipeline configuration
```

## Troubleshooting Common Issues

### Issue 1: Tool Not Found
If you get "NodeJS-20 not found" or "Maven-3.9 not found":
- Go to Jenkins → Manage Jenkins → Global Tool Configuration
- Add the exact tool names referenced in Jenkinsfile
- Enable "Install automatically"

### Issue 2: Build Failures
Common fixes:
1. Check Node.js version compatibility
2. Verify package.json scripts exist
3. Ensure npm install works locally first

### Issue 3: Permission Issues
On Windows Jenkins:
- Ensure Jenkins service has proper permissions
- Use `bat` commands instead of `sh` (already configured)

### Issue 4: Workspace Issues
- The pipeline includes `cleanWs()` to clean workspace
- Ensure Jenkins has write permissions to workspace

## Testing the Pipeline

1. Push your code to the repository
2. Create a new Pipeline job in Jenkins
3. Point it to your repository
4. The Jenkinsfile will be automatically detected
5. Run the pipeline

## Expected Build Steps

1. **Checkout**: Downloads code from repository
2. **Install Dependencies**: Runs `npm install` for frontend and backend
3. **Build Applications**: Builds React app (`npm run build`)
4. **Test Applications**: Runs tests if configured
5. **Package Applications**: Archives build artifacts
6. **Quality Checks**: Placeholder for code quality tools
7. **Deploy to Staging**: Only runs on main branch

## Build Artifacts

The pipeline will create these artifacts:
- Frontend: `social-spark-47-main/dist/` folder
- Backend: `backend-project/src/` and `package.json`
- Spring Boot Demo: `demo/target/*.jar` (if exists)