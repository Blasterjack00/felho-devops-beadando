pipeline {
    agent any

    environment {
        IMAGE_NAME = "taskboard-backend"
        IMAGE_TAG  = "1.0.${env.BUILD_NUMBER}"
        DOCKER_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"
        K8S_DIR = "deploy/kubernetes"
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

        stage('Build Docker image (doc only)') {
            steps {
                echo "Itt építenénk a Docker image-et:"
                echo "  docker build -t ${DOCKER_IMAGE} app"
            }
        }

        stage('Load image into Minikube (doc only)') {
            steps {
                echo "Itt töltenénk be az image-et Minikube-ba:"
                echo "  minikube image load ${DOCKER_IMAGE}"
            }
        }

        stage('Deploy to Kubernetes (doc only)') {
            steps {
                echo "Itt futtatnánk a deployt:"
                echo "  kubectl apply -f ${K8S_DIR}/deployment.yaml"
                echo "  kubectl apply -f ${K8S_DIR}/services.yaml"
            }
        }
    }

    post {
        failure {
            echo "Build vagy deploy hiba – nézd meg a pipeline logot."
        }
    }
}
