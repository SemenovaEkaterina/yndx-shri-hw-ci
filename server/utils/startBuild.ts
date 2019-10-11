import buildManager, { Build, BuildStatus } from '../models/build';
import agentManager, { Agent, AgentStatus } from '../models/agent';
import fetch from 'node-fetch';

export default async () => {

  // Занять сборку на обработку
  const build = await buildManager.selectAndUpdate({status: BuildStatus.NEW}, {status: BuildStatus.PROCESS}) as Build;

  if (!build) {
    return;
  }

  // Занять агента на обработку
  const agent = await agentManager.selectAndUpdate({status: AgentStatus.READY}, {status: AgentStatus.BUSY});

  if (agent) {
    const url = `http://${(agent as Agent).url}/build?id=${build.id}&command=${build.command}`;
    fetch(url, {method: 'POST'});
  } else {
    // Вернуть сборку в статус new, если нет агента
    build.status = BuildStatus.NEW;
    buildManager.update(build);
  }
};