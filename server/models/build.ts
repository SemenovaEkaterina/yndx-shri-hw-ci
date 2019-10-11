import { Model, ModelManager } from './base';
import db, { Db } from '../db';

export enum BuildStatus {
  NEW = 'new',
  PROCESS = 'process',
  SUCCESS = 'success',
  ERROR = 'error',
}

export class Build extends Model {
  status: BuildStatus;
  command: string;
  agent?: number;
  updated?: number;

  constructor(command: string, status: BuildStatus = BuildStatus.NEW) {
    super();
    this.command = command;
    this.status = status;
  }
}

export class BuildManager extends ModelManager {
  static tableName = 'Build';

  constructor(db: Db) {
    super(db, BuildManager.tableName, Build);
  }
}

export default new BuildManager(db);