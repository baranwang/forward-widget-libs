import type { Env } from 'hono';

export interface HonoEnv extends Env {
  Variables: {
    distPath: string;
  };
}
