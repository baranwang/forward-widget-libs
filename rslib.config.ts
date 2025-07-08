import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      env: './src/env.ts',
      'widget-adaptor': './src/widget-adaptor.ts',
    },
  },
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
    },
  ],
});
