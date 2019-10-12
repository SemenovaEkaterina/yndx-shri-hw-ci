import { BuildStatus } from '../models/build';
import { AgentStatus } from '../models/agent';
import config from '../config';
import { Models } from '../models/types';
import getCurrentTime from './getCurrentTime';
import wait from './wait';

const timeoutsCount = 5;

const checkBuilds = async (models: Models) => {
  const {build: buildManager, agent: agentManager} = models;

  const timeout = parseInt(config.timeout);

  const builds = await buildManager.list();
  builds!.map(item => {
    const current = getCurrentTime();
    if (item.status === BuildStatus.PROCESS && current - item.updated > timeoutsCount * timeout) {
      item.status = BuildStatus.NEW;
      item.agent = null;
      item.updated = null;
      buildManager.update(item);
    }
  });


  const agents = await agentManager.list();
  agents!.map(item => {
    const current = getCurrentTime();
    if (item.status === AgentStatus.BUSY && (!current || current - item.updated > timeoutsCount * timeout)) {
      agentManager.delete(item.id);
    }
  });

  await wait(1);
  await checkBuilds(models);
};

export default checkBuilds;