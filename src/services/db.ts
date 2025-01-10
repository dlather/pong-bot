// Will be used to interact with the database

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { DB_SCHEMA } from '../utils/types.js';

const defaultData: DB_SCHEMA = { lastProcessedBlock: 0 };
const dbPath = 'db.json';

class Database {
  private db: Low<DB_SCHEMA>;

  constructor() {
    const adapter = new JSONFile<DB_SCHEMA>(dbPath);
    this.db = new Low<DB_SCHEMA>(adapter, defaultData);
  }

  async read() {
    await this.db.read();
    return this.db.data;
  }

  async write(data: Partial<DB_SCHEMA>) {
    this.db.data = { ...this.db.data, ...data };
    await this.db.write();
  }
}

export default Database;
