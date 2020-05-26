
FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .

# skrypt "start" jest zdefiniowany w packag.json w sekcji scripts jako node index.js
CMD ["npm", "run", "start"]