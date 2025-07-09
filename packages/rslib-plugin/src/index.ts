import fs from 'node:fs';
import path from 'node:path';
import type { RsbuildPlugin } from '@rsbuild/core';
import { camelCase, upperFirst } from 'lodash-es';
import { type JSDocTagStructure, Project, type SourceFile, StructureKind, SyntaxKind } from 'ts-morph';

/**
 * 大驼峰命名转换
 */
const toPascalCase = (str: string) => upperFirst(camelCase(str));

/**
 * 安全地解析 WidgetMetadata 对象
 */
function safeParseWidgetMetadata(content: string): WidgetMetadata | null {
  try {
    // 创建安全的执行环境
    const sandbox = { WidgetMetadata: null as WidgetMetadata | null };
    const func = new Function(
      'sandbox',
      `
      let WidgetMetadata;
      ${content};
      sandbox.WidgetMetadata = WidgetMetadata;
    `,
    );

    func(sandbox);

    if (!sandbox.WidgetMetadata) {
      return null;
    }

    return sandbox.WidgetMetadata;
  } catch (error) {
    console.error('[plugin-forward-widget] 解析 WidgetMetadata 失败，跳过类型生成', error);
    return null;
  }
}

/**
 * 生成函数类型工厂函数
 */
function generateFunctionTypesFactory(sourceFile: SourceFile) {
  return async (entry: string) => {
    const content = await fs.promises.readFile(entry, 'utf-8');
    const widgetMetadataObject = safeParseWidgetMetadata(content);
    if (!widgetMetadataObject) {
      return;
    }

    for (const module of widgetMetadataObject.modules) {
      const { id, title, description, functionName, params } = module;
      // 添加注释
      sourceFile.addStatements(`\n//#region ${id}`);

      const functionParamsTypeName = toPascalCase(`${functionName}Params`);
      sourceFile.addInterface({
        name: functionParamsTypeName,
        docs: [
          {
            kind: StructureKind.JSDoc,
            description: `Params of ${title}`,
          },
        ],
        properties: params?.map((param) => {
          const type = (() => {
            switch (param.type) {
              case 'enumeration':
                return param.enumOptions?.map((option) => `'${option.value}'`).join(' | ') || 'string';
              case 'constant':
                return param.value ? `'${param.value}'` : 'undefined';
              default:
                return 'string';
            }
          })();
          return {
            name: param.name,
            docs: [
              {
                kind: StructureKind.JSDoc,
                description: param.title,
                tags: (() => {
                  const tags: JSDocTagStructure[] = [];
                  if (param.description) {
                    tags.push({
                      kind: StructureKind.JSDocTag,
                      tagName: 'description',
                      text: param.description,
                    });
                  }
                  if (param.value) {
                    tags.push({
                      kind: StructureKind.JSDocTag,
                      tagName: 'default',
                      text: `'${param.value}'`,
                    });
                  }
                  return tags;
                })(),
              },
            ],
            type,
          };
        }),
      });
      sourceFile.addFunction({
        name: functionName,
        docs: [
          {
            kind: StructureKind.JSDoc,
            description: title,
            tags: (() => {
              const tags: JSDocTagStructure[] = [];
              if (description) {
                tags.push({
                  kind: StructureKind.JSDocTag,
                  tagName: 'description',
                  text: description,
                });
              }
              tags.push(
                {
                  kind: StructureKind.JSDocTag,
                  tagName: 'param',
                  text: `{${functionParamsTypeName}} params`,
                },
                {
                  kind: StructureKind.JSDocTag,
                  tagName: 'returns',
                  text: '{Promise<VideoItem[]>}',
                },
              );
              return tags;
            })(),
          },
        ],
        parameters: [
          {
            name: 'params',
            type: functionParamsTypeName,
          },
        ],
        returnType: 'Promise<VideoItem[]>',
      });
      sourceFile.addTypeAlias({
        name: toPascalCase(`${functionName}Type`),
        docs: [title],
        type: `typeof ${functionName}`,
      });

      sourceFile.addStatements(`//#endregion ${id}`);
    }
  };
}

/**
 * 清除导出声明
 * @description Forward Widget 不支持脚本有导出声明
 */
function clearExportDeclaration(distPath: string) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(distPath);
  sourceFile.getStatements().forEach((statement) => {
    if (statement.getKind() === SyntaxKind.ExportDeclaration) {
      statement.remove();
    }
  });
  return sourceFile.save();
}

interface ForwardWidgetPluginOptions {
  /**
   * 生成的 dts 文件路径
   * @default `src/forward-widget-env.d.ts`
   */
  typesFilePath?: string;
}

export const pluginForwardWidget = ({
  typesFilePath = 'src/forward-widget-env.d.ts',
}: ForwardWidgetPluginOptions = {}): RsbuildPlugin => ({
  name: 'plugin-forward-widget',

  setup(api) {
    const dtsPath = path.resolve(api.context.rootPath, typesFilePath);
    api.transform({ test: '/\.ts$/' }, ({ code, addDependency }) => {
      addDependency(dtsPath);
      return code;
    });

    const dtsProject = new Project();

    api.onAfterBuild(async ({ stats }) => {
      const buildStats = stats?.toJson(true);
      const outputDir = buildStats?.outputPath || api.context.distPath;
      const outputFiles = buildStats?.assets?.map((asset) => path.resolve(outputDir, asset.name));

      if (!outputFiles?.length) {
        return;
      }

      let typeDefFile: SourceFile;
      if (fs.existsSync(dtsPath)) {
        typeDefFile = dtsProject.addSourceFileAtPath(dtsPath);
        typeDefFile.removeStatements([0, typeDefFile.getStatementsWithComments().length]);
      } else {
        typeDefFile = dtsProject.createSourceFile(dtsPath, '');
      }

      typeDefFile.insertText(0, `/// <reference types='@forward-widget/libs/env' />\n\n`);

      const generateWidgetTypes = generateFunctionTypesFactory(typeDefFile);

      for (const outputFile of outputFiles) {
        await clearExportDeclaration(outputFile);
        await generateWidgetTypes(outputFile);
      }

      await typeDefFile.save();
    });
  },
});
