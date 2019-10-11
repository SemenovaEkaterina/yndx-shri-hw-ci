import buildManager, { BuildStatus } from '../models/build';
import agentManager, { AgentStatus } from '../models/agent';
import config from '../config.json';

const timeoutsCount = 5;

export default async () => {
  const timeout = parseInt(config.timeout);

  const builds = await buildManager.list();
  builds!.map(item => {
    const current = new Date().getTime();
    if (item.status === BuildStatus.PROCESS && current - item.updated > timeoutsCount * timeout) {
      item.status = BuildStatus.NEW;
      item.agent = null;
      item.updated = null;
      buildManager.update(item);
    }
  });


  const agents = await agentManager.list();
  agents!.map(item => {
    const current = new Date().getTime();
    if (item.status === AgentStatus.BUSY && (!current || current - item.updated > timeoutsCount * timeout)) {
      agentManager.delete(item.id);
    }
  });
};