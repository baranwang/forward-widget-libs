import type { SourceFile, WriterFunction } from 'ts-morph';
import { StructureKind } from 'ts-morph';
import { toPascalCase } from '../utils';

/**
 * 获取弹幕模块的返回类型扩展
 */
function getReturnTypeExtends(moduleId: string): WriterFunction | undefined {
  switch (moduleId) {
    case 'searchDanmu':
      return (writer) => writer.write('Promise<{ animes: Array<AnimeItem> }>');
    case 'getDetail':
      return (writer) => writer.write('Promise<Array<EpisodeItem>>');
    default:
      return undefined;
  }
}

/**
 * 生成弹幕模块接口
 */
export function generateDanmuModuleInterfaces(sourceFile: SourceFile, module: WidgetModule): void {
  const { id, functionName, title } = module;
  const functionParamsTypeName = toPascalCase(`${functionName}Params`);
  const returnTypeName = toPascalCase(`${functionName}ReturnType`);

  sourceFile.addInterface({
    name: functionParamsTypeName,
    docs: [
      {
        kind: StructureKind.JSDoc,
        description: `Params of ${title}`,
      },
      {
        kind: StructureKind.JSDoc,
        tags: [
          {
            kind: StructureKind.JSDocTag,
            tagName: 'example',
            text: `\nexport function ${functionName}(params: ${functionParamsTypeName}): ${returnTypeName}`,
          },
        ],
      },
    ],
    extends: (writer) => {
      writer.write('GlobalParams, BaseDanmuParams');
      if (id === 'getDetail') {
        writer.write(', AnimeItem');
      }
      if (id === 'getComments') {
        writer.write(', EpisodeItem');
      }
    },
  });

  if (id === 'getComments') {
    sourceFile.addInterface({
      name: 'CommentItem',
      properties: [
        {
          name: 'cid',
          type: 'number',
        },
        {
          name: 'p',
          type: 'string',
        },
        {
          name: 'm',
          type: 'string',
        },
      ],
    });
  }

  // 生成返回类型接口
  sourceFile.addInterface({
    name: returnTypeName,
    extends: getReturnTypeExtends(id),
    properties:
      id === 'getComments'
        ? [
            {
              name: 'count',
              type: 'number',
              docs: [
                {
                  kind: StructureKind.JSDoc,
                  description: '评论数量',
                },
              ],
            },
            {
              name: 'comments',
              type: 'Array<CommentItem>',
            },
          ]
        : [],
  });
}

export function addGlobalInterfaces(sourceFile: SourceFile): void {
  sourceFile.addInterface({
    name: 'AnimeItem',
    properties: [{ name: 'animeId', type: 'string | number' }],
  });
  sourceFile.addInterface({
    name: 'EpisodeItem',
    properties: [{ name: 'commentId', type: 'string' }],
  });
}
