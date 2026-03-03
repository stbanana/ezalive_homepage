/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./mdx-components.tsx",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // 直接映射到 Carbon Design System 的 CSS 变量
        'fd-primary': 'var(--cds-interactive-primary)',
        'fd-primary-foreground': 'var(--cds-text-on-color)',
        'fd-border': 'var(--cds-border-subtle)',
        'fd-background': 'var(--cds-background)',
        'fd-card': 'var(--cds-layer)',
        'fd-foreground': 'var(--cds-text-primary)',
        'fd-muted-foreground': 'var(--cds-text-secondary)',
        // 语义色彩
        'fd-success': 'var(--cds-support-success)',
        'fd-warning': 'var(--cds-support-warning)',
        'fd-error': 'var(--cds-support-error)',
        'fd-info': 'var(--cds-support-info)',
      }
    }
  },
  plugins: []
};