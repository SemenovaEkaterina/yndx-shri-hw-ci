import sqlite, { Database, Statement } from 'sqlite';
import config from './config';
import { ModelI } from './models/base';

// TODO: обработка ошибок

export type DataI = { [key: string]: string | number | null; } | {}

export default class Db {
  db?: Database;

  connect = async () => {
    // TODO: проверять наличие миграций
    console.log('CONNECT DB');

    this.db = await sqlite.open(config.db);
    await this.db.migrate({});
    return 0;
  };

  __makePlaceholders = (data: DataI, condition = ', ', keyFunc = (key: string) => `${key} = ?`) => {
    const entries = Object.entries(data);
    const placeholders = [] as Array<string>;
    const values = [] as Array<string>;
    entries.forEach(([key, value]) => {
      placeholders.push(keyFunc(key));
      values.push((value || '').toString());
    });

    return [placeholders.join(condition), values];
  };

  __makeParams = (data: DataI, condition = ', ') => {
    const entries = Object.entries(data);
    return entries.map(([key, value]) => `${key}="${value}"`).join(condition);
  };

  get = async (table: string, data: DataI): Promise<ModelI | null> => {
    if (!this.db) {
      return null;
    }
    const [placeholders, values] = this.__makePlaceholders(data, ' AND ');
    const result = await this.db.all(`SELECT * FROM ${table} WHERE ${placeholders};`, values) as Array<object>;

    return result.length > 0 ? result[0] : null;
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
    const [placeholders, values] = this.__makePlaceholders(data, ', ', () => '?');

    const {lastID} = await this.db.run(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders});`, values);
    return lastID;
  };

  update = async (table: string, search: { [key: string]: string | number }, changes: DataI) => {
    if (!this.db) {
      return;
    }
    const [placeholdersSearch, valuesSearch] = this.__makePlaceholders(search, ' AND ');
    const [placeholdersChanges, valuesChanges] = this.__makePlaceholders(changes);
    const sql = `UPDATE ${table} SET ${placeholdersChanges} WHERE ${placeholdersSearch};`;
    await this.db.run(sql, [...valuesChanges, ...valuesSearch]);
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

  delete = (table: string, id: number) => {
    if (!this.db) {
      return;
    }
    return this.db.run(`delete from ${table} where id=?;`, id);
  };
}


