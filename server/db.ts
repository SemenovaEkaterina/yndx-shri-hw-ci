import sqlite, { Database, Statement } from 'sqlite';

// TODO: обработка ошибок

export class Db {
  db?: Database;

  connect = async () => {
    // TODO: проверять наличие миграций
    console.log('CONNECT DB');

    this.db = await sqlite.open('./database.sqlite');
    await this.db.migrate({});
    return 0;
  };

  __makeParams = (data: any, condition = ', ') => {
    const entries = Object.entries(data);
    return entries.map(([key, value]) => `${key}="${value}"`).join(condition);
  };

  get = async (table: string, data: any) => {
    if (!this.db) {
      return;
    }
    // TODO: обработка ошибок
    const result = await this.db.all(`SELECT * FROM ${table} WHERE ${this.__makeParams(data, ' AND ')};`) as Array<object>;
    return result.length > 0 ? result[0] : undefined;
  };

  list = async (table: string) => {
    if (!this.db) {
      return;
    }
    return await this.db.all(`SELECT * FROM ${table};`);
  };

  insert = async (table: string, data: { [key: string]: string }) => {
    if (!this.db) {
      return;
    }
    const columns = Object.keys(data);
    const values = Object.values(data).map(item => `"${item}"`);
    const {lastID} = (await this.db.run(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')});`)) as Statement;
    return lastID;
  };

  update = async (table: string, search: { [key: string]: string }, changes: any) => {
    if (!this.db) {
      return;
    }
    const sql = `UPDATE ${table} SET ${this.__makeParams(changes)} WHERE ${this.__makeParams(search, " AND ")};`;
    await this.db.run(sql);
  };

  startTransaction = () => {
    if (!this.db) {
      return;
    }
    return this.db.run('begin exclusive transaction');
  };

  commitTransaction = () => {
    if (!this.db) {
      return;
    }
    return this.db.run('commit');
  };
}

export default new Db();


