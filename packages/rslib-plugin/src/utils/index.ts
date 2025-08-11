import { camelCase, upperFirst } from 'lodash-es';
import type { JSDocTagStructure, OptionalKind, PropertySignatureStructure } from 'ts-morph';
import { StructureKind } from 'ts-morph';

/**
 * 大驼峰命名转换
 */
export const toPascalCase = (str: string): string => upperFirst(camelCase(str));

/**
 * 获取参数类型字符串
 */
export function getParamTypeString(param: WidgetModuleParam): string {
  switch (param.type) {
    case 'enumeration':
      return param.enumOptions?.map((option) => `'${option.value}'`).join(' | ') || 'string';
    case 'constant':
      return param.value ? `'${param.value}'` : 'undefined';
    default:
      return 'string';
  }
}

/**
 * 创建 JSDoc 标签
 */
export function createJSDocTags(param: WidgetModuleParam): JSDocTagStructure[] {
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
}

/**
 * 生成参数类型
 */
export function generateParamType(param: WidgetModuleParam): OptionalKind<PropertySignatureStructure> {
  const type = getParamTypeString(param);
  const jsdocTags = createJSDocTags(param);

  return {
    name: param.name,
    type,
    docs: [
      {
        kind: StructureKind.JSDoc,
        description: param.title,
        tags: jsdocTags,
      },
    ],
  };
}
