import type { SourceFile } from 'ts-morph';
import { StructureKind } from 'ts-morph';
import { toPascalCase, generateParamType } from '../utils';

/**
 * 生成 Video 模块接口
 */
export function generateVideoModuleInterface(sourceFile: SourceFile, module: WidgetModule): void {
  const functionParamsTypeName = toPascalCase(`${module.functionName}Params`);

  sourceFile.addInterface({
    name: functionParamsTypeName,
    docs: [
      {
        kind: StructureKind.JSDoc,
        description: `Params of ${module.title}`,
      },
      {
        kind: StructureKind.JSDoc,
        tags: [
          {
            kind: StructureKind.JSDocTag,
            tagName: 'example',
            text: `\nexport function ${module.functionName}(params: ${functionParamsTypeName}): Promise<VideoItem[]>`,
          },
        ],
      },
    ],
    extends: ['GlobalParams'],
    properties: module.params?.map(generateParamType),
  });
}
