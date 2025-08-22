pipeline {
  agent any
  options { timestamps() }

  environment {
    IMAGE_NAME = "victory-backend"
    TAG        = "main-${env.GIT_COMMIT.take(7)}"
  }

  stages {
    stage('Checkout'){ 
      steps { 
        checkout scm 
      } 
    }

    stage('Build & Test'){
      when { branch 'main' }
      steps {
        sh 'chmod +x gradlew'
        // 일단 테스트 건너뛰고 빌드만 수행
        sh './gradlew clean build -x test'
      }
    }

    stage('Docker Build (Local)'){
      when { branch 'main' }
      steps {
        sh """
          echo "=== Building Docker image locally ==="
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
                  string(name: 'BACKEND_TAG', value: "${TAG}"),
                  string(name: 'FRONTEND_TAG', value: 'latest') // 기존 프론트엔드 태그 유지
                ],
                wait: false // 비동기 실행
        }
      }
    }
  }

  post {
    success { 
      echo "✅ Backend built locally: ${IMAGE_NAME}:${TAG}" 
    }
    failure { 
      echo "❌ Backend build failed" 
    }
  }
}