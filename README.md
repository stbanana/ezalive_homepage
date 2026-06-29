# EZALIVE 公司门户项目 README

## 1. 环境搭建先决条件
- Node.js >= 18.x
- 推荐包管理工具：npm
- 建议使用 VS Code 编辑器
- 安装依赖：
  ```bash
  npm install
  ```

## 2. 启动项目指令
- 开发环境启动：
  ```bash
  npm run dev
  ```
- 本地预览静态导出：
  ```bash
  npx serve out
  ```

## 3. 项目开发常用指令
- 构建项目：
  ```bash
  npm run build
  ```
- 生成 MDX 相关内容（如有）：
  ```bash
  npm run postinstall
  ```

## 4. 发布与推送
- 静态导出并推送到 GitHub Pages：
  ```bash
  npm run deploy
  ```
- 发布前请确保 out 目录下有 .nojekyll 文件（自动生成或手动添加）。
- 推送后访问自定义域名或 GitHub Pages 地址。

---
> 如有更多问题请查阅 CLAUDE.md 或设计文档.md。
