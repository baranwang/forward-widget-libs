import { pluginForwardWidget } from '@forward-widget/rslib-plugin';
import { defineConfig } from '@rslib/core';
import pkg from './package.json';

export default defineConfig({
  source: {
    define: {
      'process.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
    },
  },
  lib: [
    {
      format: 'esm',
      syntax: 'es6',
      autoExternal: false,
    },
  ],
  plugins: [pluginForwardWidget()],
});
