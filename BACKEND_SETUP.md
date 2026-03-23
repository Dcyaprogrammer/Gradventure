# Gradventure 后端配置完成 ✓

PostgreSQL 数据库已成功配置！

## 快速开始

### 1️⃣ 启动 PostgreSQL 服务

#### macOS

**如果你用官方安装程序安装的:**
```bash
sudo pg_ctl -D /Library/PostgreSQL/16 start
```

**如果你用 Homebrew 安装的:**
```bash
brew services start postgresql@16
```

#### Windows

**方式一：图形界面**
1. 按 `Win + R`，输入 `services.msc` 回车
2. 找到 `postgresql-x64-16` 服务
3. 右键点击 → 启动

**方式二：命令行（管理员权限的 PowerShell）**
```powershell
net start postgresql-x64-16
```

#### Linux
```bash
sudo systemctl start postgresql
```

---

### 2️⃣ 创建数据库

#### macOS / Linux
```bash
psql postgres -c "CREATE DATABASE gradventure;"
```

#### Windows
```bash
psql -U postgres -c "CREATE DATABASE gradventure"
```
然后输入安装时设置的密码。

---

### 3️⃣ 配置数据库连接

编辑 `src/db/db.ts`，根据你的系统修改配置：

**Windows:**
```typescript
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'gradventure',
  user: 'postgres',
  password: 'your_password',  // 添加这一行
};
```

**macOS (Homebrew):**
```typescript
const DB_CONFIG = {
  host: 'localhost',
  port: 5433,  // 如果使用 5433 端口
  database: 'gradventure',
  user: 'dopamine',  // 你的 macOS 用户名
};
```

**macOS (官方安装):**
```typescript
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'gradventure',
  user: 'postgres',
  password: 'your_password',
};
```

---

### 4️⃣ 初始化数据库

```bash
bun run db:init
```

这将创建所有表并插入示例数据。

---

### 5️⃣ 测试连接

**macOS / Linux:**
```bash
# 查看表
psql -d gradventure -c "\dt"

# 查看示例数据
psql -d gradventure -c "SELECT * FROM lessons;"
```

**Windows:**
```bash
psql -U postgres -d gradventure -c "\dt"
psql -U postgres -d gradventure -c "SELECT * FROM lessons;"
```

---

## 运行 API 服务器

```bash
bun run api:example
```

服务器将在 http://localhost:3000 启动。

**测试 API:**
```bash
curl http://localhost:3000/api/lessons
```

---

## 数据库信息

- **数据库名**: gradventure
- **端口**: 5432 (Windows) 或 5433 (macOS Homebrew)
- **默认用户**: postgres (Windows) 或你的系统用户名 (macOS)

### 已创建的表
- `users` - 用户表
- `user_progress` - 用户进度表（等级、经验值、徽章）
- `lessons` - 课程表（3个示例课程）
- `questions` - 问题表（2个示例问题）

---

## 常用命令

### 启动/停止 PostgreSQL

| 平台 | 启动 | 停止 |
|------|------|------|
| **macOS (官方)** | `sudo pg_ctl -D /Library/PostgreSQL/16 start` | `sudo pg_ctl -D /Library/PostgreSQL/16 stop` |
| **macOS (Homebrew)** | `brew services start postgresql@16` | `brew services stop postgresql@16` |
| **Windows** | `net start postgresql-x64-16` | `net stop postgresql-x64-16` |
| **Linux** | `sudo systemctl start postgresql` | `sudo systemctl stop postgresql` |

### 连接数据库

| 平台 | 命令 |
|------|------|
| **macOS / Linux** | `psql -d gradventure` |
| **Windows** | `psql -U postgres -d gradventure` |

### 查看数据

```sql
-- 连接后执行：
\dt                    -- 查看所有表
SELECT * FROM lessons;  -- 查看课程
\q                     -- 退出
```

---

## Bun 脚本

```bash
bun run db:init       # 初始化数据库
bun run api:example   # 启动示例 API
bun run dev           # 启动开发服务器
```

---

## 项目结构

```
ApplicationWeb/
├── src/
│   ├── db/
│   │   ├── db.ts        # 数据库连接
│   │   ├── init.ts      # 初始化脚本
│   │   └── README.md    # 详细文档
│   └── api/
│       └── example.ts   # 示例 API 路由
├── package.json         # 项目配置
└── BACKEND_SETUP.md     # 本文件
```

---

## 下一步建议

1. **查看详细文档**: `src/db/README.md`
2. **参考示例 API**: `src/api/example.ts`
3. **添加用户认证功能**
4. **连接前端与后端**
5. **添加更多游戏化功能**

---

## 故障排除

### PostgreSQL 无法启动

**macOS:**
```bash
# 检查端口占用
lsof -i :5432
lsof -i :5433
```

**Windows:**
打开 `services.msc`，检查 PostgreSQL 服务状态

### 连接失败

检查 `src/db/db.ts` 中的配置是否正确：
- 端口号 (5432 或 5433)
- 用户名 (postgres 或你的用户名)
- 密码 (Windows 需要)

### 权限问题

**macOS / Linux:**
```bash
psql postgres -c "ALTER USER 你的用户名 WITH SUPERUSER;"
```

**Windows:**
postgres 用户默认有超级用户权限

---

## 需要帮助？

详细文档请查看 `src/db/README.md`

**配置完成！🎉**
