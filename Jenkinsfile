pipeline {
    agent any

    environment {
        IMAGE_NAME   = 'taskboard-backend'
        IMAGE_TAG    = '1.0.0'
        DOCKER_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"
        K8S_DIR      = 'deploy/kubernetes'
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

        // Dokumentáció jellegű lépések
        stage('Build Docker image (doc only)') {
            steps {
                echo "Helyi Docker build:"
                echo "docker build -t ${DOCKER_IMAGE} app"
            }
        }

        stage('Load image into Minikube (doc only)') {
            steps {
                echo "Minikube image load:"
                echo "minikube image load ${DOCKER_IMAGE}"
            }
        }

        stage('Deploy to Kubernetes (doc only)') {
            steps {
                echo "Kubernetes deploy:"
                echo "kubectl apply -f ${K8S_DIR}/deployment.yaml"
                echo "kubectl apply -f ${K8S_DIR}/services.yaml"
            }
        }
    }

    post {
        success {
            emailext(
                to: 'teszt@example.com',
                subject: '✅ Taskboard CI – SIKERES BUILD',
                body: """A Jenkins pipeline sikeresen lefutott.

Projekt: ${env.JOB_NAME}
Build szám: ${env.BUILD_NUMBER}
Állapot: SIKERES

Build URL:
${env.BUILD_URL}
"""
            )
        }

        failure {
            emailext(
                to: 'teszt@example.com',
                subject: 'Taskboard CI – HIBÁS BUILD',
                body: """A Jenkins pipeline hibával leállt.

Projekt: ${env.JOB_NAME}
Build szám: ${env.BUILD_NUMBER}
Állapot: HIBÁS

Részletek:
${env.BUILD_URL}
"""
            )
        }
    }
}
