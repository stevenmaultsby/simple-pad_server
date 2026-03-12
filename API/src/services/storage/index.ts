import {STORAGE_DATA_PREFIX} from '../../conf/vars';
import {FSStorage} from './fs';
import {StorageI} from './type';

let storage: StorageI | null;

export default (s?: StorageI): StorageI => {
  if (s) {
    storage = s;
    return storage;
  } else {
    if (!storage) {
      storage = new FSStorage(STORAGE_DATA_PREFIX);
    }
    return storage;
  }
};
