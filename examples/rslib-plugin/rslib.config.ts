import { pluginForwardWidget } from '@forward-widget/rslib-plugin';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  plugins: [pluginForwardWidget()],
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
    },
  ],
});
