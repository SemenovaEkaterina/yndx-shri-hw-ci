import express from 'express';
import config from './config';
import callServer from './utils/callServer';
import router from './routes/server';
import bodyParser from 'body-parser';

const {port, domain, host} = config;

const app = express();
app.use(bodyParser.json());
app.use('/', router);

// Оповещение сервера о готовности
const init = async () => {
  const data = await callServer('/notify_agent', {host: domain, port});
  const {timeout} = await data.json();
  app.set('timeout', timeout);
};

const server = app.listen(parseInt(port), host,async function () {
  try {
    await init();
    console.log(`Agent listening on port ${port}!`);
  } catch (e) {
    close(e);
  }
});

const close = (e: ExceptionInformation) => {
  server.close(() => {
    console.log(e);
    console.log('Agent shutdown');
    process.exit(0);
  });
};