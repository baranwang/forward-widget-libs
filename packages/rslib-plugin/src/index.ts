import fs from 'node:fs';
import path from 'node:path';
import { widgetMetadataSchema } from '@forward-widget/libs/env.zod';
import type { RsbuildPlugin, RsbuildPluginAPI, Rspack } from '@rsbuild/core';
import { Project, type SourceFile, SyntaxKind } from 'ts-morph';
import { addGlobalInterfaces, generateDanmuModuleInterfaces } from './generators/danmu';
import { generateVideoModuleInterface } from './generators/video';
import { generateParamType } from './utils';

// 类型定义
interface ForwardWidgetPluginOptions {
  /**
   * 生成的 dts 文件路径
   * @default `src/forward-widget-env.d.ts`
   */
  typesFilePath?: string;
}

// 元数据解析工具
function safeParseWidgetMetadataFactory(api: RsbuildPluginAPI) {
  /**
   * 安全地解析 WidgetMetadata 对象
   */
  return (content: string): WidgetMetadata | null => {
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
      const { data, success, error } = widgetMetadataSchema.safeParse(sandbox.WidgetMetadata);
      if (!success) {
        api.logger.error('解析 WidgetMetadata 失败，跳过类型生成', error);
        return null;
      }
      return data;
    } catch (error) {
      api.logger.error('解析 WidgetMetadata 失败，跳过类型生成', error);
      return null;
    }
  };
}

// 类型生成工具
/**
 * 生成函数类型工厂函数
 */
function generateFunctionTypesFactory(api: RsbuildPluginAPI, sourceFile: SourceFile) {
  const safeParseWidgetMetadata = safeParseWidgetMetadataFactory(api);

  return async (entry: string): Promise<void> => {
    try {
      const content = await fs.promises.readFile(entry, 'utf-8');
      const widgetMetadataObject = safeParseWidgetMetadata(content);

      if (!widgetMetadataObject) {
        return;
      }

      if (widgetMetadataObject.modules?.findIndex((item) => item.type === 'danmu') >= 0) {
        addGlobalInterfaces(sourceFile);
      }

      sourceFile.addInterface({
        name: 'GlobalParams',
        properties: widgetMetadataObject.globalParams?.map(generateParamType) || [],
      });

      generateModuleInterfaces(sourceFile, widgetMetadataObject.modules);
    } catch (error) {
      api.logger.error(`生成函数类型失败: ${entry}`, error);
    }
  };
}

function generateModuleInterfaces(sourceFile: SourceFile, modules: WidgetModule[]): void {
  for (const module of modules) {
    const { id, type: moduleType } = module;

    // 添加区域注释
    sourceFile.addStatements(`\n//#region ${id}`);

    if (moduleType === 'danmu') {
      generateDanmuModuleInterfaces(sourceFile, module);
    } else {
      // 没有 type 或 type 不是 'danmu' 的都是 video 类型
      generateVideoModuleInterface(sourceFile, module);
    }

    sourceFile.addStatements(`//#endregion ${id}`);
  }
}

// 文件处理工具
/**
 * 清除导出声明
 * @description Forward Widget 不支持脚本有导出声明
 */
async function clearExportDeclaration(distPath: string): Promise<void> {
  if (!fs.existsSync(distPath)) {
    return;
  }

  try {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(distPath);

    const exportStatements = sourceFile
      .getStatements()
      .filter((statement) => statement.getKind() === SyntaxKind.ExportDeclaration);

    exportStatements.forEach((statement) => statement.remove());

    if (exportStatements.length > 0) {
      await sourceFile.save();
    }
  } catch (error) {
    console.error(`清除导出声明失败: ${distPath}`, error);
  }
}

// 构建处理工具
/**
 * 处理构建后的逻辑
 */
async function processAfterBuild(
  api: RsbuildPluginAPI,
  stats: Rspack.Stats | Rspack.MultiStats | undefined,
  dtsPath: string,
): Promise<void> {
  const outputFiles = getOutputFiles(api, stats);

  if (!outputFiles.length) {
    api.logger.warn('未找到输出文件，跳过类型生成');
    return;
  }

  const typeDefFile = await setupTypeDefinitionFile(dtsPath);

  const generateWidgetTypes = generateFunctionTypesFactory(api, typeDefFile);

  // 并行处理输出文件
  await Promise.all(
    outputFiles.map(async (outputFile) => {
      await clearExportDeclaration(outputFile);
      await generateWidgetTypes(outputFile);
    }),
  );

  await typeDefFile.save();
}

function getOutputFiles(api: RsbuildPluginAPI, stats: Rspack.Stats | Rspack.MultiStats | undefined): string[] {
  const buildStats = stats?.toJson(true);
  const outputDir = buildStats?.outputPath || api.context.distPath;
  const outputFiles = buildStats?.assets?.map((asset) => path.resolve(outputDir, asset.name));

  return outputFiles?.filter((file) => fs.existsSync(file)) || [];
}

async function setupTypeDefinitionFile(dtsPath: string): Promise<SourceFile> {
  const dtsProject = new Project();
  let typeDefFile: SourceFile;

  if (fs.existsSync(dtsPath)) {
    typeDefFile = dtsProject.addSourceFileAtPath(dtsPath);
    typeDefFile.removeStatements([0, typeDefFile.getStatementsWithComments().length]);
  } else {
    typeDefFile = dtsProject.createSourceFile(dtsPath, '');
  }

  typeDefFile.insertText(0, `/// <reference types='@forward-widget/libs/env' />\n\n`);

  return typeDefFile;
}

// 主插件导出
export const pluginForwardWidget = ({
  typesFilePath = 'src/forward-widget-env.d.ts',
}: ForwardWidgetPluginOptions = {}): RsbuildPlugin => ({
  name: 'plugin-forward-widget',

  setup(api) {
    const dtsPath = path.resolve(api.context.rootPath, typesFilePath);

    // 添加类型文件依赖
    api.transform({ test: '/\.ts$/' }, ({ code, addDependency }) => {
      addDependency(dtsPath);
      return code;
    });

    api.onAfterBuild(async ({ stats }) => {
      try {
        await processAfterBuild(api, stats, dtsPath);
      } catch (error) {
        api.logger.error('Forward Widget 插件处理失败', error);
      }
    });
  },
});
