import config from '../config';
import retry from './retry';

const {server} = config;

export default (url: string, body: object) => {
  return retry(`${server}${url}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  });
}