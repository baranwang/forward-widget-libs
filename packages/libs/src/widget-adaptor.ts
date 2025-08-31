import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { gunzip } from 'node:zlib';
import { load } from 'cheerio';

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  zlibMode?: boolean;
  allow_redirects?: boolean;
}

const createHttpRequest = async <T>(
  url: string,
  method: 'GET' | 'POST',
  options?: RequestOptions & { body?: unknown },
) => {
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  if (method === 'POST' && options?.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }
  const uri = new URL(url);
  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      uri.searchParams.set(key, value);
    });
  }

  let data: T;
  const response = await fetch(uri, fetchOptions);
  if (options?.zlibMode) {
    data = (await promisify(gunzip)(await response.arrayBuffer())) as T;
  } else {
    const textData = await response.text();
    try {
      data = JSON.parse(textData) as T;
    } catch {
      data = textData as T;
    }
  }

  // 处理多值 headers，如 set-cookie
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    if (headers[key]) {
      headers[key] = `${headers[key]}, ${value}`;
    } else {
      headers[key] = value;
    }
  });

  return {
    data,
    statusCode: response.status,
    headers,
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
    get: async <T>(url: string, options?: RequestOptions) => {
      return createHttpRequest<T>(url, 'GET', options);
    },
    post: async <T>(url: string, body: unknown, options?: RequestOptions) => {
      return createHttpRequest<T>(url, 'POST', { ...options, body });
    },
  },
  tmdb: {
    get: async <T>(url: string, options?: RequestOptions) => {
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
    get: (key: string) => {
      const filePath = path.join(STORAGE_CONFIG.DIR, encodeURIComponent(key));
      if (!fs.existsSync(filePath)) {
        return null;
      }
      return fs.promises.readFile(filePath, 'utf-8');
    },
    set: (key: string, value: string) => {
      return fs.promises.writeFile(path.join(STORAGE_CONFIG.DIR, encodeURIComponent(key)), value, 'utf-8');
    },
    clear: () => {
      return fs.promises.rm(STORAGE_CONFIG.DIR, { recursive: true });
    },
  },
};
