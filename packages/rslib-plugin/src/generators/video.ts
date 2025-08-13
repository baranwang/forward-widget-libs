import type { SourceFile } from 'ts-morph';
import { StructureKind } from 'ts-morph';
import { generateModuleFunctionType, generateParamType, generateTypeName } from '../utils';

/**
 * 生成 Video 模块接口
 */
export function generateVideoModuleInterface(sourceFile: SourceFile, module: WidgetModule) {
  const { paramsTypeName, returnTypeName } = generateTypeName(module);

  sourceFile.addInterface({
    name: paramsTypeName,
    docs: [
      {
        kind: StructureKind.JSDoc,
        description: `Params of ${module.title}`,
      },
    ],
    extends: ['GlobalParams'],
    properties: module.params?.map(generateParamType),
  });

  sourceFile.addInterface({
    name: returnTypeName,
    docs: [
      {
        kind: StructureKind.JSDoc,
        description: `Return Type of ${module.title}`,
      },
    ],
    extends: ['Array<VideoItem>'],
  });

  generateModuleFunctionType(sourceFile, module);
}
