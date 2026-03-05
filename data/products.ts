export type Product = {
  slug: string;
  model: string;
  i18n: {
    zh: {
      name: string;
      summary: string;
      coreSpecs: string[];
    };
    en: {
      name: string;
      summary: string;
      coreSpecs: string[];
    };
  };
};

export type ProductLocale = "zh" | "en";

export const products: Product[] = [
  {
    slug: "ez4000x",
    model: "EZ40004",
    i18n: {
      zh: {
        name: "源载双向交直流源系列",
        summary: "面向电力电子测试的高性能源载双向交直流源平台。",
        coreSpecs: ["300V", "30A", "4kVA", "单相"],
      },
      en: {
        name: "Bidirectional AC/DC Source-Load Series",
        summary:
          "High-performance bidirectional AC/DC source-load platform for power electronics testing.",
        coreSpecs: ["300V", "30A", "4kVA", "Single-phase"],
      },
    },
  },
  {
    slug: "ez4000x",
    model: "EZ40008",
    i18n: {
      zh: {
        name: "源载双向交直流源系列",
        summary: "面向电力电子测试的高性能源载双向交直流源平台。",
        coreSpecs: ["300V", "60A", "8kVA", "单相"],
      },
      en: {
        name: "Bidirectional AC/DC Source-Load Series",
        summary:
          "High-performance bidirectional AC/DC source-load platform for power electronics testing.",
        coreSpecs: ["300V", "60A", "8kVA", "Single-phase"],
      },
    },
  },
  {
    slug: "ez4000x",
    model: "EZ400012",
    i18n: {
      zh: {
        name: "源载双向交直流源系列",
        summary: "面向电力电子测试的高性能源载双向交直流源平台。",
        coreSpecs: ["300V", "90A", "12kVA", "三相"],
      },
      en: {
        name: "Bidirectional AC/DC Source-Load Series",
        summary:
          "High-performance bidirectional AC/DC source-load platform for power electronics testing.",
        coreSpecs: ["300V", "90A", "12kVA", "Three-phase"],
      },
    },
  },
  {
    slug: "ez4000x",
    model: "EZ400024",
    i18n: {
      zh: {
        name: "源载双向交直流源系列",
        summary: "面向电力电子测试的高性能源载双向交直流源平台。",
        coreSpecs: ["300V", "180A", "24kVA", "三相"],
      },
      en: {
        name: "Bidirectional AC/DC Source-Load Series",
        summary:
          "High-performance bidirectional AC/DC source-load platform for power electronics testing.",
        coreSpecs: ["300V", "180A", "24kVA", "Three-phase"],
      },
    },
  },
];

export const HOME_PRODUCT_LIMIT = 3;

export const HOME_PRODUCT_MODEL_PRIORITY: string[] = [
  "EZ400024",
  "EZ400012",
  "EZ40008",
  "EZ40004",
];

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
    coreSpecs: product.i18n[locale].coreSpecs,
  };
}
