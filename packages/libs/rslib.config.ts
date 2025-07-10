import fs from 'node:fs';
import path from 'node:path';
import type { RsbuildPlugin } from '@rsbuild/core';
import { defineConfig } from '@rslib/core';
import { Project } from 'ts-morph';
import { generate } from 'ts-to-zod';

const tsToZodPlugin = (): RsbuildPlugin => {
  return {
    name: 'ts-to-zod',
    setup(api) {
      api.processAssets({ stage: 'additional' }, ({ sources, compilation }) => {
        const envDir = path.resolve(api.context.rootPath, 'src/env');
        const envFiles = fs
          .readdirSync(envDir)
          .map((file) => {
            if (file.endsWith('.ts')) {
              return fs.readFileSync(path.resolve(envDir, file), 'utf-8');
            }
            return '';
          })
          .join('\n');
        const project = new Project({
          useInMemoryFileSystem: true, // 关键：所有操作都在内存中进行
        });
        const sourceFile = project.createSourceFile('temp.ts', envFiles);
        sourceFile.getInterfaces().forEach((interfaceDeclaration) => {
          interfaceDeclaration.setIsExported(true);
        });
        sourceFile.getTypeAliases().forEach((typeAliasDeclaration) => {
          typeAliasDeclaration.setIsExported(true);
        });
        sourceFile.getEnums().forEach((enumDeclaration) => {
          enumDeclaration.setIsExported(true);
        });
        const sourceText = sourceFile.getText();
        const { getZodSchemasFile } = generate({
          sourceText,
          keepComments: true,
        });
        const result = getZodSchemasFile('');
        const source = new sources.RawSource(result);
        compilation.emitAsset('env.zod/index.ts', source);
      });
    },
  };
};

export default defineConfig({
  plugins: [tsToZodPlugin()],
  source: {
    entry: {
      env: './src/env/index.ts',
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
