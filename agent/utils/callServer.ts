import config from '../config';
import retry from './retry';

const {server} = config;

// Утилита для запросов к серверу
export default (url: string, body: object) => {
  return retry(`${server}${url}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  });
}