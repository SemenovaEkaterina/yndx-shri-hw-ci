import fetch, { Response } from 'node-fetch';
import wait from './wait';


// Утилита для ретраев с растущими таймаутами
const fetch_retry = async (url: string, options: object, n: number = 0): Promise<Response> => {
  const BASE = 2;
  const MAX_WAIT_POW = 4;
  for (let i = 0; !n || i < n;) {
    try {
      return await fetch(url, options);
    } catch (e) {
      console.log(e);
      if (n && i === 1) throw e;
      console.log(`Agent: cannot connect, ${i}`);
      await wait(BASE ** Math.min(i, MAX_WAIT_POW));
      i++;
    }
  }
  throw new Error('Неправильное число попыток');
};

export default fetch_retry;
