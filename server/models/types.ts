import { AgentManager } from './agent';
import { BuildManager } from './build';

export interface Models {
  agent: AgentManager;
  build: BuildManager;
}