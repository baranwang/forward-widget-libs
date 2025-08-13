import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { load } from 'cheerio';

interface BaseRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  allow_redirects?: boolean;
}

interface GetRequestOptions extends BaseRequestOptions {}

interface PostRequestOptions extends BaseRequestOptions {
  body?: unknown;
}

const createHttpRequest = async <T>(
  url: string,
  method: 'GET' | 'POST',
  options?: BaseRequestOptions & { body?: unknown },
) => {
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  if (method === 'POST' && options?.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);
  const textData = await response.text();

  let data: T;
  try {
    data = JSON.parse(textData) as T;
  } catch {
    data = textData as T;
  }

  return {
    data,
    statusCode: response.status,
    headers: Object.fromEntries(response.headers),
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
    get: async <T>(url: string, options?: GetRequestOptions) => {
      return createHttpRequest<T>(url, 'GET', options);
    },
    post: async <T>(url: string, body: unknown, options?: PostRequestOptions) => {
      return createHttpRequest<T>(url, 'POST', { ...options, body });
    },
  },
  tmdb: {
    get: async <T>(url: string, options?: GetRequestOptions) => {
      const urlObj = new URL(`/3/${url}`, 'https://api.themoviedb.org/');
      options ||= {};
      options.headers = {
        ...options.headers,
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      };
      const resp = await WidgetAdaptor.http.get<T>(urlObj.toString(), options);
      return resp.data;
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
