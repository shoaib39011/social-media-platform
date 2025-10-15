#!/bin/bash

# Jenkins Job Configuration Script
# Run this script to create the Jenkins pipeline job programmatically

# Jenkins configuration
JENKINS_URL="http://localhost:8080"
JOB_NAME="social-spark-platform"
GITHUB_REPO="https://github.com/shoaib39011/social-media-platform.git"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Jenkins Pipeline Job Creation Script${NC}"
echo "=================================="

# Check if Jenkins CLI is available
if ! command -v jenkins-cli &> /dev/null; then
    echo -e "${YELLOW}⚠️  Jenkins CLI not found. Please install it first.${NC}"
    echo "Download from: ${JENKINS_URL}/cli"
    exit 1
fi

# Create job configuration XML
cat > job-config.xml << EOF
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <actions>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.7.2"/>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@1.7.2">
      <jobProperties/>
      <triggers/>
      <parameters/>
      <options/>
    </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
  </actions>
  <description>Social Spark Platform - Multi-technology stack build pipeline</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <com.coravy.hudson.plugins.github.GithubProjectProperty plugin="github@1.33.1">
      <projectUrl>${GITHUB_REPO}</projectUrl>
      <displayName></displayName>
    </com.coravy.hudson.plugins.github.GithubProjectProperty>
    <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
      <triggers>
        <com.cloudbees.jenkins.GitHubPushTrigger plugin="github@1.33.1">
          <spec></spec>
        </com.cloudbees.jenkins.GitHubPushTrigger>
        <hudson.triggers.SCMTrigger>
          <spec>H/5 * * * *</spec>
          <ignorePostCommitHooks>false</ignorePostCommitHooks>
        </hudson.triggers.SCMTrigger>
      </triggers>
    </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.82">
    <scm class="hudson.plugins.git.GitSCM" plugin="git@4.4.5">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>${GITHUB_REPO}</url>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>*/main</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="list"/>
      <extensions/>
    </scm>
    <scriptPath>social-spark-47-main/Jenkinsfile</scriptPath>
    <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
EOF

echo -e "${YELLOW}📄 Job configuration created: job-config.xml${NC}"

# Create the Jenkins job
echo -e "${YELLOW}🔨 Creating Jenkins job: ${JOB_NAME}${NC}"

if jenkins-cli -s $JENKINS_URL create-job $JOB_NAME < job-config.xml; then
    echo -e "${GREEN}✅ Jenkins job '${JOB_NAME}' created successfully!${NC}"
else
    echo -e "${RED}❌ Failed to create Jenkins job${NC}"
    echo "Please check:"
    echo "1. Jenkins is running at ${JENKINS_URL}"
    echo "2. You have authentication configured"
    echo "3. Required plugins are installed"
    exit 1
fi

# Clean up
rm job-config.xml

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=================================="
echo "Jenkins job created: ${JENKINS_URL}/job/${JOB_NAME}"
echo ""
echo "Next steps:"
echo "1. Configure Node.js and Maven tools in Jenkins"
echo "2. Set up GitHub webhook (optional)"
echo "3. Trigger first build manually"
echo "4. Configure deployment scripts"
echo ""
echo -e "${YELLOW}📚 See JENKINS_SETUP.md for detailed instructions${NC}"