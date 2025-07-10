# @forward-widget/rslib-plugin

[![NPM Version](https://img.shields.io/npm/v/@forward-widget/rslib-plugin)](https://www.npmjs.com/package/@forward-widget/rslib-plugin)
![NPM License](https://img.shields.io/npm/l/@forward-widget/rslib-plugin)

> Forward Widget 专用的 Rslib 构建插件

## 🚀 简介

`@forward-widget/rslib-plugin` 是一个专为 Forward Widget 开发优化的 Rslib 插件。它提供了以下核心功能：

- 🔧 **自动类型生成**：根据 `WidgetMetadata` 自动生成 TypeScript 类型定义
- 📦 **构建优化**：清除 Forward Widget 不支持的导出声明
- 🛠️ **开发体验**：提供完整的类型支持和智能提示
- 🔄 **热更新**：开发模式下自动重新生成类型定义

## 📦 安装

```bash
npm install -D @forward-widget/rslib-plugin
# 或
yarn add -D @forward-widget/rslib-plugin
# 或
pnpm add -D @forward-widget/rslib-plugin
```

## 🛠️ 使用方法

### 基础配置

在你的 `rslib.config.ts` 文件中添加插件：

```ts
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
```

### 自定义配置

```ts
import { pluginForwardWidget } from '@forward-widget/rslib-plugin';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  plugins: [
    pluginForwardWidget({
      typesFilePath: 'src/custom-types.d.ts', // 自定义类型文件路径
    }),
  ],
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
    },
  ],
});
```

## 📋 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `typesFilePath` | `string` | `'src/forward-widget-env.d.ts'` | 生成的类型定义文件路径 |

## 💡 工作原理

### 1. 解析 WidgetMetadata

插件会解析你的代码中的 `WidgetMetadata` 对象：

```ts
// src/index.ts
WidgetMetadata = {
  id: 'my-widget',
  title: 'My Widget',
  modules: [
    {
      id: 'search-module',
      title: 'Search Module',
      functionName: 'searchContent',
      description: 'Search for content',
      params: [
        {
          name: 'query',
          title: 'Search Query',
          type: 'input',
        },
        {
          name: 'category',
          title: 'Category',
          type: 'enumeration',
          enumOptions: [
            { title: 'Movies', value: 'movies' },
            { title: 'TV Shows', value: 'tvshows' },
          ],
        },
      ],
    },
  ],
};
```

### 2. 生成类型定义

插件会根据 `WidgetMetadata` 自动生成相应的类型定义：

```ts
// src/forward-widget-env.d.ts
/// <reference types='@forward-widget/libs/env' />

//#region search-module
/**
 * Params of Search Module
 */
interface SearchContentParams {
  /**
   * Search Query
   */
  query: string;
  /**
   * Category
   */
  category: 'movies' | 'tvshows';
}

/**
 * Search Module
 * @description Search for content
 * @param {SearchContentParams} params
 * @returns {Promise<VideoItem[]>}
 */
function searchContent(params: SearchContentParams): Promise<VideoItem[]>;

/**
 * Search Module
 */
type SearchContentType = typeof searchContent;
//#endregion search-module
```

### 3. 清除导出声明

插件会自动清除构建输出中的导出声明，因为 Forward Widget 不支持脚本有导出声明。

## 📚 完整示例

### 项目结构

```
my-widget/
├── src/
│   ├── index.ts                    # 主要逻辑
│   └── forward-widget-env.d.ts     # 自动生成的类型定义
├── rslib.config.ts                 # 构建配置
├── package.json
└── tsconfig.json
```

### 源代码示例

```ts
// src/index.ts
WidgetMetadata = {
  id: 'movie-search',
  title: '电影搜索',
  modules: [
    {
      id: 'search',
      title: '搜索电影',
      functionName: 'searchMovies',
      description: '根据关键词搜索电影',
      params: [
        {
          name: 'keyword',
          title: '关键词',
          type: 'input',
        },
        {
          name: 'year',
          title: '年份',
          type: 'input',
        },
        {
          name: 'genre',
          title: '类型',
          type: 'enumeration',
          enumOptions: [
            { title: '动作', value: 'action' },
            { title: '喜剧', value: 'comedy' },
            { title: '剧情', value: 'drama' },
          ],
        },
      ],
    },
  ],
};

// 实现搜索函数
async function searchMovies(params: SearchMoviesParams): Promise<VideoItem[]> {
  const { keyword, year, genre } = params;
  
  // 使用 Widget API 进行搜索
  const response = await Widget.http.get('https://api.example.com/search', {
    params: { q: keyword, year, genre },
  });
  
  return response.data.map(item => ({
    id: item.id,
    title: item.title,
    year: item.year,
    // ... 其他字段
  }));
}
```

### 生成的类型定义

```ts
// src/forward-widget-env.d.ts (自动生成)
/// <reference types='@forward-widget/libs/env' />

//#region search
/**
 * Params of 搜索电影
 */
interface SearchMoviesParams {
  /**
   * 关键词
   */
  keyword: string;
  /**
   * 年份
   */
  year: string;
  /**
   * 类型
   */
  genre: 'action' | 'comedy' | 'drama';
}

/**
 * 搜索电影
 * @description 根据关键词搜索电影
 * @param {SearchMoviesParams} params
 * @returns {Promise<VideoItem[]>}
 */
function searchMovies(params: SearchMoviesParams): Promise<VideoItem[]>;

/**
 * 搜索电影
 */
type SearchMoviesType = typeof searchMovies;
//#endregion search
```

## 🎯 支持的参数类型

插件支持以下参数类型的自动类型生成：

| 参数类型 | 描述 | 生成的 TypeScript 类型 |
|----------|------|----------------------|
| `input` | 输入框 | `string` |
| `enumeration` | 枚举选择 | `'option1' \| 'option2' \| ...` |
| `constant` | 常量值 | `'constantValue'` |

## 🔧 开发模式

在开发模式下，插件会监听文件变化并自动重新生成类型定义：

```bash
# 启动开发模式
npm run dev
# 或
pnpm dev
```

## 🤝 最佳实践

1. **保持 WidgetMetadata 结构清晰**：确保每个模块都有明确的 ID 和功能定义
2. **使用描述性的函数名**：函数名应该清晰地表达其功能
3. **提供完整的参数描述**：为每个参数提供有意义的标题和描述
4. **合理组织模块**：将相关功能组织在一起，避免模块过于复杂

## 📚 相关文档

- [@forward-widget/libs](../libs/README.md) - 核心工具库
- [create-forward-widget](../create-forward-widget/README.md) - 脚手架工具
- [Forward Widget 开发指南](https://docs.forward-widget.com)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改善这个项目。

## 📄 许可证

MIT License