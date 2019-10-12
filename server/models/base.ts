import Db from '../db';

export class Model {
  id?: number;
}

interface ModelManagerI {
  tableName: string;
}

export class ModelManager implements ModelManagerI {
  db: Db;
  tableName: string;
  model: any;

  constructor(db: Db, tableName: string, model: any) {
    this.db = db;
    this.tableName = tableName;
    this.model = model;
  }

  list = async () => {
    return await this.db.list(this.tableName);
  };

  get = async (data: any) => {
    return await this.db.get(this.tableName, data);
  };

  create = async (...args: Array<any>) => {
    const instance = new this.model(...args);
    instance.id = await this.db.insert(this.tableName, instance) as number;
    return instance;
  };

  update = async (instance: any) => {
    const {id, ...other} = instance;
    await this.db.update(this.tableName, {id}, other);
  };

  // Используется как select_for_update для блокировки найденных свободных агентов/сборок
  // Поиск только первой подходящей строки
  selectAndUpdate = async (search: any, changes: any) => {
    // Транзакция заблокирует выбранные данные до момента изменения данных
    await this.db.startTransaction();

    // Селект данных
    const result = await this.get(search);

    if (!result) {
      // Преждевременное завершение в случае отсуствия данных
      await this.db.commitTransaction();
      return undefined;
    }

    // Изменение данных
    // @ts-ignore
    await this.db.update(this.tableName, {id: result.id}, changes);
    await this.db.commitTransaction();

    return result;
  };

  delete = (id: number) => {
    return this.db.delete(this.tableName, id);
  }
}

