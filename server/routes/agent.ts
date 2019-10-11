import express from 'express';
import buildManager, { Build } from '../models/build';
import agentManager, { Agent } from '../models/agent';
import startBuild from '../utils/startBuild';
import finishBuild from '../utils/finishBuild';
const router = express.Router();

router.post('/notify_agent', async function (req, res) {
  const {host, port} = req.query;
  const url = `${host}:${port}`;
  const { id } = (await agentManager.get({url})) || (await agentManager.create(url));

  // Поиск и запуск новой сборки
  startBuild();
  res.json({id});
});

router.post('/notify_build_result', async function (req, res) {
  const {id, status, agent: agentId} = req.query;
  const build = await buildManager.get({id}) as Build;
  const agent = await agentManager.get({id: agentId}) as Agent;
  if (build && agent) {
    finishBuild(build, agent, status);

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

export default router;