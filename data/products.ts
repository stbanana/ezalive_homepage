export type Product = {
  slug: string;
  model: string;
  category: ProductCategory;
  series: ProductSeries;
  i18n: {
    zh: {
      summary: string;
      coreSpecs: string[];
      communicationInterfaces: string[];
      communicationProtocols: string[];
    };
    en: {
      summary: string;
      coreSpecs: string[];
      communicationInterfaces: string[];
      communicationProtocols: string[];
    };
  };
};

export type ProductLocale = "zh" | "en";
export type ProductCategory = 'acdc' | 'ac' | 'dc';
export type ProductSeries =
  | 'bidirectional-acdc-source-load'
  | 'acdc-source'
  | 'acdc-load';

export const PRODUCT_SERIES_LABELS: Record<ProductSeries, Record<ProductLocale, string>> = {
  'bidirectional-acdc-source-load': {
    zh: '源载双向交直流源系列',
    en: 'Bidirectional AC/DC Source-Load Series',
  },
  'acdc-source': {
    zh: '交直流源系列',
    en: 'AC/DC Source Series',
  },
  'acdc-load': {
    zh: '交直流载系列',
    en: 'AC/DC Load Series',
  },
};

export const products: Product[] = [
  {
    slug: "EZ4000x",
    model: "EZ40004",
    category: 'acdc',
    series: 'bidirectional-acdc-source-load',
    i18n: {
      zh: {
        summary: "面向电力电子测试的高性能源载双向交直流源平台。",
        coreSpecs: ["300V", "30A", "4kVA", "单相"],
        communicationInterfaces: ["LAN", "CAN", "RS485", "RS232"],
        communicationProtocols: ["SCPI", "Modbus"],
      },
      en: {
        summary:
          "High-performance bidirectional AC/DC source-load platform for power electronics testing.",
        coreSpecs: ["300V", "30A", "4kVA", "Single-phase"],
        communicationInterfaces: ["LAN", "CAN", "RS485", "RS232"],
        communicationProtocols: ["SCPI", "Modbus"],
      },
    },
  },
  {
    slug: "EZ4000x",
    model: "EZ40008",
    category: 'acdc',
    series: 'bidirectional-acdc-source-load',
    i18n: {
      zh: {
        summary: "面向电力电子测试的高性能源载双向交直流源平台。",
        coreSpecs: ["300V", "60A", "8kVA", "单相"],
        communicationInterfaces: ["LAN", "CAN", "RS485", "RS232"],
        communicationProtocols: ["SCPI", "Modbus"],
      },
      en: {
        summary:
          "High-performance bidirectional AC/DC source-load platform for power electronics testing.",
        coreSpecs: ["300V", "60A", "8kVA", "Single-phase"],
        communicationInterfaces: ["LAN", "CAN", "RS485", "RS232"],
        communicationProtocols: ["SCPI", "Modbus"],
      },
    },
  },
  {
    slug: "EZ4000x",
    model: "EZ400012",
    category: 'acdc',
    series: 'bidirectional-acdc-source-load',
    i18n: {
      zh: {
        summary: "面向电力电子测试的高性能源载双向交直流源平台。",
        coreSpecs: ["300V", "90A", "12kVA", "三相"],
        communicationInterfaces: ["LAN", "CAN", "RS485", "RS232"],
        communicationProtocols: ["SCPI", "Modbus"],
      },
      en: {
        summary:
          "High-performance bidirectional AC/DC source-load platform for power electronics testing.",
        coreSpecs: ["300V", "90A", "12kVA", "Three-phase"],
        communicationInterfaces: ["LAN", "CAN", "RS485", "RS232"],
        communicationProtocols: ["SCPI", "Modbus"],
      },
    },
  },
  {
    slug: "EZ4000x",
    model: "EZ400024",
    category: 'acdc',
    series: 'bidirectional-acdc-source-load',
    i18n: {
      zh: {
        summary: "面向电力电子测试的高性能源载双向交直流源平台。",
        coreSpecs: ["300V", "180A", "24kVA", "三相"],
        communicationInterfaces: ["LAN", "CAN", "RS485", "RS232"],
        communicationProtocols: ["SCPI", "Modbus"],
      },
      en: {
        summary:
          "High-performance bidirectional AC/DC source-load platform for power electronics testing.",
        coreSpecs: ["300V", "180A", "24kVA", "Three-phase"],
        communicationInterfaces: ["LAN", "CAN", "RS485", "RS232"],
        communicationProtocols: ["SCPI", "Modbus"],
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
    series: PRODUCT_SERIES_LABELS[product.series][locale],
    summary: product.i18n[locale].summary,
    coreSpecs: product.i18n[locale].coreSpecs,
    communicationInterfaces: product.i18n[locale].communicationInterfaces,
    communicationProtocols: product.i18n[locale].communicationProtocols,
  };
}
