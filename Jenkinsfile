pipeline {
    agent any
    
    
    // Environment block goes here if needed
    environment {
        GITHUB_TOKEN = credentials('githubtoken')
        PATH = "$PATH:/usr/bin" // Add the directory where docker-compose is installed
        // CLIENT_ORIGINS = "https://dev-ims.inevitablegroup.in"
        ENV_FILE_PATH = "$WORKSPACE/.env" // Specify the path for the .env file
    }
    
    stages {
        stage("Clone Code") {
            steps {
                script {
                    // Use the checkout step with credentials
                    checkout([$class: 'GitSCM', 
                              branches: [[name: 'develop']], 
                              userRemoteConfigs: [[url: 'https://github.com/inevitableinfotech/InviIMS_web.git', 
                                                 credentialsId: 'githubtoken']]])
                }
            }
        }
        
        stage('ENV') {
            steps {
                // Use withCredentials to inject the secret file
                withCredentials([
                    file(credentialsId: 'env_frontend', variable: 'SECRET_FILE')
                ]) {
                    script {
                        // Your build steps that use the secret file
                        // Save the contents of SECRET_FILE to the .env file
                        sh "cat \$SECRET_FILE | tee $ENV_FILE_PATH"
                        // Display the contents for verification (optional)
                        sh "cat $ENV_FILE_PATH"
                    }
                }
            }
        }        

        stage("Deploy") {
            steps {
                echo "Deploying the Container"
                sh "docker-compose down --rmi all && docker system prune && docker-compose up -d"
            }
        }
    }
}
