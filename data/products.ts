export type Product = {
  slug: string;
  model: string;
  i18n: {
    zh: {
      name: string;
      summary: string;
    };
    en: {
      name: string;
      summary: string;
    };
  };
};

export type ProductLocale = "zh" | "en";

export const products: Product[] = [
  {
    slug: "ez40004",
    model: "EZ40004",
    i18n: {
      zh: {
        name: "EZ40004 源载双向交直流源",
        summary: "面向电力电子测试的高性能源载双向交直流源平台。",
      },
      en: {
        name: "EZ40004 Bidirectional AC/DC Source-Load Platform",
        summary:
          "High-performance bidirectional AC/DC source-load platform for power electronics testing.",
      },
    },
  },
];

export const HOME_PRODUCT_LIMIT = 3;

export const HOME_PRODUCT_MODEL_PRIORITY: string[] = ["EZ40004"];

export function getHomepageProducts(
  limit: number = HOME_PRODUCT_LIMIT,
  priorityModels: string[] = HOME_PRODUCT_MODEL_PRIORITY,
) {
  const priorityOrder = new Map(
    priorityModels.map((model, index) => [model.toUpperCase(), index]),
  );

  return [...products]
    .sort((first, second) => {
      const firstPriority = priorityOrder.get(first.model.toUpperCase());
      const secondPriority = priorityOrder.get(second.model.toUpperCase());

      if (firstPriority !== undefined && secondPriority !== undefined) {
        return firstPriority - secondPriority;
      }

      if (firstPriority !== undefined) {
        return -1;
      }

      if (secondPriority !== undefined) {
        return 1;
      }

      return first.model.localeCompare(second.model);
    })
    .slice(0, limit);
}

export function getLocalizedProduct(product: Product, locale: ProductLocale) {
  return {
    ...product,
    name: product.i18n[locale].name,
    summary: product.i18n[locale].summary,
  };
}
