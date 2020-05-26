// server/index.js


const keys = require('./keys');

// Express App Setup
// it will react to http request
// cors = cross o resource sharing, pozwala na xxx z różnych domen (w naszym przypadku jakoby portów, w których zhostowane są aplikacje express)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json()); //?? zamienia każdy?? request w json??

// Postgres Client Setup
const { Pool } = require('pg'); // notacja {module-name} oznacza require moduł module-name
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on('connect', () => {
  // W Postgres przechowywane są tylko 'seen indexes'
  pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)').catch(err => console.log(err));
})

  pgClient
  .query('DELETE FROM VALUES')
  .catch(err => console.log(err));

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000 // retry_strategy tutaj jest funkcją, która zawsze zwraca 1000 
});

// musimy zduplikować tego redisClient, gdyż wg dokumentacji Redis, jeśli następuje specjalizacja tego obiektu do publikowania lub nasłuchiwania, 
// to nie można już go używać do innych celów. Gdybyśmy więc wyspecjalizowali ten originaln obiekt redisClient, to całość byłaby nieużywalna
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
  res.send('Hi');
});

// WAŻNE - dyrektywa async poniżej
app.get('/values/all', async (req, res) => {  //pokaż wszystkie wartości indeksów widziane w przeszłości
  
  console.log('in API CALL - was called to list wartośći indeksów');
  const values = await pgClient.query('SELECT * from values');
  
  res.send(values.rows);
});

// z redis wyciągnij wszystkie pary ze zbioru 'values'. W terminologii redis ten zbiór to "hash value"(?), stąd funkcja hgetall
app.get('/values/current', async (req, res) => {
  console.log('in API CALL  - was called to list pary');
  redisClient.hgetall('values', (err, values) => { //hgetall bierze jako 2gi argument callback o 2 argumentach, chyba(?) zdefiniowany niejako w środku
    res.send(values);                               // i zwracający NO właśnie CO?
  });
});

// Obsługa metody POST - czyli zlecenia obliczenia fibo 
app.post('/values', async (req, res) => {
  const index = req.body.index; //wyłuskanie zleconego indexu
  console.log('post method called');
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet!'); //tworzymy nową parę w redis 
  redisPublisher.publish('insert', index);          // zdarzenie 'insert'
  console.log('inserted new request to redis');
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

// w konfiguracji nginx jest zdefinowany serwis api, który nasłuchuje na p. 5000. Serwis ten zdefiniowany jest właśnie w tym plikuu
app.listen(5000, err => {
  console.log('Listening');
});
