import {mkdirSync} from 'node:fs';
import {StorageI} from './type';
import {STORAGE_DATA_PREFIX} from '../../conf/vars';
import {join} from 'node:path';
import {readFile, writeFile} from 'node:fs/promises';

export class FSStorage<T> implements StorageI<T> {
  pathPrefix: string;
  constructor(prefix: string = '') {
    this.pathPrefix = join(STORAGE_DATA_PREFIX, prefix);
    mkdirSync(this.pathPrefix, {
      recursive: true,
    });
  }
  async getItem(name: string): Promise<T> {
    const data = await readFile(join(this.pathPrefix, name));
    return JSON.parse(data.toString());
  }
  async setItem(name: string, data: T): Promise<void> {
    return writeFile(join(this.pathPrefix, name), JSON.stringify(data));
  }
  subStorage<J>(path: string): StorageI<J> {
    return new FSStorage<J>(join(this.pathPrefix, path));
  }
}
