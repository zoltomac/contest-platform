pipeline {
  agent any
  triggers {
        gitlab(triggerOnPush: true, triggerOnMergeRequest: true)
  }
  stages {
    stage('hello') {
      steps {
        sh 'echo "Hello World"'
      }
    }
    stage('tests') {
      steps {
        script {
          dir('backend/') {
            sh 'pipenv run python manage.py test'
          }
        }
      }
    }
  }
}
