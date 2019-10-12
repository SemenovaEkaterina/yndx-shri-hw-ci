import { Model, ModelManager } from './base';
import Db from '../db';

export enum BuildStatus {
  NEW = 'new',
  PROCESS = 'process',
  SUCCESS = 'success',
  ERROR = 'error',
}

export class Build extends Model {
  status: BuildStatus;
  hash: string;
  command: string;
  agent?: number;
  updated?: number;
  stdout?: string;
  stderr?: string;

  constructor(hash: string, command: string, status: BuildStatus = BuildStatus.NEW) {
    super();
    this.hash = hash;
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