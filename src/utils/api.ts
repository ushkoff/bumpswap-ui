import axios from 'axios';

export const getBaseUrl = (): string => `http://localhost:3003/api/`;

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000, // 30 sec
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
