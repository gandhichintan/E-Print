export interface IStorage {
  put(key: string, value: string): void;
  get(key: string): string | null;
}
