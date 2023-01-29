import { AppError } from '@utils/AppError';
import axios from 'axios';
const { BASE_URL } = process.env;

const api = axios.create({
  baseURL: BASE_URL
});

api.interceptors.response.use(response => response, error => {
  if(error.response && error.response.data){
    return Promise.reject(new AppError(error.response.data.message));
  }else {
    return Promise.reject(error);
  }
});

export { api };