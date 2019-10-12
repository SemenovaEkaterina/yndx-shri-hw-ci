import { Build, BuildStatus } from '../models/build';
import { Agent, AgentStatus } from '../models/agent';
import fetch from 'node-fetch';
import { Models } from '../models/types';
import getCurrentTime from './getCurrentTime';

export default async (models: Models, repo: string) => {
  const {build: buildManager, agent: agentManager} = models;

  // Занять агента на обработку
  const agent = await agentManager.selectAndUpdate({status: AgentStatus.READY}, {
    status: AgentStatus.BUSY,
    updated: getCurrentTime()
  }) as Agent;

  if (!agent) {
    return;
  }

  const changes = {
    status: BuildStatus.PROCESS,
    agent: agent.id,
    updated: getCurrentTime()
  };
  // Занять сборку на обработку
  const build = await buildManager.selectAndUpdate({status: BuildStatus.NEW}, changes) as Build;

  if (build) {
    const url = `${(agent as Agent).url}/build`;
    const body = JSON.stringify({
      id: build.id,
      command: build.command,
      hash: build.hash,
      repo
    });
    const headers = {'Content-Type': 'application/json'};
    await fetch(url, {
      method: 'POST',
      body,
      headers
    }).catch((e: ExceptionInformation) => {
      console.log(e);
      // В случае ошибки удаляем агента
      console.log(`Delete agent: ${e}`);
      agentManager.delete(agent.id!);
      build.status = BuildStatus.NEW;
      buildManager.update(build);
    });
  } else {
    // Освободить агент, если нет сборки
    agent.status = AgentStatus.READY;
    agentManager.update(agent);
  }
};