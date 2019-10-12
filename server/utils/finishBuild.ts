import buildManager, { Build, BuildStatus } from '../models/build';
import agentManager, { Agent, AgentStatus } from '../models/agent';

export default async (build: Build, agent: Agent, status: number, stdout: string, stderr: string) => {
  build.status = !status ? BuildStatus.SUCCESS : BuildStatus.ERROR;
  build.stdout = stdout;
  build.stderr = stderr;
  await buildManager.update(build);
  agent.status = AgentStatus.READY;
  await agentManager.update(agent);
};