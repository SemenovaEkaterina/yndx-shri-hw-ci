import express from 'express';
import config from './config.json';
import db from './db';
import client from './routes/client';
import agent from './routes/agent';
import startBuild from './utils/startBuild';

const {port} = config;

const app = express();


app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/static'));


app.use('/', client);
app.use('/', agent);

app.listen(config.port, async function () {
  await db.connect();
  startBuild();
  console.log(`Server listening on port ${port}!`);
});