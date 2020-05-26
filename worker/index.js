const keys = require('./keys'); // zawiera informację o połączeniu do Redis
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// anytime we get new message <hence subscription> run the callback function taking 2 parameters
sub.on('message', (channel, message) => {
  console.log('got the message to compute Fibo for index ', message );
 
  redisClient.hset('values', message, fib(parseInt(message)));
});


sub.subscribe('insert'); // subskrybujemy do zdarzenia 'insert'. Dokładnie takie zdarzenie jest w server/index.js
