node {
    try {
        stage('Build image') {
            app = docker.build("paraspatel1434/sunbird-rc-ui","target")
        }

        stage('Push image') {
            docker.withRegistry('', 'dockerhub') {
                app.push("latest")
           }
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
