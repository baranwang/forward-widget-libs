import { pluginForwardWidget } from '@forward-widget/rslib-plugin';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  plugins: [
    pluginForwardWidget({
      devPort: 8080,
    }),
  ],
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
    },
  ],
});
