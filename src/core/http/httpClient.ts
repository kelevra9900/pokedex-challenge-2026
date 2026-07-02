import axios, { type AxiosInstance } from 'axios';
import { POKEAPI_BASE_URL } from '../config/env';

export function createHttpClient(): AxiosInstance {
  // eslint-disable-next-line import/no-named-as-default-member -- known false positive with axios's CJS/ESM interop shape
  return axios.create({
    baseURL: POKEAPI_BASE_URL,
    timeout: 10000,
  });
}
