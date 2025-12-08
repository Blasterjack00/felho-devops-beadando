pipeline {
    agent any

    environment {
        // Docker image név + tag
        IMAGE_NAME   = "taskboard-backend"
        IMAGE_TAG    = "1.0.${env.BUILD_NUMBER}"
        DOCKER_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"

        // Kubernetes manifestek helye a repóban
        K8S_DIR      = "deploy/kubernetes"
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
                    // függőségek felrakása
                    sh 'npm ci'
                }
            }
        }

        stage('Unit tests') {
            steps {
                dir('app') {
                    // Jest tesztek futtatása
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker image') {
            steps {
                // backend image build az app mappából
                sh "docker build -t ${DOCKER_IMAGE} app"
            }
        }

        stage('Load image into Minikube') {
            steps {
                // a lokális Docker image betöltése a Minikube clusterbe
                sh "minikube image load ${DOCKER_IMAGE}"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // manifestek alkalmazása
                sh "kubectl apply -f ${K8S_DIR}/deployment.yaml"
                sh "kubectl apply -f ${K8S_DIR}/services.yaml"

                // opcionális: rollout restart, hogy biztosan az új image fusson
                sh "kubectl rollout restart deployment/taskboard-backend"
                sh "kubectl rollout status deployment/taskboard-backend"
            }
        }
    }

    post {
        success {
            echo "Deployment sikeres: ${DOCKER_IMAGE}"
        }
        failure {
            echo "Build vagy deploy hiba – nézd meg a pipeline logot."
        }
    }
}
