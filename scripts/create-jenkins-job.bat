@echo off
REM Jenkins Job Configuration Script for Windows
REM Run this script to create the Jenkins pipeline job

setlocal EnableDelayedExpansion

REM Jenkins configuration
set JENKINS_URL=http://localhost:8080
set JOB_NAME=social-spark-platform
set GITHUB_REPO=https://github.com/shoaib39011/social-media-platform.git

echo.
echo 🚀 Jenkins Pipeline Job Creation Script
echo ==================================

REM Check if curl is available
curl --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  curl not found. Please install curl or use Jenkins UI manually.
    echo See JENKINS_SETUP.md for manual instructions.
    pause
    exit /b 1
)

echo 📄 Creating job configuration...

REM Create job configuration XML
(
echo ^<?xml version='1.1' encoding='UTF-8'?^>
echo ^<flow-definition plugin="workflow-job@2.40"^>
echo   ^<description^>Social Spark Platform - Multi-technology stack build pipeline^</description^>
echo   ^<keepDependencies^>false^</keepDependencies^>
echo   ^<properties^>
echo     ^<com.coravy.hudson.plugins.github.GithubProjectProperty plugin="github@1.33.1"^>
echo       ^<projectUrl^>%GITHUB_REPO%^</projectUrl^>
echo     ^</com.coravy.hudson.plugins.github.GithubProjectProperty^>
echo     ^<org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty^>
echo       ^<triggers^>
echo         ^<hudson.triggers.SCMTrigger^>
echo           ^<spec^>H/5 * * * *^</spec^>
echo           ^<ignorePostCommitHooks^>false^</ignorePostCommitHooks^>
echo         ^</hudson.triggers.SCMTrigger^>
echo       ^</triggers^>
echo     ^</org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty^>
echo   ^</properties^>
echo   ^<definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.82"^>
echo     ^<scm class="hudson.plugins.git.GitSCM" plugin="git@4.4.5"^>
echo       ^<configVersion^>2^</configVersion^>
echo       ^<userRemoteConfigs^>
echo         ^<hudson.plugins.git.UserRemoteConfig^>
echo           ^<url^>%GITHUB_REPO%^</url^>
echo         ^</hudson.plugins.git.UserRemoteConfig^>
echo       ^</userRemoteConfigs^>
echo       ^<branches^>
echo         ^<hudson.plugins.git.BranchSpec^>
echo           ^<name^>*/main^</name^>
echo         ^</hudson.plugins.git.BranchSpec^>
echo       ^</branches^>
echo       ^<doGenerateSubmoduleConfigurations^>false^</doGenerateSubmoduleConfigurations^>
echo       ^<submoduleCfg class="list"/^>
echo       ^<extensions/^>
echo     ^</scm^>
echo     ^<scriptPath^>social-spark-47-main/Jenkinsfile^</scriptPath^>
echo     ^<lightweight^>true^</lightweight^>
echo   ^</definition^>
echo   ^<triggers/^>
echo   ^<disabled^>false^</disabled^>
echo ^</flow-definition^>
) > job-config.xml

echo 🔨 Creating Jenkins job: %JOB_NAME%

REM Create the Jenkins job using curl
curl -X POST "%JENKINS_URL%/createItem?name=%JOB_NAME%" ^
     -H "Content-Type: application/xml" ^
     --data-binary @job-config.xml

if errorlevel 1 (
    echo ❌ Failed to create Jenkins job
    echo Please check:
    echo 1. Jenkins is running at %JENKINS_URL%
    echo 2. You have authentication configured
    echo 3. Required plugins are installed
    echo 4. Job name doesn't already exist
    pause
    exit /b 1
)

REM Clean up
del job-config.xml

echo.
echo 🎉 Setup Complete!
echo ==================================
echo Jenkins job created: %JENKINS_URL%/job/%JOB_NAME%
echo.
echo Next steps:
echo 1. Configure Node.js and Maven tools in Jenkins
echo 2. Set up GitHub webhook (optional)
echo 3. Trigger first build manually
echo 4. Configure deployment scripts
echo.
echo 📚 See JENKINS_SETUP.md for detailed instructions
echo.
pause