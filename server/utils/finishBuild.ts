import { Build, BuildStatus } from '../models/build';
import { Agent, AgentStatus } from '../models/agent';
import { Models } from '../models/types';


// Обновление статусов
export default async (models: Models, build: Build, agent: Agent, status: number, stdout: string, stderr: string) => {
  const {build: buildManager, agent: agentManager} = models;

  build.status = !status ? BuildStatus.SUCCESS : BuildStatus.ERROR;
  build.stdout = stdout;
  build.stderr = stderr;
  await buildManager.update(build);
  agent.status = AgentStatus.READY;
  await agentManager.update(agent);
};