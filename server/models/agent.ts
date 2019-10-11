import { Model, ModelManager } from './base';
import db, { Db } from '../db';

export enum AgentStatus {
  READY = 'ready',
  BUSY = 'busy',
}

export class Agent extends Model {
  url: string;
  status: AgentStatus;

  constructor(url: string) {
    super();
    this.url = url;
    this.status = AgentStatus.READY;
  }
}

export class AgentManager extends ModelManager {
  static tableName = 'Agent';

  constructor(db: Db) {
    super(db, AgentManager.tableName, Agent);
  }
}

export default new AgentManager(db);