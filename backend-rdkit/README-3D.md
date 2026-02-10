# 3D 构型预览环境安装与排障手册

本说明专门用于 ChemWeb 的 3D 预览功能（RDKit 后端）。内容覆盖环境准备、安装、启动、前端联调、以及常见错误排查。

## 一、功能依赖与总体结构

3D 预览需要：

- 前端：3Dmol.js（本地离线，已放在 public/3dmol/3Dmol-min.js）
- 后端：Python + RDKit + FastAPI（在 backend-rdkit）
- 环境变量：前端通过 VITE_3D_API_BASE 访问后端接口

请求流程：

1) 前端点击 3D 预览
2) 前端请求 RDKit 接口生成 3D 构型
3) 返回 SDF 与原子/键数据
4) 3Dmol.js 渲染

## 二、硬件/系统/网络要求

- Windows 10/11 或 macOS/Linux
- `Python 3.10` 或 `3.11`（建议 3.11）
- 可访问 PyPI（网络阻断时需配置镜像或离线包）

不建议使用 Python 3.12+，因为 rdkit-pypi 可能没有可用轮子。

## 三、快速开始（推荐）

1) 安装 Python 3.11。
2) 进入 backend-rdkit 目录并创建虚拟环境。
3) 安装依赖。
4) 启动后端并访问健康检查。

如果你是第一次接触命令行或 PATH，请看下面的“详细安装与新手指引”。

## 四、详细安装与启动

### 1) 下载安装 Python

Windows：

1) 打开官网：https://www.python.org/downloads/
2) 下载 Python 3.11.x（Windows installer）。
3) 安装时勾选“Add Python to PATH”，再点击 Install。
4) 安装完成后，打开 PowerShell 执行：

```
python --version
```

若显示类似 `Python 3.11.x`，说明安装成功。

macOS / Linux：

- 建议使用系统包管理器安装 Python 3.11（例如 Homebrew / apt / dnf）。
- 安装后执行 `python3.11 --version` 验证。

提示：如果安装时没有勾选“Add Python to PATH”，请按下面的 Path 设置步骤补上。

### 2) 新手指引（熟悉 PowerShell/CMD 的可跳过）

如何唤起`powershell`：按下`win+R`，在弹出的框里填入`powershell`，回车即可。

`PowerShell/CMD` 都是“命令行窗口”，用于让你直接输入命令给系统执行。
比如 `python`、`pip`、`uvicorn` 这些命令，本质是去调用某个可执行程序（`.exe`）。

为什么要把某些文件夹加入系统路径（`Path`）？
系统在执行命令时，会按顺序在 `Path` 列表里逐个文件夹查找对应的可执行程序。
如果没有把 Python 的安装目录和 Scripts 目录加入 Path，系统就找不到 `python.exe` 或 `pip.exe`，
结果就是“不是内部或外部命令”的报错。不添加到路径，你就得把这个可执行文件的完整路径输入进来，非常不方便。

简单理解：
- Path 就是一串“搜索路径清单”。
- 命令行只会在这些路径里找 .exe。
- 加入路径后，命令就能在任何目录直接使用。


`cd`是一个“传送符”，告诉系统它得去哪。 后面跟着参数得是完整路径，否则会报错。
完整路径就是从盘符开始到目标文件（夹）结束的一个字符串，如`C:\Users\your_addr\Desktop\ChemWeb\backend-rdkit`

如果没有勾选“Add Python to PATH”，请手动添加系统路径（Windows 10/11）：

1) 打开“设置” -> “系统” -> “关于” -> “高级系统设置”。
2) 在“系统属性”窗口中点击“环境变量”。
3) 在“用户变量”或“系统变量”中找到 `Path`，点击“编辑”。
4) 点击“新建”，添加 Python 安装路径，例如：
	- `C:\Users\your_addr\AppData\Local\Programs\Python\Python311\`
	- 以及 Scripts 路径：`C:\Users\your_addr\AppData\Local\Programs\Python\Python311\Scripts\`
5) 一路点击“确定”保存。
6) 重新打开 PowerShell，执行 `python --version` 验证是否生效。
若成功安装，则会显示你安装的Python版本：
```
PS C:\Users\your_addr> python --version
Python 3.11.9
```
版本号有由你下载的安装包决定，此处仅作为示例。

### 3) Windows（PowerShell）

```powershell
cd C:\Users\your_addr\Desktop\ChemWeb\backend-rdkit (完整路径仅做示例)
py -3.11 -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4) macOS / Linux（bash）

```bash
cd backend-rdkit
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 5) 启动服务

```bash
cd backend-rdkit
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

健康检查：

```
http://localhost:8000/api/health
```

若正常启动，会返回一个`json`：

```
{"status":"ok"}
```

## 五、前端配置

根目录 `.env` 里设置后端地址：

```
VITE_3D_API_BASE=http://localhost:8000
```

前端启动后即可在结构式编辑页面进行 3D 预览。

## 六、常见报错对照表

以下按“一条报错 + 一条解法”的方式整理，便于快速对照：

1) 报错：
```
'python' 不是内部或外部命令，也不是可运行的程序
或批处理文件。
```
解法：把 Python 安装目录与 Scripts 目录加入系统 Path，然后重新打开 PowerShell。

2) 报错：
```
ERROR: No matching distribution found for rdkit-pypi
```
解法：确认 Python 版本为 3.10/3.11，并临时切换官方源：
```
pip install -i https://pypi.org/simple rdkit-pypi
```

3) 报错：
```
A module compiled using NumPy 1.x cannot be run in NumPy 2.x
```
解法：
```
pip install "numpy<2"
```

4) 报错：
```
ImportError: DLL load failed while importing rdBase
```
解法：确认 Python 为 64 位，并删除 venv 重新创建后再安装依赖。

5) 报错：
```
ModuleNotFoundError: No module named 'rdkit'
```
解法：确保当前终端已激活 `.venv`，并重新执行 `pip install -r requirements.txt`。

6) 报错：
```
uvicorn : 无法将“uvicorn”项识别为 cmdlet、函数、脚本文件或可运行程序
```
解法：确认已激活 `.venv`，或使用 `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`。

7) 报错：
```
Failed to fetch
```
解法：检查后端是否启动、端口是否正确、以及前端 `.env` 的 VITE_3D_API_BASE 是否指向可访问地址。

## 七、其他常见问题（非报错文本）

1) Uvicorn 启动但前端请求失败

- 检查后端是否运行在 8000 端口
- `.env` 中的 VITE_3D_API_BASE 是否正确
- 访问 `http://localhost:8000/api/health` 是否返回 OK

2) 跨域或 Mixed Content 报错

- 本地开发建议全部使用 `http`
- 生产环境需用反向代理或同域部署

3) 3Dmol.js 未加载或显示空白

- 文件是否存在：`public/3dmol/3Dmol-min.js`
- 浏览器控制台是否有 `3Dmol` 未定义

4) 分子结构异常、扭曲或过于平面

- 尝试在 2D 编辑器中补全结构后再生成
- 如果数据源异常，可在后端对 SDF 做进一步修正

## 八、验证清单

- [ ] Python 版本 3.10/3.11
- [ ] 依赖安装完成且无报错
- [ ] `http://localhost:8000/api/health` 正常
- [ ] 前端 `.env` 指向正确后端地址
- [ ] 3Dmol.js 文件存在且可被访问
- [ ] 3D 预览按钮可正常显示与关闭

### 7) 分子结构异常、扭曲或过于平面

可能原因：

- 原始结构不完整或缺少氢
- 某些芳香/配位结构需要特殊处理

建议：

- 尝试在 2D 编辑器中补全结构后再生成
- 如果数据源异常，可在后端对 SDF 做进一步修正

## 八、验证清单

- [ ] Python 版本 3.10/3.11
- [ ] 依赖安装完成且无报错
- [ ] `http://localhost:8000/api/health` 正常
- [ ] 前端 `.env` 指向正确后端地址
- [ ] 3Dmol.js 文件存在且可被访问
- [ ] 3D 预览按钮可正常显示与关闭

## 九、可选：离线安装

如果无法联网：

1) 在可联网机器上下载依赖 wheel
2) 拷贝到本机
3) 使用 `pip install --no-index --find-links` 安装

示例：

```bash
pip download -r requirements.txt -d wheels
pip install --no-index --find-links=wheels -r requirements.txt
```

## 十、维护建议

- 如果更新 rdkit 版本，请同步更新 requirements.txt
- 如果更换端口，记得更新 `.env` 中的 VITE_3D_API_BASE
- 保持 3Dmol.js 为本地离线版本，避免 CDN 不稳定

## 十一、联系

若仍有解决不了的问题，请致信 302025510036@zjut.edu.cn
