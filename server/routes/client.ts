import express from 'express';
import buildManager from '../models/build';
import agentManager from '../models/agent';
import startBuild from '../utils/startBuild';
const router = express.Router();

router.get('/', async function (req, res) {
  const data = await buildManager.list() || [];
  const agents = await agentManager.list() || [];
  res.render('index', {data, agents});
});

router.get('/build/:id', async function (req, res) {
  const {id} = req.params;
  const data = await buildManager.get({id: parseInt(id)});
  res.render('build', {data});
});

router.post('/build', async function (req, res) {
  const {command} = req.query;
  const build = await buildManager.create(command);

  // Запуск новой сборки
  startBuild();
  res.sendStatus(200);
});

export default router;