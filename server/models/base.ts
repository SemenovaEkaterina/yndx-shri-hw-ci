import Db, { DataI } from '../db';

export class ModelI {
  id?: number;
}

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

  get = async (data: DataI): Promise<ModelI | null> => {
    return await this.db.get(this.tableName, data);
  };

  create = async (...args: Array<string | number | null>) => {
    const instance = new this.model(...args);
    instance.id = await this.db.insert(this.tableName, instance) as number;
    return instance;
  };

  update = async (instance: ModelI) => {
    const {id, ...other} = instance;
    // Точно есть id
    await this.db.update(this.tableName, {id: id as number}, other);
  };

  // Используется как select_for_update для блокировки найденных свободных агентов/сборок
  // Поиск только первой подходящей строки
  selectAndUpdate = async (search: DataI, changes: DataI) => {
    // Транзакция заблокирует выбранные данные до момента изменения данных
    await this.db.startTransaction();

    // Селект данных
    const result = await this.get(search);

    if (!result) {
      // Преждевременное завершение в случае отсуствия данных
      await this.db.commitTransaction();
      return undefined;
    }
    // В записи из базы точно будет id
    // @ts-ignore
    const id = result.id as number;

    // Изменение данных
    await this.db.update(this.tableName, {id}, changes);
    await this.db.commitTransaction();

    return result;
  };

  delete = (id: number) => {
    return this.db.delete(this.tableName, id);
  }
}

