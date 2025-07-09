import fs from 'node:fs';
import path from 'node:path';
import type { RsbuildPlugin } from '@rsbuild/core';
import { camelCase, upperFirst } from 'lodash-es';
import { Node, Project, type SourceFile, SyntaxKind } from 'ts-morph';

/**
 * 处理单个入口点配置，提取所有入口路径
 */
function extractEntriesFromConfig(entryConfig: unknown): string[] {
  const entries: string[] = [];

  if (typeof entryConfig === 'string') {
    entries.push(entryConfig);
  } else if (Array.isArray(entryConfig)) {
    entries.push(...entryConfig.filter((entry) => typeof entry === 'string'));
  } else if (entryConfig && typeof entryConfig === 'object') {
    const entryObj = entryConfig as { import?: string | string[] };

    if (entryObj.import) {
      if (typeof entryObj.import === 'string') {
        entries.push(entryObj.import);
      } else if (Array.isArray(entryObj.import)) {
        entries.push(
          ...entryObj.import.filter((entry) => typeof entry === 'string'),
        );
      }
    }
  }

  return entries;
}

function generateFunctionTypesFactory(rootPath: string) {
  const typesDir = path.resolve(rootPath, '.fw-types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  return async (entry: string) => {
    const content = await fs.promises.readFile(entry, 'utf-8');
    const widgetMetadataObject: WidgetMetadata = new Function(
      `let WidgetMetadata; ${content}; return WidgetMetadata;`,
    )();
    if (!widgetMetadataObject) {
      return;
    }
    const project = new Project();
    const entryPath = path.relative(rootPath, entry);
    const fileName = entryPath.replace(/\//g, '+').replace(/\.[^.]+$/, '');
    const filePath = path.resolve(typesDir, `${fileName}.d.ts`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    const sourceFile = project.createSourceFile(filePath, '');

    for (const module of widgetMetadataObject.modules) {
      const { functionName } = module;
      const functionParamsTypeName = upperFirst(
        camelCase(`${functionName}Params`),
      );
      sourceFile.addInterface({
        name: functionParamsTypeName,
        isExported: true,
        docs: [module.title, module.description || ''].filter(Boolean),
        properties: module.params?.map((param) => {
          const type = (() => {
            switch (param.type) {
              case 'enumeration':
                return (
                  param.enumOptions
                    ?.map((option) => `'${option.value}'`)
                    .join(' | ') || 'string'
                );
              case 'constant':
                return `'${param.value}'`;
              default:
                return 'string';
            }
          })();
          return {
            name: param.name,
            docs: [param.title, param.description || ''].filter(Boolean),
            type,
          };
        }),
      });
      sourceFile.addFunction({
        name: functionName,
        isExported: true,
        docs: [module.title, module.description || ''].filter(Boolean),
        parameters: [
          {
            name: 'params',
            type: functionParamsTypeName,
          },
        ],
        returnType: 'Promise<VideoItem[]>',
      });
    }
    sourceFile.save();
  };
}

export const pluginForwardWidget = (): RsbuildPlugin => ({
  name: 'plugin-forward-widget',

  setup(api) {
    const generateFunctionTypes = generateFunctionTypesFactory(
      api.context.rootPath,
    );

    api.onBeforeBuild(({ environments }) => {
      const allEntries = new Set<string>();
      for (const environment of Object.values(environments)) {
        for (const entryConfig of Object.values(environment.entry)) {
          const entries = extractEntriesFromConfig(entryConfig);
          entries.forEach((entry) => allEntries.add(entry));
        }
      }
      Array.from(allEntries).forEach(generateFunctionTypes);
    });
  },
});
