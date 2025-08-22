pipeline {
  agent any
  options { timestamps() }

  environment {
    IMAGE_NAME = "victory-frontend"
    TAG        = "main-${env.GIT_COMMIT.take(7)}"
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('Checkout') {
      steps { 
        checkout scm 
      }
    }

    stage('Docker Build (Local)') {
      when { branch 'main' }
      steps {
        sh """
          echo "=== Building frontend Docker image locally ==="
          docker build -t ${IMAGE_NAME}:${TAG} -t ${IMAGE_NAME}:latest .
          
          echo "=== Verifying built images ==="
          docker images | grep ${IMAGE_NAME}
          
          echo "=== Cleaning up old images ==="
          docker image prune -f --filter "dangling=true"
        """
      }
    }

    stage('Trigger Infrastructure Deploy'){
      when { branch 'main' }
      steps {
        script {
          // 인프라 파이프라인을 트리거하면서 새로운 태그 전달
          build job: 'victory-infra-deploy/main', 
                parameters: [
                  string(name: 'BACKEND_TAG', value: 'latest'), // 기존 백엔드 태그 유지
                  string(name: 'FRONTEND_TAG', value: "${TAG}")
                ],
                wait: false // 비동기 실행
        }
      }
    }
  }

  post {
    success { 
      echo "✅ Frontend built locally: ${IMAGE_NAME}:${TAG}" 
    }
    failure { 
      echo "❌ Frontend build failed" 
    }
  }
}