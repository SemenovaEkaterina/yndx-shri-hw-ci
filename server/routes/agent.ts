import express from 'express';
import buildManager, { Build } from '../models/build';
import agentManager, { Agent } from '../models/agent';
import startBuild from '../utils/startBuild';
import finishBuild from '../utils/finishBuild';
import config from '../config';

const router = express.Router();

const {timeout} = config;

router.post('/notify_agent', async function (req, res) {
  const {host, port} = req.body;
  const url = `${host}:${port}`;
  const {id} = (await agentManager.get({url})) || (await agentManager.create(url));

  const repo = req.app.get('repo');

  // Поиск и запуск новой сборки
  startBuild(repo);

  res.json({id, timeout});
});

router.post('/notify_agent_alive', async function (req, res) {
  const {id} = req.body;
  const build = await buildManager.get({id}) as Build;
  build.updated = new Date().getTime();
  buildManager.update(build);

  const agent = await agentManager.get({id: build.agent}) as Build;
  agent.updated = new Date().getTime();
  agentManager.update(agent);

  res.sendStatus(200);
});

router.post('/notify_build_result', async function (req, res) {
  const {id, status, stdout, stderr} = req.body;
  const repo = req.app.get('repo');
  const build = await buildManager.get({id}) as Build;
  const agent = await agentManager.get({id: build.agent}) as Agent;
  if (build && agent) {
    res.sendStatus(200);
    await finishBuild(build, agent, status, stdout, stderr);
    // Поиск и запуск новой сборки
    await startBuild(repo);
  } else {
    res.sendStatus(404);
  }
});

export default router;