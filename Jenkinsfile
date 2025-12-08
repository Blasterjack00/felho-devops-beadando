pipeline {
    agent any

    environment {
        IMAGE_NAME  = 'taskboard-backend'
        IMAGE_TAG   = '1.0.0'
        DOCKER_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"
        K8S_DIR     = 'deploy/kubernetes'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                dir('app') {
                    sh 'npm ci'
                }
            }
        }

        stage('Unit tests') {
            steps {
                dir('app') {
                    sh 'npm test'
                }
            }
        }

        // Innentől „doksi” jellegű lépések – csak kiírjuk, mit kellene futtatni
        stage('Build Docker image (doc only)') {
            steps {
                echo "Helyi gépen a Docker build parancs:"
                echo "  docker build -t ${DOCKER_IMAGE} app"
            }
        }

        stage('Load image into Minikube (doc only)') {
            steps {
                echo "Minikube image betöltés parancs:"
                echo "  minikube image load ${DOCKER_IMAGE}"
            }
        }

        stage('Deploy to Kubernetes (doc only)') {
            steps {
                echo "Kubernetes deploy parancsok:"
                echo "  kubectl apply -f ${K8S_DIR}/deployment.yaml"
                echo "  kubectl apply -f ${K8S_DIR}/services.yaml"
            }
        }
    }

    post {
        success {
            echo 'CI pipeline OK – függőségek felmentek, tesztek lefutottak.'
        }
        failure {
            echo 'Build vagy deploy hiba – nézd meg a pipeline logot.'
        }
    }
}
