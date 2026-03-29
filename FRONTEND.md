# 前端基础配置完成

React + Vite + TypeScript + TailwindCSS 前端框架已配置完成。

## ✅ 已完成配置

### 🛠️ 技术栈
- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 开发服务器
- **TailwindCSS 4.x** - CSS 框架
- **React Router v7** - 路由
- **@tanstack/react-query** - 数据管理
- **Axios** - HTTP 客户端
- **Framer Motion** - 动画

### 📁 项目结构
```
frontend/
├── src/
│   ├── assets/         # 静态资源
│   ├── App.tsx         # 主应用（示例）
│   ├── main.tsx        # 入口
│   └── index.css       # 全局样式
├── .env                # 环境变量
├── tailwind.config.js  # TailwindCSS 配置
├── vite.config.ts      # Vite 配置
└── package.json        # 依赖
```

## 🚀 启动项目

```bash
cd frontend
bun install      # 安装依赖（首次运行）
bun run dev      # 启动开发服务器
```

访问 http://localhost:5173

## 🎨 TailwindCSS 可用配置

### 自定义组件类
```tsx
<button className="btn-primary">主要按钮</button>
<button className="btn-secondary">次要按钮</button>
<input className="input-field" />
<div className="card">卡片</div>
```

### 自定义颜色
- `primary-*`: 蓝色系（50-900）
- `accent-*`: 金/橙色系（50-900）

## 🔧 环境变量

`.env` 文件：
```env
VITE_API_URL=http://localhost:3000
```

## 📚 相关文档

- **后端 API**: `AUTH_SETUP.md`
- **数据库**: `src/db/README.md`
- **认证**: `src/auth/README.md`

---

**配置完成，等待团队代码合并！** 🚀
