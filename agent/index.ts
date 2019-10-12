import express from 'express';
import config from './config';
import callServer from './utils/callServer';
import router from './routes/server';

const {port, host} = config;

const app = express();
app.use('/', router);

const init = async () => {
  const data = await callServer('/notify_agent', {host, port});
  const {timeout} = await data.json();
  app.set('timeout', timeout);
};

const server = app.listen(config.port, async function () {
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
    console.log('Agent shotdown');
    process.exit(0);
  });
};