# ChemWeb

ChemWeb 是一个面向高中阶段的化学学习平台，包含知识速览、元素速查、式量计算与配平、拓展阅读、常用数据速查，以及本地离线的化学结构式编辑器与 3D 预览。

## 功能概览

- 知识速览与拓展阅读：分专题整理必修与选修内容。
- 元素速查：元素列表与详情查询入口。
- 计算与配平：式量计算与化学方程式配平工具页。
- 结构式编辑：基于 ChemDoodle Web Components 免费版的 2D 编辑与 MOL 导出。
- 常用数据速查：酸碱强度（Ka/Kb）、电极电势、常数表、Ksp 溶解性矩阵。
- 3D 预览（可选）：前端调用 RDKit 后端生成构型。

## 技术栈

- Vue 3 + Vite
- Vue Router
- ChemDoodle Web Components（本地离线资源）
- RDKit 3D 后端（可选，用于 3D 构型生成）
- markdown-it（用于渲染 3D 预览说明页）

## 本地资源说明（ChemDoodle）

结构式编辑器依赖本地离线资源，文件放在 public/chemdoodle：

- ChemDoodleWeb.js
- ChemDoodleWeb-uis.js
- ChemDoodleWeb.css

如果更换 ChemDoodle 版本，请确保以上文件路径与名称保持一致。

## 3D 构型后端（RDKit）

如需完整的环境安装与排障说明，请阅读：

- [backend-rdkit/README-3D.md](backend-rdkit/README-3D.md)

前端 3D 预览通过后端接口生成构型，默认接口地址来自 `.env`：

```
VITE_3D_API_BASE=http://localhost:8000
```

### 1) 运行环境要求

- Python 3.10 或 3.11（不建议 3.12+，rdkit-pypi 可能缺少对应轮子）
- 能访问 PyPI（建议使用官方源）

### 2) 创建虚拟环境并安装依赖

Windows (PowerShell)：

```powershell
cd backend-rdkit
py -3.11 -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

macOS / Linux：

```bash
cd backend-rdkit
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

如果你使用了镜像源导致找不到 rdkit-pypi，请临时切换官方源：

```bash
pip install -i https://pypi.org/simple rdkit-pypi
```

### 3) 兼容性说明（重要）

rdkit-pypi 需要 NumPy 1.x。若出现类似 `A module compiled using NumPy 1.x` 报错，请执行：

```bash
pip install "numpy<2"
```

### 4) 启动后端

```bash
cd backend-rdkit
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

健康检查：

```
http://localhost:8000/api/health
```

### 5) 前端 3D 预览离线资源

3D 预览使用 3Dmol.js，本地离线文件位于：

```
public/3dmol/3Dmol-min.js
```

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
- /chemdoodle：结构式编辑（ChemDoodle）
- /datasets：实用性表速查入口
- /datasets/acidity：酸碱强度（Ka/Kb）
- /datasets/solubility：溶解度与 Ksp 矩阵
- /datasets/electrode-potentials：电极电势
- /datasets/constants：化学常数表

说明：为了兼容旧版静态页面链接，路由中保留了若干 *.html 的重定向入口。

## 目录结构

```
public/
	3dmol/                 # 3Dmol.js 本地离线资源
	chemdoodle/            # ChemDoodle 本地离线资源
	data/                  # 数据集 JSON
	legacy/                # 旧版静态内容
src/
	assets/                # 站点与编辑器样式
	modules/               # 旧版内容加载与交互
	router/                # 路由配置
	views/                 # 页面视图
```

## 许可与声明

ChemDoodle Web Components 为第三方库，请遵循其官方许可协议进行分发与使用。
