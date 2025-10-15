# Jenkins Pipeline Quick Setup Checklist ✅

## Before You Start
- [ ] Jenkins is installed and running
- [ ] You have admin access to Jenkins
- [ ] Your code is in a Git repository

## Step 1: Install Plugins (5 minutes)
Go to Jenkins → Manage Jenkins → Manage Plugins → Available:
- [ ] NodeJS Plugin
- [ ] Maven Integration Plugin  
- [ ] Pipeline Plugin
- [ ] Git Plugin
- [ ] Workspace Cleanup Plugin

## Step 2: Configure Tools (3 minutes)
Go to Jenkins → Manage Jenkins → Global Tool Configuration:
- [ ] Add NodeJS: Name = `NodeJS-20`, Version = NodeJS 20.x, Install automatically ✓
- [ ] Add Maven: Name = `Maven-3.9`, Version = 3.9.x, Install automatically ✓
- [ ] Save configuration

## Step 3: Create Pipeline Job (2 minutes)
- [ ] New Item → Enter name → Pipeline → OK
- [ ] Pipeline section: Definition = "Pipeline script from SCM"
- [ ] SCM = Git
- [ ] Repository URL = Your Git repo URL
- [ ] Branch = `*/main`
- [ ] Script Path = `social-spark-47-main/Jenkinsfile`
- [ ] Save

## Step 4: Run First Build (1 minute)
- [ ] Click "Build Now"
- [ ] Watch Console Output
- [ ] Verify "Build successful! 🎉" message

## Expected Timeline:
- First build: 5-10 minutes (tool downloads)
- Subsequent builds: 2-3 minutes

## If Build Fails:
1. Check tool names match exactly: `NodeJS-20` and `Maven-3.9`
2. Verify Jenkins has internet access for tool downloads
3. Check Console Output for specific error messages
4. Try "Delete Workspace" and rebuild

## Success Indicators:
✅ All stages show green checkmarks
✅ Console shows "Build successful! 🎉"
✅ Artifacts are archived in Jenkins
✅ Build time is reasonable (under 10 minutes)

## Your pipeline will run these stages:
1. **Checkout** - Downloads your code
2. **Install Dependencies** - Runs `npm install` for frontend and backend
3. **Build Applications** - Runs `npm run build` for frontend
4. **Test Applications** - Runs tests (if configured)
5. **Package Applications** - Archives build artifacts
6. **Quality Checks** - Placeholder for code quality
7. **Deploy to Staging** - Only on main branch (placeholder)

## Ready to Go! 🚀
Your local build test passed, so Jenkins should work perfectly!