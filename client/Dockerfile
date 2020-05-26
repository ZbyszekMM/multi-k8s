


# ten Dockerfile jest podzbiorem Dockerfile.dev - przynajmniej pierwsza sekcja, ponieważ operacje mapowania wolumenów, są niepotrzebne dla 
# wersji produkcyjnej

# tworzy tag dla wyniku (?) tej sekcji (po angielsku - mylące - step)
FROM node:alpine as builder  
WORKDIR '/app'
COPY package.json .
RUN npm install

# dopiero teraz kopiowany jest kod aplikacji. Bądź co bądź ten się najczęściej zmienia, a dependencje zciągnięte wyżej - rzadko
COPY . .
RUN npm run build


# DRUGA sekcja. Nginx jest od razu uruchomiony w momencie uruchomienia kontenera stąd brak "RUN".
# NA produkcji istotne jest tylko to co jest w katalogu build. Kopiowane jest to katalogu, w którym nginx spodziewa się zawartości
FROM nginx

# to jest ten dodatkowy nginx, który serwuje strony. Kopiujemy plik konfiguracyjny oraz pliki stron 
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

# dyrektywa EXPOSE jest przeznaczona dla człowieka, żeby poinformować o konieczności wyeksportowania portu podczas docker run
# jednakoż AWS Beanstalk przetwarza tę informację zgodnie z jej przeznaczeniem. Bez tej dyrektywy krok deploy do EBS nie skończy się dobrze
EXPOSE 3000
