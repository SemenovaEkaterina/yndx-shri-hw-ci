import callServer from '../utils/callServer';
import express from 'express';
import processBuild from '../utils/processBuild';
const router = express.Router();

router.post('/build', async function (req, res) {
  const {id, command, hash, repo} = req.body;

  const timeout = parseInt(req.app.get('timeout'));


  // Раз в полученный timeout уведомлять сервер
  // Иначе сервер будет считать агента неработающим
  const interval = setInterval(async () => {
    await callServer('/notify_agent_alive', {id});
  }, timeout);

  // Сам процесс сборки
  processBuild(id, repo, hash, command).then(() => {
    clearInterval(interval);
  });

  res.sendStatus(200);
});

export default router;