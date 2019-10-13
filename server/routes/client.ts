import express from 'express';
import startBuild from '../utils/startBuild';

const router = express.Router();

router.get('/', async function (req, res) {
  const {build: buildManager, agent: agentManager} = req.app.get('models');

  const data = await buildManager.list() || [];
  const agents = await agentManager.list() || [];
  res.render('index', {data, agents});
});

router.get('/build/:id', async function (req, res) {
  const {build: buildManager} = req.app.get('models');

  const {id} = req.params;
  const data = await buildManager.get({id: parseInt(id)});
  const passedTime = new Date();
  passedTime.setTime(data.updated);
  res.render('build', {data, finish: `${passedTime.toDateString()} ${passedTime.toTimeString()}`});
});

router.post('/build', async function (req, res) {
  const models = req.app.get('models');
  const {build: buildManager} = models;

  const {command, hash} = req.body;
  const repo = req.app.get('repo');
  await buildManager.create(hash, command);

  // Запуск новой сборки
  startBuild(models, repo); //todo подумать над await
  res.sendStatus(200);
});

export default router;