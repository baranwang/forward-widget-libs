import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { load } from 'cheerio';

const fetchFactory = (method: 'GET' | 'POST') => {
  return async <T>(url: string, options?: RequestInit) => {
    return fetch(url, { ...options, method }).then(async (res) => {
      let data = (await res.text()) as T;
      try {
        data = JSON.parse(data as string) as T;
      } catch (error) {
        console.error(error);
      }
      return {
        data,
        statusCode: res.status,
        headers: Object.fromEntries(res.headers),
      };
    });
  };
};

const STORAGE_CONFIG = {
  get DIR() {
    const dir = path.join(os.tmpdir(), 'forward-widget-adaptor', 'storage');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  },
};

export const WidgetAdaptor = {
  http: {
    get: fetchFactory('GET'),
    post: fetchFactory('POST'),
  },
  tmdb: {
    get: <T>(url: string, options?: RequestInit) => {
      const urlObj = new URL(url, 'https://api.themoviedb.org/');
      options ||= {};
      options.headers = {
        ...options.headers,
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      };
      return WidgetAdaptor.http.get<T>(urlObj.toString(), options);
    },
  },
  html: {
    load: load as typeof import('cheerio').load,
  },
  storage: {
    getItem: (key: string) => {
      const value = fs.readFileSync(path.join(STORAGE_CONFIG.DIR, key), 'utf-8');
      return value;
    },
    setItem: (key: string, value: string) => {
      fs.writeFileSync(path.join(STORAGE_CONFIG.DIR, key), value);
    },
    removeItem: (key: string) => {
      fs.promises.unlink(path.join(STORAGE_CONFIG.DIR, key));
    },
    clear: () => {
      fs.rmSync(STORAGE_CONFIG.DIR, { recursive: true });
    },
    keys: () => {
      const files = fs.readdirSync(STORAGE_CONFIG.DIR);
      return files.map((file) => path.basename(file));
    },
  },
};
