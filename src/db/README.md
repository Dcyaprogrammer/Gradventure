# Backend Database Setup - Gradventure

PostgreSQL 后端配置文档

## 📦 概述

Gradventure 后端使用 PostgreSQL 数据库，通过 `postgres` 库进行连接。

### 技术栈
- **数据库**: PostgreSQL 16+
- **运行时**: Bun
- **端口**: 5433 (避免与系统 PostgreSQL 冲突)

## 🖥️ 安装 PostgreSQL

### macOS

#### 方式一：使用官方安装程序（推荐）
1. 访问 [PostgreSQL 官网](https://www.postgresql.org/download/macosx/)
2. 下载并安装最新版本的 PostgreSQL
3. 安装完成后，PostgreSQL 服务会自动启动

#### 方式二：使用 Homebrew
```bash
brew install postgresql@16
```

### Windows

1. 访问 [PostgreSQL 官网](https://www.postgresql.org/download/windows/)
2. 下载安装程序
3. 运行安装程序，按提示完成安装
4. 记住设置的密码（默认用户: postgres）

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

## 🚀 启动 PostgreSQL 服务

### macOS

**使用官方安装程序:**
```bash
# 启动服务
sudo pg_ctl -D /Library/PostgreSQL/16 start

# 停止服务
sudo pg_ctl -D /Library/PostgreSQL/16 stop

# 重启服务
sudo pg_ctl -D /Library/PostgreSQL/16 restart
```

**使用 Homebrew:**
```bash
# 启动服务
brew services start postgresql@16

# 停止服务
brew services stop postgresql@16

# 重启服务
brew services restart postgresql@16

# 查看状态
brew services list | grep postgres
```

### Windows

**方式一：使用 Services 管理器**
1. 按 `Win + R`，输入 `services.msc`
2. 找到 `postgresql-x64-16` 服务
3. 右键点击选择启动/停止/重启

**方式二：使用命令行（以管理员身份运行 PowerShell）**
```powershell
# 启动服务
net start postgresql-x64-16

# 停止服务
net stop postgresql-x64-16
```

### Linux
```bash
# 启动服务
sudo systemctl start postgresql

# 停止服务
sudo systemctl stop postgresql

# 重启服务
sudo systemctl restart postgresql

# 查看状态
sudo systemctl status postgresql
```

## 🗄️ 数据库结构

```
gradventure 数据库
├── users              # 用户表
├── user_progress      # 用户进度表
├── lessons            # 课程表
└── questions          # 问题表
```

### 表结构说明

#### users (用户表)
- `id`: 用户 ID (主键)
- `username`: 用户名 (唯一)
- `email`: 邮箱 (唯一)
- `password_hash`: 密码哈希
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### user_progress (用户进度表)
- `id`: 进度 ID (主键)
- `user_id`: 用户 ID (外键)
- `level`: 等级
- `experience_points`: 经验值
- `completed_lessons`: 已完成课程列表
- `badges`: 徽章列表
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### lessons (课程表)
- `id`: 课程 ID (主键)
- `title`: 课程标题
- `description`: 课程描述
- `category`: 课程分类
- `difficulty`: 难度等级
- `content`: 课程内容 (JSONB)
- `experience_reward`: 经验奖励
- `created_at`: 创建时间

#### questions (问题表)
- `id`: 问题 ID (主键)
- `lesson_id`: 课程 ID (外键)
- `question_text`: 问题文本
- `options`: 选项 (JSONB)
- `correct_answer`: 正确答案索引
- `explanation`: 解释说明

## ⚙️ 创建数据库

### macOS / Linux
```bash
# 连接到 PostgreSQL
psql postgres

# 创建数据库
CREATE DATABASE gradventure;

# 退出
\q
```

### Windows
```bash
# 使用 pgAdmin 图形界面创建，或使用命令行：
psql -U postgres -c "CREATE DATABASE gradventure"
```

然后输入安装时设置的密码。

## 🚀 快速开始

### 1. 修改数据库配置

编辑 `src/db/db.ts`，根据你的系统配置数据库连接：

```typescript
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,              // Windows 通常使用 5432
  database: 'gradventure',
  user: 'postgres',         // Windows 使用 postgres
  // user: 'dopamine',      // macOS 可能使用你的用户名
};
```

### 2. 初始化数据库

运行初始化脚本来创建表结构并填充示例数据：

```bash
bun run src/db/init.ts
```

### 3. 启动 API 服务器

运行示例 API 服务器：

```bash
bun run src/api/example.ts
```

服务器将在 `http://localhost:3000` 启动。

### 4. 测试 API

```bash
# 获取所有课程
curl http://localhost:3000/api/lessons

# 获取特定课程
curl http://localhost:3000/api/lessons/1

# 创建新用户
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password_hash":"hashed_password"}'

# 获取用户进度
curl http://localhost:3000/api/users/1/progress
```

## 📝 数据库连接

### macOS / Linux
```bash
# 连接到数据库（如果你的用户名有权限）
psql -d gradventure

# 或指定端口
psql -p 5433 -d gradventure

# 使用特定用户连接
psql -U dopamine -d gradventure
```

### Windows
```bash
# 使用 postgres 用户连接
psql -U postgres -d gradventure

# 然后输入安装时设置的密码
```

### 常用命令（所有平台通用）

连接后可以执行：

```sql
\dt                          -- 显示所有表
SELECT * FROM users;         -- 查询用户
SELECT * FROM lessons;       -- 查询课程
SELECT * FROM user_progress; -- 查询进度
\q                           -- 退出
```

## 📁 项目结构

```
src/
├── db/
│   ├── db.ts        # 数据库连接和查询函数
│   ├── init.ts      # 数据库初始化脚本
│   └── README.md    # 本文档
└── api/
    └── example.ts   # 示例 API 路由
```

## 🔐 环境变量 (可选)

为了更好的安全性，创建 `.env` 文件：

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gradventure
DB_USER=postgres
DB_PASSWORD=your_password
```

然后在 `db.ts` 中使用环境变量加载配置。

## 📚 下一步

1. **创建 API 路由**: 参考 `src/api/example.ts` 创建更多 API 端点
2. **添加认证**: 实现用户认证和授权
3. **前端集成**: 连接前端与后端 API
4. **扩展功能**: 添加更多游戏化功能（徽章、成就等）

## 🐛 故障排除

### PostgreSQL 无法启动

**macOS:**
检查端口是否被占用：
```bash
lsof -i :5432
lsof -i :5433
```

**Windows:**
检查服务管理器中的 PostgreSQL 服务状态

### 数据库连接失败

**macOS / Linux:**
```bash
# 检查服务状态
sudo pg_ctl -D /Library/PostgreSQL/16 status
# 或
brew services list | grep postgres
```

**Windows:**
检查 Services 中的 postgresql-x64-16 服务状态

### 权限问题

确保数据库用户有足够权限创建表和插入数据。

**macOS / Linux:**
```bash
psql postgres -c "ALTER USER dopamine WITH SUPERUSER;"
```

**Windows:**
确保 postgres 用户有超级用户权限（默认有）。

### 端口冲突

如果默认端口 5432 被占用，可以：
1. 修改 `src/db/db.ts` 中的端口号
2. 或停止占用该端口的 PostgreSQL 实例

## 📞 支持

如有问题，请检查：
1. PostgreSQL 服务是否正常运行
2. 端口配置是否正确（5432 或 5433）
3. 数据库 `gradventure` 是否已创建
4. 用户名和密码是否正确
5. 防火墙是否阻止了连接

### 系统特定帮助

**macOS 用户:**
- 检查 `/Library/PostgreSQL/16/data/` 目录权限
- 查看日志: `/Library/PostgreSQL/16/data/log/`

**Windows 用户:**
- 检查 `C:\Program Files\PostgreSQL\16\data\` 目录权限
- 查看日志: `C:\Program Files\PostgreSQL\16\data\log\`
- 可以使用 pgAdmin 图形界面管理数据库

**Linux 用户:**
- 日志位置: `/var/log/postgresql/`
- 配置文件: `/etc/postgresql/16/main/`
