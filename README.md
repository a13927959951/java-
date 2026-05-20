# 🚀 Java I/O 闯关挑战

> 一款基于 Vue3 + Express 的全栈交互式学习游戏，帮助掌握 Java 输入输出机制知识喵~

[![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express)](https://expressjs.com/)
[![Pinia](https://img.shields.io/badge/Pinia-2.1-FFD859)](https://pinia.vuejs.org/)
[![C++](https://img.shields.io/badge/C++-17-00599C?logo=c%2B%2B)](https://isocpp.org/)

---

## 📋 目录

- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
- [API 接口](#-api-接口)
- [关卡介绍](#-关卡介绍)
- [成就系统](#-成就系统)
- [C++ 后端编译](#-c-后端编译可选)
- [更新日志](#-更新日志)

---

## ✨ 功能特性

### 🎮 核心玩法
- **6 大关卡** — 从字节流基础到 NIO 高级特性，层层递进
- **💖 生命值机制** — 答对 +1 血，答错 -1 血，零血闯关失败
- **🔥 连击系统** — 连续答对触发 combo，冲击最高连击记录
- **♾️ 无尽挑战** — 不限关卡，难度递增，AI 生成题目永不重复
- **🏅 成就系统** — 8 种成就等你解锁

### 🧠 学习功能
- **📚 知识导图** — 深度扩展的 Java I/O 思维导图：
  - 🔍 搜索功能 — 快速定位知识点
  - 🏷️ 标签筛选 — 按类型过滤（字节流/字符流/NIO/实战）
  - 📊 学习进度 — 实时追踪学习完成度
  - 📋 代码复制 — 一键复制示例代码
  - ✓ 学习标记 — 标记已学章节
- **🤖 AI 助手** — 深度集成 DeepSeek API，支持：
  - 💬 问答模式 — 解答 Java I/O 疑惑
  - 💻 代码生成 — 生成带注释的完整代码
  - 📝 题目生成 — 自动出题检验学习效果
  - 🔧 专家模式 — 深入剖析 I/O 底层原理
  - 🧩 本地知识库 — 无 API 密钥也能用

### 🎨 用户体验
- **🌌 动态粒子背景** — 美观的粒子动画效果
- **蓝色主题 UI** — 现代感渐变设计
- **流畅动画反馈** — 答题正确/错误即时动画
- **localStorage 持久化** — 自动保存游戏进度和成就
- **响应式设计** — 适配桌面和移动设备

---

## 🛠 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端框架** | Vue 3 (Composition API) | 单文件组件 + `<script setup>` |
| **构建工具** | Vite 5 | 极速 HMR 热更新 |
| **路由** | Vue Router 4 | SPA 页面路由 |
| **状态管理** | Pinia 2 | 游戏状态、关卡数据、成就系统 |
| **后端服务** | Express 4 (Node.js) | RESTful API + AI 代理 |
| **AI 接口** | DeepSeek API | 可选接入，不填密钥用本地知识库 |
| **C++ 后端** | C++17 + Socket | 可选，需 g++ 编译（代码已提供） |
| **JSON 库** | nlohmann/json | C++ JSON 解析 |
| **粒子效果** | Canvas API | 动态粒子背景动画 |

---

## 📂 项目结构

```
File/
├── frontend/                          # Vue3 前端
│   ├── src/
│   │   ├── router/
│   │   │   └── index.js               # 路由配置（5 个路由）
│   │   ├── stores/
│   │   │   └── gameStore.js           # Pinia 状态管理
│   │   ├── components/
│   │   │   └── ParticleBackground.vue # 动态粒子背景组件
│   │   ├── views/
│   │   │   ├── HomeView.vue           # 首页（关卡选择 + 成就）
│   │   │   ├── GameView.vue           # 关卡答题页
│   │   │   ├── EndlessView.vue        # 无尽挑战页（AI 出题）
│   │   │   ├── MindmapView.vue        # 知识导图页（深度扩展）
│   │   │   └── AiAssistantView.vue    # AI 助手页
│   │   ├── App.vue                    # 根组件
│   │   └── main.js                    # 入口文件
│   ├── index.html                     # HTML 入口
│   ├── vite.config.js                 # Vite 配置 + API 代理
│   └── package.json
│
├── backend/                           # 后端服务
│   ├── server.js                      # Express API 服务（主用）
│   ├── package.json
│   ├── CMakeLists.txt                 # C++ CMake 构建配置
│   ├── src/
│   │   └── main.cpp                   # C++ HTTP Server 源码
│   └── include/
│       └── nlohmann/
│           └── json.hpp               # nlohmann JSON 库（官方正版）
│
├── scripts/                           # 启动脚本
│   ├── start-all.bat                  # Windows 一键启动
│   ├── start-all.ps1                  # PowerShell 服务管理
│   ├── start-backend.bat              # 单独启动后端
│   └── start-frontend.bat             # 单独启动前端
│
├── legacy/                            # 旧版单页面应用（参考）
│   ├── java-io-game.html
│   ├── game.js
│   ├── styles.css
│   └── ...
├── .gitignore                         # Git 忽略配置
└── README.md                          # 项目说明文档
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.x
- **npm** >= 9.x

### 方法一：一键启动（推荐）

```bash
# Windows
scripts\start-all.bat

# PowerShell
.\scripts\start-all.ps1 start
```

### 方法二：手动启动

#### 1. 启动后端

```bash
cd backend
npm install
npm start
```

后端运行在 `http://localhost:8080`

#### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 `http://localhost:5173`

#### 3. 打开浏览器

访问 **http://localhost:5173** 开始游戏喵~

---

## 📡 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/health` | 健康检查 |
| `GET` | `/api/questions/all` | 获取所有题目 |
| `GET` | `/api/questions/level/:level` | 按关卡获取题目 |
| `GET/POST` | `/api/questions/random` | 随机获取题目（支持 `difficulty` 参数） |
| `GET` | `/api/achievements` | 获取成就列表 |
| `POST` | `/api/ai/chat` | AI 对话接口 |
| `POST` | `/api/ai/generate-question` | AI 题目生成（无尽挑战专用） |

### AI 题目生成接口（无尽挑战）

```json
POST /api/ai/generate-question
Content-Type: application/json

{
  "apiKey": "sk-xxx（可选）",
  "difficulty": 3,
  "usedQuestionHashes": ["q1a2b3c", "q4d5e6f"]
}
```

- **apiKey**: DeepSeek API 密钥（可选，不填用本地题库）
- **difficulty**: 难度级别（1-6）
- **usedQuestionHashes**: 已使用的题目哈希数组（用于去重）

返回示例：

```json
{
  "level": 3,
  "question": "使用缓冲流后，数据写入目标文件的时机是？",
  "options": ["立即写入", "缓冲区满或调用 flush()/close() 时", "每 1 秒写入一次", "程序结束时写入"],
  "correct": 1,
  "explanation": "数据先写入缓冲区，缓冲区满或手动 flush()/close() 时才实际写入。",
  "fromAI": false
}
```

### AI 对话接口示例

```json
POST /api/ai/chat
Content-Type: application/json

{
  "apiKey": "sk-xxx（可选，不填用本地知识库）",
  "message": "什么是字节流？",
  "role": "general"
}
```

四种角色：`general`（问答）、`code`（代码生成）、`question`（题目生成）、`ioExpert`（I/O 专家）

---

## 📖 关卡介绍

| 关卡 | 主题 | 核心知识点 |
|------|------|-----------|
| 🎯 第1关 | 字节流基础 | InputStream / OutputStream / File Stream |
| 🌊 第2关 | 字符流入门 | Reader / Writer / InputStreamReader / OutputStreamWriter |
| ⚡ 第3关 | 缓冲流进阶 | BufferedStream 原理 / flush / readLine |
| 📁 第4关 | 文件操作 | File / Files / 序列化 / try-with-resources |
| 🚀 第5关 | NIO 新世界 | Channel / Buffer / Selector / flip |
| 👑 第6关 | 综合挑战 | 所有知识综合运用 |

---

## 🏅 成就系统

| 成就 | 条件 |
|------|------|
| ⭐ 初露锋芒 | 答对第一道题 |
| 🎯 新手入门 | 完成第一关 |
| 💯 完美通关 | 一关内全部答对 |
| 🏆 通关大师 | 完成所有 6 个关卡 |
| 🔥 连击高手 | 连续答对 10 题 |
| 📚 答题达人 | 累计答对 20 题 |
| ♾️ 无尽挑战者 | 无尽模式答对 15 题 |
| 📖 知识探索者 | 学习知识导图 |

---

## 🖥️ C++ 后端编译（可选）

> C++ 后端代码已提供但非必需，默认使用 Node.js 后端。

### 安装 g++ 编译器（Windows）

```powershell
# 下载 MinGW-w64 并解压到 C:\mingw64
# 或从 https://winlibs.com 下载
# 添加到 PATH: C:\mingw64\mingw64\bin
```

### 编译运行

```bash
cd backend
mkdir build && cd build
cmake ..
cmake --build .
./game-server
```

C++ 服务器监听 `http://localhost:8080`

---

## 🎮 使用指南

1. **首页** — 选择关卡卡片开始游戏，或点击「无尽挑战 / 知识导图 / AI 助手」
2. **答题** — 选择答案，查看即时反馈和解析
3. **闯关** — 答对足够题目即可通关
4. **无尽模式** — 无限答题，难度随连续答对 3 题递增一级（最高 6 级）
5. **知识导图** — 搜索知识点、按标签筛选、标记学习进度、复制代码示例
6. **AI 助手** — 底部输入 DeepSeek API 密钥（可选），开始智能对话

---

## � 更新日志

### v2.0（2026-05-20）
- ✅ 修复无尽挑战题号显示错误
- ✅ 深度扩展思维导图功能（搜索、标签筛选、学习进度、代码复制）
- ✅ 添加动态粒子背景效果
- ✅ 整理项目文件结构（脚本移入 scripts/）
- ✅ 更新 README 文档

### v1.5（2026-05-19）
- ✅ 实现无尽挑战 AI 题目生成接口
- ✅ 添加题目去重机制（哈希算法）
- ✅ 实现难度递增逻辑（每 3 连击 +1 级）
- ✅ 集成 DeepSeek API 支持

### v1.0（2026-05-18）
- ✅ Vue3 + Express 全栈架构
- ✅ 6 大关卡设计
- ✅ 生命值与连击系统
- ✅ 成就系统
- ✅ 知识导图
- ✅ AI 助手

---

## �📜 License

MIT License — 仅供学习交流使用喵~