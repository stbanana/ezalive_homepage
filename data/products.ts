export type Product = {
  slug: string;
  name: string;
  summary: string;
  model: string;
};

export const products: Product[] = [
  {
    slug: 'ez40004',
    name: 'EZ40004 源载双向交直流源',
    summary: '面向电力电子测试的高性能源载双向交直流源平台。',
    model: 'EZ40004'
  }
];
