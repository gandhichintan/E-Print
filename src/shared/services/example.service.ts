import { ApiService } from './api.service';

export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export class ExampleService {

  private _apiService: ApiService;

  constructor() {
    this._apiService = new ApiService();
  }

  getAllPosts(): Promise<IPost[]> {

    return this._apiService.get<IPost[]>('posts');
  }


  createPost(): Promise<IPost> {

    return this._apiService.post<IPost>('posts', {
      title: 'foo',
      body: 'bar',
      userId: 1
    });
  }
}
