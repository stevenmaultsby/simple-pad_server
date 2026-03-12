export type TypeOrArray<T> = T | T[];

export interface StoragePlainData {
  [key: string]: TypeOrArray<
    string | boolean | number | null | StoragePlainData
  >;
}
export type StorageI<T = any> = {
  getItem(path: string): Promise<T>;
  setItem(path: string, data: T): Promise<void>;
  subStorage<J>(path: string): StorageI<J>;
};
