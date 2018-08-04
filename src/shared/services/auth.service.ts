import { IStorage } from './storage.interface';

export class AuthService {

  private TOKEN_KEY = 'token';

  constructor(private storage: IStorage) {}

  getToken(): string {
    return this.storage.get(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    this.storage.put(this.TOKEN_KEY, token);
  }
}
