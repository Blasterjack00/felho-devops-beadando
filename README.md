# Felhő és DevOps beadandó – TaskBoard backend

Ez a projekt egy egyszerű Node.js alapú backend alkalmazás köré épített, CI/CD és DevOps megoldás.

A megoldás lokális környezetben (Docker, Jenkins, Minikube) futtatható, és demonstrálja az automatizált buildelést, tesztelést, konténerizálást, Kubernetes deploymentet, monitorozást és értesítést.

## Projekt felépítése

felho-devops-beadando/
├── app/                         # Node.js backend alkalmazás
│   ├── __test__/               # Jest egységtesztek
│   ├── index.js                # Alkalmazás belépési pont
│   ├── package.json
│   └── Dockerfile              # Backend Docker image
│
├── deploy/
│   ├── kubernetes/             # Kubernetes erőforrások
│   │   ├── deployment.yaml
│   │   └── services.yaml
│   │
│   ├── monitoring/             # Prometheus konfiguráció
│   │   ├── prometheus-config.yaml
│   │   ├── prometheus-deployment.yaml
│   │   └── prometheus-service.yaml
│   │
│   └── nginx/                  # NGINX reverse proxy
│       ├── Dockerfile
│       └── nginx.conf
│
├── Jenkinsfile                 # CI pipeline definíció
└── README.md

## Alkalmazás funkciói (Code)

A backend egy egyszerű REST API-t valósít meg:

Endpoint	  Leírás

/health	    Health check
/tasks	    Példa adat visszaadása
/metrics	  Prometheus kompatibilis metrikák

Az alkalmazás Jest egységtesztekkel rendelkezik, amelyek a CI pipeline részeként automatikusan lefutnak.

## Build & Test – CI pipeline
Jenkins szerepe

A projekt CI részét Jenkins Pipeline valósítja meg Docker konténerben futó Jenkins segítségével.

A pipeline lépései:

1. Forráskód letöltése GitHubról
2. Függőségek telepítése (npm ci)
3. Egységtesztek futtatása (npm test)
4. Dokumentációs jellegű Docker és Kubernetes lépések naplózása

  Email értesítés (Mailtrap):
    A pipeline sikeres lefutás után email értesítést küld Mailtrap SMTP-n keresztül, amely demonstrálja a CI feedback mechanizmust.

## Release & Deploy – Kubernetes

Konténerizálás
  Az alkalmazás Docker image-be van csomagolva
  A Docker image betöltésre kerül a Minikube clusterbe

Kubernetes deployment
A projekt Kubernetes része a következőket tartalmazza:
  Deployment: alkalmazás futtatása podban
  Service: alkalmazás elérhetővé tétele
  Minikube használata lokális clusterként

## Monitor & Feedback – Prometheus

A projekt tartalmaz egy Kubernetesben futó Prometheus példányt, amely:
  gyűjti az alkalmazás /metrics endpointján publikált adatokat
  lehetőséget ad időalapú metrikák lekérdezésére

## NGINX – Reverse proxy

Az NGINX egy külön Docker konténerben fut, és:
  reverse proxyként továbbítja a kéréseket a backend felé
  demonstrálja az API Gateway / edge komponens szerepét

Elérhető port: http://localhost:8082

##  Használt tool-ok
Tool	                  Szerep

Jenkins	                CI pipeline, build & test
Kubernetes (Minikube)	  Orchestration, deployment
Prometheus	            Monitorozás
NGINX	                  Reverse proxy
Mailtrap	              Email értesítés


## STEPS TO RUN!!!

-------DOCKER---------
git clone https://github.com/Blasterjack00/felho-devops-beadando.git
cd felho-devops-beadando
cd app
docker build -t taskboard-backend:1.0.0 .
docker run -p 8080:8080 taskboard-backend
http://localhost:8080/health vagy http://localhost:8080/tasks vagy http://localhost:8080/metrics

-------JENKINS---------
In a new terminal
cd felho-devops-beadando
docker run -d -p 8081:8080 -p 50000:50000 --name jenkins -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
docker exec -u root -it jenkins bash
apt-get update
apt-get install -y nodejs npm
exit
http://localhost:8081

New Item > Pipeline
Pipeline > Definition > Pipeline script from SCM
SCM > Git
Repository URL > https://github.com/Blasterjack00/felho-devops-beadando.git
Credentials > None
Branch Specifier (blank for 'any') > */main
Script Path > Jenkinsfile

Most mehet a Build Now

##
Ez a sikeres Jenkins build azt bizonyítja, hogy a projekt automatizált módon, emberi beavatkozás nélkül:
	lefordul / felkészül,
	a függőségek rendben vannak,
	az egységtesztek lefutnak,
	és a build állapota reprodukálható bármely Jenkins környezetben.
##

-------KUBERNETES---------
in a new terminal
minikube start --driver=docker --cpus=2 --memory=4096
minikube status
(ha valamiért nem running akkor minikube delete és ujra minikube start --driver=docker --cpus=2 --memory=4096)
kubectl get nodes > ha Ready mehetünk tovább
minikube image load taskboard-backend:1.0.0
cd .. (ha nem a felho-devops-beadando mappában vagyunk)
kubectl apply -f deploy/kubernetes/deployment.yaml
kubectl apply -f deploy/kubernetes/services.yaml
kubectl get pods > taskboard-backend-xxxxx   Running látszódik
kubectl get services
minikube service taskboard-backend-service

-------PROMETHEUS---------
minikube addons enable metrics-server
kubectl create namespace monitoring
kubectl apply -f deploy/monitoring/prometheus-config.yaml
kubectl apply -f deploy/monitoring/prometheus-deployment.yaml
kubectl apply -f deploy/monitoring/prometheus-service.yaml
kubectl get pods -n monitoring
minikube service prometheus-service -n monitoring

##
Az alkalmazás Prometheus kompatibilis metrikákat publikál a /metrics endpointon,
amelyeket egy Kubernetesben futó Prometheus gyűjt és vizualizál.”
##

-------NGINX---------
docker network create taskboard-net
cd app
docker build -t taskboard-backend:1.0.0 .
cd ..
docker run -d --name taskboard-backend --network taskboard-net taskboard-backend:1.0.0
docker build -t taskboard-nginx:1.0.0 -f deploy/nginx/Dockerfile .
docker run -d --name taskboard-nginx --network taskboard-net -p 8082:80 taskboard-nginx:1.0.0
http://localhost:8082/health vagy http://localhost:8082/tasks vagy http://localhost:8082/metrics