# Felhő és DevOps beadandó – TaskBoard backend

Ez a repository a **Felhő és DevOps alapok** tantárgy beadandó feladatához készült.  
A projekt célja egy egyszerű Node.js alapú REST backend alkalmazás létrehozása,
majd annak **konténerizálása Dockerrel**, illetve **felkészítése Kubernetes
környezetben történő futtatásra**.

A hangsúly nem az alkalmazás funkcionalitásán, hanem a **DevOps eszközök,
folyamatok és alapelvek gyakorlati alkalmazásán** van.

---

## Fejlesztési környezet előkészítése

A fejlesztés megkezdése előtt a nem szükséges Docker image-ek és konténerek
eltávolításra kerültek, a környezet tisztaságának biztosítása érdekében.

Ennek célja:
- a portütközések elkerülése,
- az átlátható Docker környezet,
- a hibakeresés megkönnyítése.

---

## Projekt felépítése


---

## Alkalmazás rövid leírása

Az alkalmazás egy egyszerű REST backend, amely:

- HTTP szervert indít **Node.js + Express** segítségével
- rendelkezik egy `/health` végponttal az alkalmazás állapotának ellenőrzésére
- egy egyszerű feladatkezelő API-t biztosít (`/tasks`)
- az alkalmazás alapértelmezett portja: **8080**

A feladatok ideiglenesen memóriában kerülnek tárolásra,  
adatbázis használata nem része a beadandónak.

---

## `.gitignore` fájl szerepe

A `.gitignore` fájl segítségével megadhatók azok a fájlok és könyvtárak,
amelyeket **nem szeretnénk verziókezelés alá vonni**.

A projektben a `.gitignore` az alábbiakat tartalmazza:

- `node_modules/`  
  A Node.js függőségek mappája, amely automatikusan generálódik (`npm install`).
  Mérete nagy, platformfüggő, ezért nem kerül feltöltésre GitHubra.

- `.env`  
  Környezeti változók (pl. jelszavak, API kulcsok) tárolására szolgál.
  Biztonsági okokból nem kerülhet nyilvános repository-ba.

- `.DS_Store`  
  Operációs rendszer által generált fájl, amely nem része a projektnek.

A `.gitignore` használata biztosítja a repository **tisztaságát,
biztonságát és hordozhatóságát**.

---

## `.dockerignore` fájl szerepe

A `.dockerignore` fájl hasonló szerepet tölt be, mint a `.gitignore`,
de **a Docker image buildelési folyamata során** érvényesül.

A projektben a `.dockerignore` az alábbi elemeket zárja ki:

- `node_modules/`  
  A Docker image építése során a függőségek újratelepítésre kerülnek,
  ezért nem szükséges a host gép `node_modules` mappáját másolni az image-be.

- `npm-debug.log`  
  Fejlesztési log fájl, amely nem része az alkalmazásnak.

A `.dockerignore` használatának előnyei:
- kisebb Docker image méret,
- gyorsabb build folyamat,
- felesleges fájlok kizárása a konténerből.

---

## Alkalmazás futtatása lokálisan (Docker nélkül)

### Követelmények
- Node.js (LTS verzió)
- npm

### Indítás

```bash
cd app
npm install
npm run dev

##Az alkalmazás elérhető:
http://localhost:8080/health

## Kubernetes (Minikube) futtatás

A TaskBoard backend Docker image-e Kubernetes környezetben is futtatható
**Minikube** segítségével. A Minikube lokális Kubernetes clusterként szolgál
Windows környezetben, Docker driver használatával.

### Követelmények
- Docker Desktop (Windows)
- Minikube
- kubectl

---

### Minikube indítása

A Kubernetes cluster indítása Docker driverrel:

```bash
minikube start --driver=docker --cpus=2 --memory=4096
Az indítás után ellenőrizhető az állapot:

bash
Copy code
minikube status
kubectl get nodes
Docker image betöltése Minikube-ba
Mivel az alkalmazás Docker image-e lokálisan lett buildelve, ezért azt
explicit módon be kell tölteni a Minikube image tárába:

bash
Copy code
minikube image load taskboard-backend:1.0.0
Ez biztosítja, hogy a Kubernetes Deployment ne próbálja külső registryből
letölteni az image-et.

Deployment és Service létrehozása
A Kubernetes erőforrások YAML fájlokban kerültek definiálásra
a deploy/kubernetes mappában.

Deployment létrehozása:

bash
Copy code
kubectl apply -f deploy/kubernetes/deployment.yaml
Service létrehozása:

bash
Copy code
kubectl apply -f deploy/kubernetes/services.yaml
Ellenőrzés:

bash
Copy code
kubectl get pods
kubectl get svc
A pod állapota Running, a Service típusa NodePort.

Alkalmazás elérése Kubernetesből
Windows + Docker driver használata esetén a NodePort közvetlen
localhost:<port> elérés nem mindig működik, ezért a Minikube
lokális alagutat (tunnel) hoz létre.

Az alkalmazás elérése:

bash
Copy code
minikube service taskboard-backend-service
A parancs kimenetében megjelenik egy URL, például:

cpp
Copy code
http://127.0.0.1:18944
Az alkalmazás állapotának ellenőrzése:

arduino
Copy code
http://127.0.0.1:18944/health
Sikeres válasz:

json
Copy code
{"status":"ok"}
Fontos: a terminált nyitva kell hagyni, amíg a minikube service parancs fut,
mivel ez biztosítja a tunnel működését.

Megjegyzés a imagePullPolicy beállításhoz
A Kubernetes Deployment-ben az alábbi beállítás szerepel:

yaml
Copy code
imagePullPolicy: Never
Ez azért szükséges, mert a Docker image lokálisan készült, és nem egy
külső Docker registry-ből kerül letöltésre.

## Alkalmazás futtatása Docker konténerben

A backend alkalmazás Docker image-be van csomagolva, így konténerben is
egyszerűen futtatható.

### Image buildelése

A projekt gyökerében (ahol a `Dockerfile` található):

```bash
cd app
docker build -t taskboard-backend:1.0.0 .
Ez létrehoz egy taskboard-backend:1.0.0 nevű helyi image-et.

Konténer futtatása
bash
Copy code
docker run -d -p 8080:8080 --name taskboard-backend taskboard-backend:1.0.0
Ezzel a backend egy Docker konténerben indul el, a host gép felől az
alábbi címen érhető el:

Healthcheck: http://localhost:8080/health

Task API: http://localhost:8080/tasks

A konténer leállítása:

bash
Copy code
docker stop taskboard-backend
docker rm taskboard-backend
perl
Copy code

#### Kubernetes / Minikube futtatás

```md
## Futtatás Kubernetes (Minikube) környezetben

A beadandó része, hogy az alkalmazás Kubernetesben is fusson. Ehhez
Minikube-ot, Docker drivert és két manifestet használunk:

- `deploy/kubernetes/deployment.yaml`
- `deploy/kubernetes/services.yaml`

### Minikube indítása (Windows + Docker driver)

```bash
minikube start --driver=docker --cpus=2 --memory=4096
Ezzel létrejön egy egy-node-os Kubernetes cluster Dockerben.

Ellenőrzés:

bash
Copy code
kubectl get nodes
kubectl get pods -A
Docker image betöltése Minikube-ba
A korábban elkészített taskboard-backend:1.0.0 image-et be kell
tölteni a Minikube saját Docker daemonjába:

bash
Copy code
minikube image load taskboard-backend:1.0.0
Deployment és Service létrehozása
A projekt gyökeréből:

bash
Copy code
kubectl apply -f deploy/kubernetes/deployment.yaml
kubectl apply -f deploy/kubernetes/services.yaml
Ellenőrzés:

bash
Copy code
kubectl get pods
kubectl get svc
A taskboard-backend podnak Running állapotban kell lennie, a
taskboard-backend-service pedig egy NodePort típusú service.

Az alkalmazás elérése Minikube-ból
Minikube-on a NodePort service-t egy lokális tunnel segítségével
érjük el:

bash
Copy code
minikube service taskboard-backend-service
Ez megnyit egy böngészőt, illetve kiír egy URL-t, például:

http://127.0.0.1:19765

A healthcheck és az API itt érhető el:

Healthcheck: http://127.0.0.1:19765/health

Task API: http://127.0.0.1:19765/tasks

Fontos: minden egyes futtatásnál (minikube service ...) új, véletlen
portot kaphatunk (pl. 18944, 19765, stb.).
Ha a parancsot Ctrl + C-vel leállítjuk, a tunnel megszűnik, és az
előző URL nem lesz elérhető – újra futtatva a parancsot új URL-t kapunk.