import { Options, Response, UrlOptions } from 'request';
import * as nodeRequest from 'request';

import { BASE_API_URL } from '../config';
import { AuthService } from './auth.service';
import { IStorage } from './storage.interface';
import { LocalStorageService } from '../../app/services/storage.service';

export type RequestOptions = UrlOptions & Options;

/**
 * Api Service which should handle all http calls in application.
 */
export class ApiService {

  private url: string = BASE_API_URL;
  private authService: AuthService;
  private header: { [id: string]: string } = {
    'Content-Type': 'application/json'
  };

  constructor(storage: IStorage = new LocalStorageService()) {
    this.authService = new AuthService(storage);
    this.setToken();
  }

  /**
   * Send get request on API
   *
   * @param url
   * @param queryParams
   * @param parseJson
   * @param encode
   * @param overrideUrl
   */
  get<T>(url: string, queryParams: {} = {}, parseJson = true, encode = true, overrideUrl = false): Promise<T> {

    return new Promise((resolve: Function, reject: Function) => {

      const requestOptions = this.getBaseRequestOptions(url, queryParams, overrideUrl, encode);

      nodeRequest.get(requestOptions, (error, response, body: string) => {

        if (!error && this.isResponseSuccessful(response)) {
          return resolve(parseJson ? JSON.parse(body) : body);
        } else {
          return reject(new Error(JSON.parse(error)));
        }
      });
    });
  }

  /**
   * Send post request on API
   * @param {string} url
   * @param {{}} body
   * @param {{}} queryParams
   * @param {boolean} parseJson
   * @param {boolean} encode
   * @param {boolean} overrideUrl
   * @returns {Promise<request.Response>}
   */
  post<T>(url: string, body: {} = {}, queryParams: {} = {}, parseJson = true, encode = true, overrideUrl = false): Promise<T> {

    return new Promise((resolve: Function, reject: Function) => {

      const requestOptions = this.getBaseRequestOptions(url, queryParams, overrideUrl, encode);
      this.appendBodyToRequest(body, requestOptions);

      nodeRequest.post(requestOptions, (error, response, body: string) => {

        if (!error && this.isResponseSuccessful(response)) {
          return resolve(parseJson ? JSON.parse(body) : body);
        } else {
          try {
            return reject(new Error(JSON.parse(error)));
          } catch (ex) {
            return reject(new Error(error));
          }
        }
      });
    });
  }

  /**
   * Send put request on API
   * @param {string} url
   * @param {{}} body
   * @param {{}} queryParams
   * @param {boolean} parseJson
   * @param {boolean} encode
   * @param {boolean} overrideUrl
   * @returns {Promise<request.Response>}
   */
  put<T>(url: string, body: {} = {}, queryParams: {} = {}, parseJson = true, encode = true, overrideUrl = false): Promise<T> {

    return new Promise((resolve: Function, reject: Function) => {

      const requestOptions = this.getBaseRequestOptions(url, queryParams, overrideUrl, encode);
      this.appendBodyToRequest(body, requestOptions);

      nodeRequest.put(requestOptions, (error, response, body: string) => {

        if (!error && this.isResponseSuccessful(response)) {
          return resolve(parseJson ? JSON.parse(body) : body);
        } else {
          return reject(new Error(JSON.parse(error)));
        }
      });
    });
  }

  /**
   * Send delete request on API
   * @param {string} url
   * @param {{}} body
   * @param {{}} queryParams
   * @param {boolean} parseJson
   * @param {boolean} encode
   * @param {boolean} overrideUrl
   * @returns {Promise<request.Response>}
   */
  delete<T>(url: string, body: {} = {}, queryParams: {} = {}, parseJson = true, encode = true, overrideUrl = false): Promise<Response> {

    return new Promise((resolve: Function, reject: Function) => {

      const requestOptions = this.getBaseRequestOptions(url, queryParams, overrideUrl, encode);
      this.appendBodyToRequest(body, requestOptions);

      nodeRequest.delete(requestOptions, (error, response, body: string) => {

        if (!error && this.isResponseSuccessful(response)) {
          return resolve(parseJson ? JSON.parse(body) : body);
        } else {
          return reject(new Error(JSON.parse(error)));
        }
      });
    });
  }

  /**
   * Set network headers for each call.
   *
   * @param token Authentication token
   */
  private setToken(): void {
    this.header['Authorization'] = 'Bearer ' + this.authService.getToken();
  }

  private isResponseSuccessful(response: Response) {
    return response.statusCode === 200 || response.statusCode === 201;
  }

  private getBaseRequestOptions(url: string, queryParams: {} = {}, overrideUrl: boolean = false, encode = true): RequestOptions {

    const baseObj: RequestOptions = {
      rejectUnauthorized: false,
      url: !overrideUrl ? this.url + url : url,
      headers: this.header,
      qs: queryParams
    };
    if (!encode) {
      Object.assign(baseObj, {
        encoding: null
      });
    }

    console.info('Header :', baseObj);
    return baseObj;
  }

  private appendBodyToRequest(body: {}, requestOptions: RequestOptions): void {
    Object.assign(requestOptions, {
      body: JSON.stringify(body)
    })
  }
}
