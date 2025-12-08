pipeline {
  agent {
    docker {
      image 'node:20'
      args '-u root'
    }
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
        echo 'Docker build Jenkinsből nem kötelező, README dokumentálja'
      }
    }

    stage('Deploy to Kubernetes (doc only)') {
      steps {
        echo 'Kubernetes deploy manuálisan történik Minikube-ban'
      }
    }
  }

  post {
    failure {
      echo 'CI hiba – teszt vagy install nem sikerült'
    }
    success {
      echo 'CI sikeres – kód buildelhető és tesztelt'
    }
  }
}
