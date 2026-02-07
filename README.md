# ChemWeb

ChemWeb 是一个面向高中阶段的化学学习平台，包含知识速览、元素速查、式量计算与配平、拓展阅读，以及本地离线的化学结构式编辑器。

## 功能概览

- 知识速览与拓展阅读：分专题整理必修与选修内容。
- 元素速查：元素列表与详情查询入口。
- 计算与配平：式量计算与化学方程式配平工具页。
- 结构式编辑：基于 ChemDoodle Web Components 免费版的 2D 编辑与 MOL 导出。

## 技术栈

- Vue 3 + Vite
- Vue Router
- ChemDoodle Web Components（本地离线资源）

## 本地资源说明（ChemDoodle）

结构式编辑器依赖本地离线资源，文件放在 public/chemdoodle：

- ChemDoodleWeb.js
- ChemDoodleWeb-uis.js
- ChemDoodleWeb.css

如果更换 ChemDoodle 版本，请确保以上文件路径与名称保持一致。

## 开发与构建

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## 主要页面路由

- /：首页
- /knowledge：知识速览
- /elements：元素速查
- /calculation：式量计算
- /calculation/balancing：方程式配平
- /extension：拓展知识
- /ketcher：结构式编辑（ChemDoodle）

说明：为了兼容旧版静态页面链接，路由中保留了若干 *.html 的重定向入口。

## 目录结构

```
public/
	chemdoodle/            # ChemDoodle 本地离线资源
src/
	assets/                # 站点与编辑器样式
	router/                # 路由配置
	views/                 # 页面视图
```

## 许可与声明

ChemDoodle Web Components 为第三方库，请遵循其官方许可协议进行分发与使用。
