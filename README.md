# @forward-widget/libs

[![NPM Version](https://img.shields.io/npm/v/@forward-widget/libs)](https://www.npmjs.com/package/@forward-widget/libs)
![NPM License](https://img.shields.io/npm/l/@forward-widget/libs)

> Forward Widget 开发工具库

## 🚀 简介

`@forward-widget/libs` 是一个专为 Forward Widget 开发者设计的工具库，提供了完整的类型定义和测试工具，帮助开发者更高效地构建和测试 Widget 应用。

## 📦 安装

```bash
npm install @forward-widget/libs
# 或
yarn add @forward-widget/libs
# 或
pnpm add @forward-widget/libs
```

## 🛠️ 使用方法

### 环境类型定义

#### TypeScript 项目

在您的项目中创建一个 `.d.ts` 文件，引入类型定义：

```ts
// forward-widget-env.d.ts
/// <reference types="@forward-widget/libs/env" />
```

这样您就可以在 TypeScript 代码中获得完整的类型支持：

```ts
// 现在可以使用 Widget 相关的类型和全局变量
const metadata: WidgetMetadata = {
  name: 'My Widget',
  version: '1.0.0',
  // ... 其他配置
};
```

#### JavaScript 项目

对于 JavaScript 项目，您可以使用 JSDoc 来获得类型提示：

```js
/**
 * @type {import('@forward-widget/libs/env').WidgetMetadata}
 */
const WidgetMetadata = {
  name: 'My Widget',
  version: '1.0.0',
  // ... 其他配置
};
```

### 单元测试

`@forward-widget/libs` 提供了 `WidgetAdaptor` 来模拟 Widget 运行环境，方便进行单元测试。

以 [Rstest](http://rstest.rs/) 为例：

```ts
import { expect, test, beforeAll } from '@rstest/core';

beforeAll(async () => {
  const { WidgetAdaptor } = await import('@forward-widget/libs/widget-adaptor');
  rstest.stubGlobal('Widget', WidgetAdaptor);
});

test('测试 HTTP 请求', async () => {
  const response = await Widget.http.get('https://api.example.com/data');
  expect(response).toBeDefined();
  expect(response.status).toBe(200);
});
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改善这个项目。

## 📄 许可证

MIT License