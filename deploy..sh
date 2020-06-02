# dyskusja tagu uzyskanego ze zmiennej środowiskowej $SHA jest w docker-course-notes
 docker build -t zbyszekm/multi-container-client:latest -t zbyszekm/multi-container-client:$SHA -f ./client/Dockerfile ./client
 docker build -t zbyszekm/multi-container-server:latest -t zbyszekm/multi-container-server:$SHA  -f ./server/Dockerfile ./server
 docker build -t zbyszekm/multi-container-worker:latest -t -t zbyszekm/multi-container-worker:$SHA  -f ./worker/Dockerfile ./worker


 docker push zbyszekm/multi-container-client:latest
 docker push zbyszekm/multi-container-server:latest
 docker push zbyszekm/multi-container-worker:latest

 docker push zbyszekm/multi-container-client:$SHA
 docker push zbyszekm/multi-container-server:$SHA
 docker push zbyszekm/multi-container-worker:$SHA

 # w pliku .travis.yaml w kroku [before_install] zainstalowaśmy k8, więc można go teraz używać
 kubectl apply -f ./k8s

# odwołujemy się do image'ów, którym wyżej nadalismy unikalne tagi. W ten sposób zmuszamy k8 do każdorazowej aktualizacji używanego image'a
 kubectl set image deployments/server-deployment server=zbyszekm/multi-container-server:$SHA
 kubectl set image deployments/client-deployment client=zbyszekm/multi-container-client:$SHA
 kubectl set image deployments/worker-deployment worker=zbyszekm/multi-container-worker:$SHA
