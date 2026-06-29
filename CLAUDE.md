# CLAUDE.md — ezalive_homepage

## 项目概述

EZALIVE 公司门户静态站点。多语言（zh/en），静态导出，部署到 GitHub Pages（CNAME 自定义域名）。

## 技术栈

- **Next.js 16** App Router + Turbopack，`output: 'export'`（纯静态，无服务端中间件）
- **Fumadocs UI / MDX**：页面框架、MDX 渲染、组件库
- **TailwindCSS v4**：样式系统（Fumadocs 主题集成）
- **Orama**：站内搜索，含中文分词（`@orama/tokenizers`）
- **Carbon Design System**：仅手动维护配色/字体 token，**不引入** Carbon 组件和全局 reset

## 目录结构要点

```
app/[locale]/          # 多语言路由（zh/en）
content/{locale}/      # MDX 内容（home、products、news）
data/products.ts       # 产品数据（含枚举与映射）
locales/               # i18n 文案字典
components/            # 自定义组件
```

## 多语言 / 静态路由规范

- `output: 'export'` 下不可用 Next.js `i18n` 中间件，改用显式 `[locale]` 文件夹
- `app/[locale]/layout.tsx` **必须**包含：
  ```tsx
  export const dynamicParams = false;
  export function generateStaticParams() {
    return i18n.languages.map((locale) => ({ locale }));
  }
  ```
- 多重动态参数页面（如 `[locale]/products/[slug]`）需完整声明所有 locale × slug 组合
- 普通子页面（`/about`、`/contact`）无需重复声明，自动继承根 layout 参数

## 产品数据模型

文件：`data/products.ts`

| 字段 | 说明 |
|------|------|
| `model` | 型号主标识（主键，URL slug） |
| `series` | `ProductSeries` 枚举值（有限集合） |
| `category` | `'acdc' \| 'ac' \| 'dc'` |
| `coreSpecs` | 核心规格 |
| `communicationInterfaces` | 通信接口列表 |
| `communicationProtocols` | 通信协议列表 |

- `PRODUCT_SERIES_LABELS`：`ProductSeries` 到 zh/en 文案的统一映射
- 新增产品时只需选择已有枚举键；新增系列时同步更新枚举与映射

## 导航 / 菜单结构

- 顶部导航"产品中心"：`type: 'custom'` + `ProductMenuNav` 组件
- 悬停弹出菜单层级：`category` → `series` → `model` 卡片
- 响应式：桌面悬停下拉；移动端点击内联展开
- 下拉面板防溢出定位（窄视口下夹紧右边界）

## 组件规范

- Carbon 主题变量统一 `--cds-` 前缀，**禁止硬编码色值**
- 自建组件变量不强制 `cds-` 前缀
- `<button>` / `<a>` 严格区分，props 类型安全（参考 `CdsButton` 实现）
- `CdsButton`：多变体、圆角自定义、全变量化，已通过构建

## MDX 内容规范

1. 优先使用标准 Markdown 语法
2. 需要特殊布局时插入 TSX 组件
3. 组件优先级：fumadocs-ui 组件 → next/image、next/link → 自定义组件
4. 常用 fumadocs-ui 组件：`ImageZoom`、`Tabs`、`Accordion`、`Steps`、`Alert`、`Files`

## 已知问题 / 注意事项

- `npm run build` 可通过；存在 Turbopack NFT tracing 警告（`next.config.mjs → lib/news.ts` 链路），不影响功能
- 中文搜索依赖 `@orama/tokenizers`，最佳实践配置需参考 Orama 官方文档

## 常用指令

```bash
npm run dev        # 开发服务器
npm run build      # 构建静态导出
npx serve out      # 本地预览静态产物
npm run deploy     # 构建并推送到 GitHub Pages
```
