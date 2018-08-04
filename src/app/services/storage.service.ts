import { IStorage } from '../../shared/services/storage.interface';

export class LocalStorageService implements IStorage {

  get(key: string): string {

    return localStorage.getItem(key);
  }

  put(key: string, value: string): void {

    localStorage.setItem(key, value);
  }
}
