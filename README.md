# English Learning System

![Umi](https://img.shields.io/badge/Umi-4.x-1677ff)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-0170fe)

一个面向系统化英语学习的前端项目，包含三大知识库页面，目标是让学习路径从「会拼读」到「会语法」再到「会综合运用」。

## 目录

- [项目亮点](#项目亮点)
- [页面与学习体系](#页面与学习体系)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [脚本说明](#脚本说明)
- [目录结构](#目录结构)
- [部署说明](#部署说明)
- [贡献建议](#贡献建议)
- [License](#license)

## 项目亮点

- **系统化学习路径**：自然拼读 -> 语法 -> 综合能力
- **阶段化内容组织**：每个页面按学习阶段编排，适合长期学习
- **学习进度可视化**：支持掌握状态统计与进度条展示
- **知识点批注能力**：支持文本高亮、圈注、清理等学习标记
- **目录快速定位**：锚点跳转 + 左侧目录，复习效率高

## 页面与学习体系

### 1) 自然拼读系统知识库（`/phonics`）

- 目标：建立从字母和音素到音节、重音、规则和例外的拼读基础
- 适合：英语初学者、需要修复读音与拼写基础的学习者

### 2) 英语语法知识库（`/`）

- 目标：建立从词类到句子结构、时态、从句、非谓语的系统语法能力
- 适合：希望提升拆句、造句、改错能力的学习者

### 3) 英语剩余知识点系统（`/remaining`）

- 目标：补齐语法之外的综合能力（读写听说、语用、学术与研究能力）
- 适合：从“会做题”进阶到“会使用英语学习和表达”的学习者

### 推荐学习顺序

1. `自然拼读系统知识库`
2. `英语语法知识库`
3. `英语剩余知识点系统`

## 技术栈

- `@umijs/max`
- `React 18`
- `TypeScript`
- `Ant Design 5`
- `lucide-react`

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 启动开发

```bash
npm run dev
```

默认启动 Umi 本地开发服务器。

### 3) 构建生产包

```bash
npm run build
```

### 4) 类型检查

```bash
npm run check
```

## 脚本说明

| 脚本 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run check` | TypeScript 无输出类型检查 |
| `npm run init` | 英语复习系统初始化（Python 脚本） |
| `npm run sync` | 同步复习数据（Python 脚本） |
| `npm run exam` / `npm run generate` | 生成练习或试卷（Python 脚本） |
| `npm run grade` | 批改结果并更新复习状态（Python 脚本） |

> 说明：`init/sync/exam/grade` 依赖项目中的 Python 脚本环境。

## 目录结构

```text
.
├── src
│   ├── components            # 学习组件（批注、进度、庆祝动画等）
│   ├── data                  # 知识库数据（语法、拼读、剩余能力）
│   ├── hooks                 # 页面行为 hooks
│   └── pages                 # 页面入口（/、/phonics、/remaining）
├── package.json
└── README.md
```

## 部署说明

- 当前可通过 `npm run build` 生成静态产物进行部署
- 若后续需要，可补充：
  - GitHub Pages 部署流程
  - Vercel / Netlify 一键部署配置
  - 自定义域名与 CDN 配置

## 贡献建议

如要持续演进本项目，建议优先从以下方向优化：

- 增加页面截图和演示 GIF，提升仓库可读性
- 增加知识点检索功能（关键词搜索）
- 增加学习记录导出能力（如 JSON/Markdown）
- 增加移动端布局优化

## License

当前未显式声明开源协议。若准备开源，建议补充 `MIT` License 文件。
