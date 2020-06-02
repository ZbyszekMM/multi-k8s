ŻRÓÐŁO:
    * Udemy.Docker & Kubernetes - the complete quide:
          * Section 14 - Multicontainer app with Kubernetes
          * Section 15
          * Section 16 - Kubernetes production deployment

    * Kod w wersji docker/4fibo2020/, część plików jest usunięte, np. docker-compose.yml


CEL EDUKACYJNY:
    * tym razem będzie wiele, wiele obiektów


DOKUMENTACJA:
*) w helpers\Kubernetes w sekcji "Configuration file explained" są szczegóły plików konfiguracyjnych

*) client-pod.yaml zawiera konfigurację obiektu typu <kind> "POD". Label "web" służy do powiązania z ...
*) ... definicją networkingu zawartą w obiekcie typu "SERVICE" wyspecyfikowanym w client-node-port.yaml - 
    - tam jest odwołanie do obiektu POD poprzez atrybut komponent (wartość jego = "web")

PLIKI:
  1. client-pod.yaml -  podstawowa konfiguracja pod'a odwołująca się do imag'u 
  2. client-deployent.yaml -  obiekt deployment, w sekcji template specyfikuje to co wcześniej było w specyfikacji pod'a
  3. client-node-port.yaml - specyfikacja portów

SET UP:
  1. musi być stworzony obiekt sekret, w którym jest hasło do postgres. Do tego komenda interaktywna, nie jest przechowywany w pliku
       kubectl create secret generic pgpassword --from-literal PGPASSWORD=Jedrek06

INTEGRATIONS:
  1. <Zasocjowana> nazwa zdalnego repo github: remote-repo (używana w komendach git)

WYWOŁANIE: 
  1. Uzyskaj adres vm zarządzanej przez minikube (minikube ip)
  2. NIE używamy już obiektu nodePort, tylko Ingress
    
    
