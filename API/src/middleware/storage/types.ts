import {StorageI} from '../../services/storage/type';

declare global {
  namespace Express {
    interface Request {
      storage: StorageI;
    }
  }
}

export {};
