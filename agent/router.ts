import callServer from './utils/callServer';
import express from 'express';
const router = express.Router();

let interval: any;

const processBuild = (id: number, command: string) => {
  // Иммитация сборки
  setTimeout(async () => {
    const status = command.includes('npm') ? 'success' : 'error';

    clearInterval(interval);
    await callServer('/notify_build_result', {id, status});
  }, 2000);
};

router.post('/build', function (req, res) {
  const {id, command} = req.query;
  const timeout = req.app.get('timeout');
  processBuild(id, command);

  interval = setInterval(async () => {
    await callServer('/notify_agent_alive', {id});
  }, parseInt(timeout));

  res.sendStatus(200);
});

export default router;