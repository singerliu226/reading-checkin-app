# Zeabur部署指南

## 🚀 快速部署

### 1. 准备工作

在部署之前，确保您有以下信息：
- Supabase项目URL
- Supabase匿名密钥

### 2. 环境变量设置

在Zeabur控制面板中设置以下环境变量：

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

### 3. 部署步骤

#### 方法一：GitHub集成部署（推荐）
1. 将代码推送到GitHub仓库
2. 在Zeabur控制面板创建新项目
3. 连接GitHub仓库
4. 设置环境变量
5. 点击部署

#### 方法二：本地CLI部署
1. 安装Zeabur CLI
   ```bash
   npm install -g zeabur
   ```
2. 登录Zeabur
   ```bash
   zeabur auth login
   ```
3. 部署项目
   ```bash
   zeabur deploy
   ```

### 4. 构建配置

项目已经配置了以下优化：
- 输出目录：`dist`
- 构建命令：`npm run build`
- 预览命令：`npm run start`
- SPA路由支持

### 5. 域名配置

部署成功后，Zeabur会自动分配一个域名。您也可以：
- 绑定自定义域名
- 配置SSL证书
- 设置CDN加速

### 6. 故障排除

#### 常见问题：
1. **构建失败**
   - 检查Node.js版本是否为18+
   - 确认所有依赖项已正确安装
   - 检查TypeScript编译错误

2. **环境变量问题**
   - 确保所有必需的环境变量已设置
   - 检查变量名称是否正确（以VITE_开头）

3. **路由问题**
   - 确保SPA配置正确
   - 检查fallback路径设置

### 7. 性能优化建议

1. **启用CDN**：在Zeabur控制面板中启用CDN加速
2. **压缩优化**：项目已配置Terser压缩
3. **代码分割**：已配置vendor和ui代码分割
4. **缓存策略**：利用Zeabur的缓存功能

### 8. 监控和日志

- 在Zeabur控制面板查看部署日志
- 监控应用性能指标
- 设置错误告警

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📞 获取帮助

如果遇到部署问题，请：
1. 查看Zeabur官方文档
2. 检查项目构建日志
3. 联系技术支持

---
⚡ 由Zeabur强力驱动 