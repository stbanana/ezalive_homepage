# AI HANDOFF

## 项目交接说明

- 项目名称：ezalive_homepage
- 技术栈：Next.js 15 (App Router)、Fumadocs UI/MDX、TailwindCSS v4
- 多语言支持：zh / en
- 主要页面：
  - 首页（/zh, /en）
  - 产品中心（/zh/products, /en/products）
  - 产品详情（/zh/products/EZ4000x, /en/products/EZ4000x）
  - 关于我们（/zh/about, /en/about）
  - 联系（/zh/contact, /en/contact）
- 顶部导航：自定义“产品中心”TAB，支持悬停弹出分组与卡片，点击可跳转产品中心页
- 静态导出，支持 GitHub Pages + CNAME 部署
- 设计文档、AI TODO、SESSION_LOG 详见对应文件
- 搜索：Orama + 中文分词（@orama/tokenizers），内容/产品分区展示
- i18n：页面文案字典化收尾完成（locales + 产品数据 + MDX）

## 静态化路由与多语言重要备忘
- 由于项目为纯静态导出（`output: 'export'`），Next.js 的 `i18n` 中间件不可用。
- 我们使用显式 `[locale]` 文件夹架构，并配合 Fumadocs 手动进行语言映射。
- **关于生成静态参数：**
  - 在顶层级 `app/[locale]/layout.tsx` 中**必须**包含：
    ```tsx
    export const dynamicParams = false;
    export function generateStaticParams() {
      return i18n.languages.map((locale) => ({ locale }));
    }
    ```
  - 当有多重动态参数时（例如 `app/[locale]/products/[slug]/page.tsx`），也需要完整声明 `[locale]` 和 `[slug]` 的所有组合以确保 SSG 正确打包。
  - 普通层级的子页面（如 `/about` 或 `/contact`）不需要重复声明 `generateStaticParams` 和 `dynamicParams`，它们可以自动从根部 `layout.tsx` 继承静态参数列表。这避免了代码多余重复。

## 交接建议
- 变更环境/AI时，先读取 AI/HANDOFF.md、AI/TODO.md、AI/SESSION_LOG.md 恢复上下文
- 按照 AI/TODO.md 推进任务
- 设计文档.md 保持与实际实现同步

## 关键难点记录（需外部资料）
- 中文搜索：当时需参考 Orama 官方中文分词文档，确认 `@orama/tokenizers` 的中文支持与最佳实践配置；无该文档时无法独立确认可行方案。


## 组件命名与变量命名约定

- 所有 Carbon Design System 相关主题变量均以 --cds- 前缀命名，禁止硬编码色值。自建组件变量不强制使用 cds- 前缀。
- 仅手动维护 Carbon Design System token，不引入 Carbon 组件和全局 reset。
- 组件 props 类型安全，<button>/<a> 区分，类型严格校验。

## 组件选用与显示效果原则

1. MDX 文件优先使用传统 Markdown 语法实现显示效果（如图片、表格、列表等）。
2. 当 Markdown 语法无法满足需求时，允许插入 TSX 组件（如横排图片、交互式卡片等）。
3. 组件选用优先级：
   - 首选 fumadocs-ui 提供的组件（如 ImageZoom、Tabs、Alert 等）。
   - 其次考虑 Next.js 原生组件（如 next/image、next/link）。
   - 若上述均无法满足需求，再自定义/自构建 React 组件。
4. fumadocs-ui 组件能力与 Next.js 组件能力如有疑问，优先查阅官方文档，或在 AI/HANDOFF.md 中补充简要说明。

> 本原则已纳入 AI/HANDOFF.md，后续仅维护 HANDOFF、TODO、SESSION_LOG 三个文件，不再引入其他 AI 文件。

---

## fumadocs-ui 常用组件简介

- **ImageZoom**：图片点击弹窗预览，适合产品图片展示。
- **Tabs**：标签页切换内容，适合多分类或多语言内容展示。
- **Alert**：信息提示框，适合高亮重要信息。
- **CodeBlock**：代码高亮展示。
- **Callout**：强调内容块。
- **Details**：可折叠内容块。
- **Grid/Card**：部分版本支持，适合卡片式内容展示（需查阅具体导出路径）。

> 详细组件能力请参考：https://www.fumadocs.dev/docs/ui/components

---

## Next.js 原生组件简介

- **next/image**：图片优化与懒加载，支持响应式和弹窗预览（需配合第三方库）。
- **next/link**：路由跳转。
- **next/head**：页面头部 meta 信息。

> 详细组件能力请参考：https://nextjs.org/docs/pages/api-reference/components

---

## Fumadocs UI 组件与用法备查（完整版）

### Accordion
- 内容分组折叠与展开，适合 FAQ、分步说明等。
- 用法：
```mdx
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
<Accordions type="single">
  <Accordion title="My Title">My Content</Accordion>
</Accordions>
```
- 支持 id 跳转、单项/多项展开。

### Auto Type Table
- 自动生成 TypeScript 类型表格，适合 API/类型文档。
- 用法：
```mdx
<auto-type-table name="AutoTypeTableExample" type='export interface ...' />
```
- 需配合 fumadocs-typescript 使用。

### Banner
- 顶部公告、提示。
- 用法：
```tsx
import { Banner } from 'fumadocs-ui/components/banner';
<Banner>Hello World</Banner>
<Banner variant="rainbow">Hello World</Banner>
```
- 支持自定义颜色、布局。

### Files
- 展示文件结构，适合文档、代码结构说明。
- 用法：
```mdx
import { File, Folder, Files } from 'fumadocs-ui/components/files';
<Files>
  <Folder name="app" defaultOpen>
    <File name="layout.tsx" />
    <File name="page.tsx" />
  </Folder>
  <File name="package.json" />
</Files>
```
- 支持嵌套、remark-mdx-files 插件自动转换代码块。

### Inline TOC
- 内联目录组件，适合页面内导航。
- 用法：
```mdx
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
<InlineTOC items={toc}>Table of Contents</InlineTOC>
```

### Steps
- 步骤展示，适合教程、流程说明。
- 用法：
```mdx
import { Step, Steps } from 'fumadocs-ui/components/steps';
<Steps>
  <Step>Step 1</Step>
  <Step>Step 2</Step>
</Steps>
```
- 也可用 Tailwind 类名实现。

### Tabs
- 标签页切换内容，适合多分类或多语言内容展示。
- 用法：
```mdx
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
<Tabs items={['Javascript', 'Rust']}>
  <Tab value="Javascript">Javascript is weird</Tab>
  <Tab value="Rust">Rust is fast</Tab>
</Tabs>
```
- 支持 value 属性、自动索引。

### Type Table
- 类型文档表格，适合 API 参数说明。
- 用法：
```mdx
import { TypeTable } from 'fumadocs-ui/components/type-table';
<TypeTable type={{ ... }} />
```

---
> 以上内容均来自 docs 官方文档，已全面覆盖主要组件用法。后续如需补充其他组件请告知。

---

> 本节为 AI 交互上下文备查，后续如有新组件或用法请及时补充。

## Fumadocs UI 组件索引

Fumadocs UI 提供以下主要组件：
- Accordion
- Auto Type Table
- Banner
- Files
- Zoomable Image
- Inline TOC
- Steps
- Tabs
- Type Table

如需具体用法、属性或示例，请查阅项目内 `fumadocs-ui-docs`获取官方权威说明。

> 设计与开发时建议优先参考本地文档，确保用法与官方一致。
