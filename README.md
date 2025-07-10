# Forward Widget Libs

> Forward Widget 开发工具链 - 完整的开发、构建和测试解决方案

## 🚀 简介

Forward Widget Libs 是一个专为 Forward Widget 开发者设计的 monorepo 项目，提供了完整的开发工具链，包括：

- 🛠️ **开发工具库** - 完整的类型定义和测试工具
- 📦 **脚手架工具** - 快速创建项目的命令行工具
- 🔧 **构建插件** - 优化的构建配置和插件
- 📖 **示例项目** - 最佳实践和使用示例

## 📦 包列表

### 核心包

| 包名                                                        | 版本                                                                                                                                    | 描述                                     |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [`@forward-widget/libs`](./packages/libs)                   | [![NPM Version](https://img.shields.io/npm/v/@forward-widget/libs)](https://www.npmjs.com/package/@forward-widget/libs)                 | 核心开发工具库，提供类型定义和测试工具   |
| [`@forward-widget/rslib-plugin`](./packages/rslib-plugin)   | [![NPM Version](https://img.shields.io/npm/v/@forward-widget/rslib-plugin)](https://www.npmjs.com/package/@forward-widget/rslib-plugin) | Rslib 构建插件，优化 Widget 项目构建     |
| [`create-forward-widget`](./packages/create-forward-widget) | [![NPM Version](https://img.shields.io/npm/v/create-forward-widget)](https://www.npmjs.com/package/create-forward-widget)               | 脚手架工具，快速创建 Forward Widget 项目 |

### 示例项目

| 项目                                               | 描述               |
| -------------------------------------------------- | ------------------ |
| [`examples/rslib-plugin`](./examples/rslib-plugin) | Rslib 插件使用示例 |

## 🚀 快速开始

### 创建新的 Forward Widget 项目

```bash
# 使用脚手架创建新项目
npm create forward-widget@latest
# 或
yarn create forward-widget
# 或
pnpm create forward-widget@latest
```

### 在现有的 Rslib 项目中使用

```bash
npm install -D @forward-widget/libs @forward-widget/rslib-plugin
# 或
yarn add -D @forward-widget/libs @forward-widget/rslib-plugin
# 或
pnpm add -D @forward-widget/libs @forward-widget/rslib-plugin
```

## 📚 文档

- [**@forward-widget/libs**](./packages/libs/README.md) - 核心工具库使用指南
- [**@forward-widget/rslib-plugin**](./packages/rslib-plugin/README.md) - 构建插件配置指南
- [**create-forward-widget**](./packages/create-forward-widget/README.md) - 脚手架工具使用指南
