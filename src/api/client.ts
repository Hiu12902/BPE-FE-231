import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { camelCase } from 'lodash';

declare module 'axios' {
  // interface AxiosResponse<T> extends Promise<T> {};
}

const camelizeKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

class Client {
  public static classInstance?: Client;
  protected axiosInstance: AxiosInstance;

  public constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://127.0.0.1:8000/api/v1/',
    });
    this.axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  public static get instance() {
    if (!this.classInstance) {
      this.classInstance = new Client();
    }

    return this.classInstance;
  }

  private _initializeRequestInterceptor = () => {
    this.axiosInstance.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      return config;
    });
  };

  private _initializeResponseInterceptor = () => {
    this.axiosInstance.interceptors.response.use(this._handleResponse, this._handleError);
  };
  private _handleResponse = ({ data }: any) => {
    return camelizeKeys(data);
  };

  protected _handleError = async (error: AxiosError) => {
    console.log(error.response);

    if (!error.response && !error.request) {
      return Promise.reject(error);
    }
    if (!error.response && error.request) {
      return Promise.reject({ message: 'No response received' });
    }
  };

  public get<T = unknown, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.get(url, config);
  }

  public delete<T = unknown, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.delete(url, config);
  }

  public post<T = unknown, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.post(url, data, config);
  }

  public put<T = unknown, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.put(url, data, config);
  }

  public patch<T = unknown, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.axiosInstance.patch(url, data, config);
  }
}

export default Client.instance;
