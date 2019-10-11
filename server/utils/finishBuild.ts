import buildManager, { Build } from '../models/build';
import agentManager, { Agent, AgentStatus } from '../models/agent';
import startBuild from './startBuild';

export default async (build: Build, agent: Agent, status: any) => {
  build.status = status;
  await buildManager.update(build);
  agent.status = AgentStatus.READY;
  await agentManager.update(agent);

  // Поиск и запуск новой сборки
  startBuild();
};