# Jenkins Tools Configuration Guide

## 🛠️ Current Issue: Tools Not Configured

Jenkins needs NodeJS and Maven tools to be configured. Here's how to fix it:

## 📋 Step-by-Step Tool Configuration

### Step 1: Access Jenkins Global Tool Configuration

1. **Open Jenkins Dashboard**
   - Go to http://localhost:8080 (or your Jenkins URL)
   - Login with admin credentials

2. **Navigate to Global Tool Configuration**
   - Click "Manage Jenkins" (left sidebar)
   - Click "Global Tool Configuration"

### Step 2: Configure NodeJS

1. **Find NodeJS Section**
   - Scroll down to "NodeJS" section
   - Click "Add NodeJS"

2. **Configure NodeJS Settings**
   ```
   Name: NodeJS-20
   Install automatically: ✅ (checked)
   Version: NodeJS 20.x.x (latest)
   Global npm packages to install: (leave empty for now)
   ```

3. **Click Save**

### Step 3: Configure Maven

1. **Find Maven Section**
   - Scroll down to "Maven" section
   - Click "Add Maven"

2. **Configure Maven Settings**
   ```
   Name: Maven-3.9
   Install automatically: ✅ (checked)
   Version: 3.9.9 (or latest 3.9.x)
   ```

3. **Click Save**

### Step 4: Update Jenkinsfile

After configuring tools, uncomment the tools section in Jenkinsfile:

```groovy
tools {
    nodejs 'NodeJS-20'
    maven 'Maven-3.9'
}
```

## 🚀 Quick Fix: Build Without Tools (Alternative)

If you want to build immediately without tool configuration, I've temporarily commented out the tools section. The build will use system-installed Node.js and npm.

### Current Jenkinsfile Status:
- ✅ Tools section commented out
- ✅ Build will use system Node.js
- ✅ Should work immediately

## 📝 Complete Configuration Steps

### Option A: Use System Tools (Immediate)
1. **Build Now** - Should work with current Jenkinsfile
2. Uses system-installed Node.js and npm

### Option B: Configure Jenkins Tools (Recommended)
1. **Configure tools** as described above
2. **Uncomment tools section** in Jenkinsfile
3. **Commit and push** updated Jenkinsfile
4. **Build again**

## 🔧 Jenkins Tool Configuration Screenshots Guide

### 1. Manage Jenkins
```
Dashboard → Manage Jenkins → Global Tool Configuration
```

### 2. NodeJS Configuration
```
Name: NodeJS-20
☑️ Install automatically
Installer: Install from nodejs.org
Version: NodeJS 20.18.0 (or latest 20.x)
```

### 3. Maven Configuration
```
Name: Maven-3.9
☑️ Install automatically
Installer: Install from Apache
Version: 3.9.9
```

## ⚡ Emergency Build Command

If tools configuration is taking time, you can build immediately:

1. **Current build should work** with system Node.js
2. **Check Console Output** for any errors
3. **Frontend and backend** should build successfully

## 🔄 After Tool Configuration

Once tools are configured in Jenkins:

1. **Update Jenkinsfile** (uncomment tools section):
```groovy
tools {
    nodejs 'NodeJS-20'
    maven 'Maven-3.9'  
}
```

2. **Commit and Push**:
```bash
git add Jenkinsfile
git commit -m "Enable Jenkins tools configuration"
git push origin main
```

3. **Build Again** - Should use configured tools

## 📊 Expected Build Results

### Without Tools (Current):
- ✅ Uses system Node.js
- ✅ Frontend builds successfully
- ✅ Backend verification passes
- ⚠️ May use different Node.js version

### With Tools (After Config):
- ✅ Uses specific NodeJS-20
- ✅ Consistent builds across environments
- ✅ Better version control
- ✅ Isolated tool versions

## 🚨 Troubleshooting

### If Build Still Fails:
1. **Check Node.js Installation**
   ```bash
   node --version
   npm --version
   ```

2. **Check Jenkins Agent**
   - Ensure Jenkins agent has Node.js access
   - Check PATH environment variables

3. **Console Output**
   - Look for specific error messages
   - Check which stage fails

### Common Solutions:
- **Missing Node.js**: Install Node.js on Jenkins agent
- **Permission Issues**: Check Jenkins user permissions
- **Path Issues**: Configure PATH in Jenkins environment

## ✅ Success Criteria

Your build is successful when you see:
- ✅ Checkout stage completes
- ✅ Dependencies install successfully
- ✅ Frontend builds without errors
- ✅ All stages complete with green status

## 📞 Next Steps

1. **Try building now** with current configuration
2. **Configure tools** for future consistency
3. **Update Jenkinsfile** after tool configuration
4. **Enjoy automated builds!** 🎉