pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install') {
      steps {
        bat 'npm install'
      }
    }
    stage('Build') {
      steps {
        bat 'npm run build'
      }
    }
    stage('Test') {
      steps {
        bat 'npm test'
      }
    }
    // Add deploy stage if needed
  }
}
