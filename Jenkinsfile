pipeline {  environment {
    registry = "paraspatel1434/sunbird-rc-ui"
    registryCredential = 'dockerhub'
  }  agent any  stages {
    stage('Building image') {
      steps{
        script {
          docker.build registry + ":$BUILD_NUMBER"
        }
      }
    }
  }
}