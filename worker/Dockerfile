# wersja produkcyjna różni sie tyklko startową komendą

FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .

# "start" jest JEDNYM ze skryptów zdefiniowanych package.json, jako - po prostu - node index.js
CMD ["npm", "run", "start"]