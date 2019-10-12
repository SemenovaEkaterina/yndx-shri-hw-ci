import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import Db from './db';
import client from './routes/client';
import agent from './routes/agent';
import startBuild from './utils/startBuild';
import checkBuilds from './utils/checkBuilds';
import { AgentManager } from './models/agent';
import { BuildManager } from './models/build';

const {port, host, repo} = config;

if (repo) {
  const app = express();

  app.set('view engine', 'pug');
  app.set('repo', repo);
  app.use('/static', express.static(__dirname + '/static')); //todo path.join
  app.use(bodyParser.json());

  app.use('/', client);
  app.use('/', agent);

// @ts-ignore
  app.listen(port, host, async function () {
    const db = new Db();
    await db.connect();
    const models = {
      agent: new AgentManager(db),
      build: new BuildManager(db),
    };

    app.set('models', models);

    startBuild(models, repo);

    checkBuilds(models);
    console.log(`Server listening on port ${port}!`);
  });
} else {
  console.log('Empty repo field');
}

