import fetch, {Response} from 'node-fetch';

const fetch_retry= async (url: string, options: object, n: number = 2): Promise<Response> => {
    try {
        return await fetch(url, options)
    } catch(err) {
        if (n === 1) throw err;
        return await fetch_retry(url, options, n - 1);
    }
};

export default fetch_retry;
