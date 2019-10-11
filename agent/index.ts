import express from 'express';
import config from './config';
import fetch from 'node-fetch';

const {port, server} = config;

const app = express();
let agentId: number;

const process = (id: number, command: string) => {
  setTimeout(() => {
    const status = command.includes('npm') ? 'success' : 'error';

    fetch(`http://${server}/notify_build_result?id=${id}&status=${status}&agent=${agentId}`, {method: 'POST'});
  }, 3000);
};

app.post('/build', function (req, res) {
  const {id, command} = req.query;
  process(id, command);

  res.sendStatus(200);
});


app.listen(config.port, async function () {
  const data = await fetch(`http://${server}/notify_agent?host=localhost&port=${port}`, {method: 'POST'});
  const {id} = await data.json();
  agentId = id;

  console.log(`Agent listening on port ${port}!`);
});