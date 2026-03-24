# Authentication System - Gradventure

Gradventure 用户认证系统文档

## 🎯 功能概述

完整的用户认证系统，基于西交利物浦大学（XJTLU）邮箱进行用户注册和认证。

### 核心功能
- ✅ XJTLU 邮箱验证（仅限 `@student.xjtlu.edu.cn` 和 `@xjtlu.edu.cn`）
- ✅ 密码加密存储（bcrypt）
- ✅ JWT token 认证
- ✅ 用户注册/登录
- ✅ 密码修改
- ✅ 受保护的路由中间件

## 🔐 安全特性

### 邮箱验证
只允许西交利物浦大学邮箱注册：
- 学生邮箱: `@student.xjtlu.edu.cn`
- 教职工邮箱: `@xjtlu.edu.cn`

### 密码要求
- 最少 8 个字符
- 至少 1 个大写字母
- 至少 1 个小写字母
- 至少 1 个数字

### JWT Token
- 7 天有效期
- 包含用户 ID、邮箱、用户名
- 每次请求都需要在 Authorization 头中携带

## 📁 文件结构

```
src/
├── utils/
│   └── auth.ts              # 认证工具函数
├── middleware/
│   └── auth.ts              # 认证中间件
├── api/
│   └── auth.ts              # 认证 API 路由
├── server.ts                # 主服务器文件
└── auth/
    └── README.md            # 本文档
```

## 🚀 API 端点

### 公开端点

#### POST /api/auth/register
注册新用户

**请求体:**
```json
{
  "username": "student123",
  "email": "student123@student.xjtlu.edu.cn",
  "password": "Password123"
}
```

**响应 (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "student123",
      "email": "student123@student.xjtlu.edu.cn",
      "studentId": "student123",
      "createdAt": "2025-01-18T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应 (400):**
```json
{
  "success": false,
  "error": "Must use a valid XJTLU email address (@student.xjtlu.edu.cn or @xjtlu.edu.cn)"
}
```

#### POST /api/auth/login
用户登录

**请求体:**
```json
{
  "email": "student123@student.xjtlu.edu.cn",
  "password": "Password123"
}
```

**响应 (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "student123",
      "email": "student123@student.xjtlu.edu.cn",
      "studentId": "student123"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应 (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

### 受保护端点

这些端点需要在请求头中携带 JWT token：

```
Authorization: Bearer <your-jwt-token>
```

#### GET /api/auth/me
获取当前用户信息

**请求头:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应 (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "student123",
      "email": "student123@student.xjtlu.edu.cn",
      "studentId": "student123",
      "createdAt": "2025-01-18T10:00:00.000Z"
    },
    "progress": {
      "level": 1,
      "experience_points": 0,
      "completed_lessons": [],
      "badges": []
    }
  }
}
```

#### PUT /api/auth/password
修改密码

**请求头:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**请求体:**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

**响应 (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## 🧪 测试示例

### 1. 注册新用户
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@student.xjtlu.edu.cn",
    "password": "Password123"
  }'
```

### 2. 登录
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@student.xjtlu.edu.cn",
    "password": "Password123"
  }'
```

### 3. 获取当前用户信息（需要 token）
```bash
# 先从登录响应中复制 token
TOKEN="your-jwt-token-here"

curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 4. 修改密码（需要 token）
```bash
curl -X PUT http://localhost:3000/api/auth/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Password123",
    "newPassword": "NewPassword456"
  }'
```

### 5. 健康检查
```bash
curl http://localhost:3000/health
```

## ⚙️ 环境配置

创建 `.env` 文件（参考 `.env.example`）：

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_NAME=gradventure
DB_USER=dopamine
DB_PASSWORD=

# JWT Secret (生产环境必须修改！)
JWT_SECRET=your-super-secret-key-at-least-32-characters-long

# Server
PORT=3000
NODE_ENV=development
```

## 🔧 启动服务器

```bash
# 开发模式（热重载）
bun run api:dev

# 生产模式
bun run server
```

服务器将在 `http://localhost:3000` 启动。

## 📊 错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证（token 无效或过期） |
| 403 | 禁止访问（权限不足） |
| 404 | 资源不存在 |
| 409 | 资源冲突（邮箱或用户名已存在） |
| 500 | 服务器内部错误 |

## 🔒 安全建议

1. **生产环境必须修改 JWT_SECRET**
   - 使用至少 32 个字符的随机字符串
   - 定期轮换密钥

2. **使用 HTTPS**
   - 生产环境必须使用 HTTPS
   - 防止 token 被窃取

3. **Token 存储**
   - 前端使用 httpOnly cookie 存储 token
   - 或使用安全的 localStorage 配合 XSS 防护

4. **密码重置**
   - 考虑添加邮件验证的密码重置功能
   - 避免通过不安全的方式重置密码

5. **速率限制**
   - 添加登录尝试限制
   - 防止暴力破解

## 🎨 前端集成示例

```typescript
// 注册
const register = async (username: string, email: string, password: string) => {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (data.success) {
    // 保存 token
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }

  return data;
};

// 获取当前用户
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};
```

## 📚 下一步

1. **添加邮件验证**
   - 注册时发送验证邮件
   - 确认邮箱所有权

2. **添加刷新 token**
   - 实现 access token 和 refresh token 机制
   - 提升用户体验和安全性

3. **添加 OAuth**
   - 支持第三方登录（如 Google、GitHub）

4. **添加双因素认证**
   - 增强账户安全性

5. **添加用户角色**
   - 管理员、教师、学生等不同角色
   - 基于角色的访问控制

## 🐛 故障排除

### Token 无效
- 检查 token 是否正确设置在 Authorization 头中
- 确认 token 未过期（7 天有效期）
- 验证 JWT_SECRET 是否正确

### 邮箱验证失败
- 确保使用 XJTLU 邮箱
- 检查邮箱域名拼写

### 密码不符合要求
- 至少 8 个字符
- 包含大小写字母和数字

### 数据库连接失败
- 确认 PostgreSQL 服务正在运行
- 检查数据库配置是否正确

---

**认证系统已完成！🎉**
