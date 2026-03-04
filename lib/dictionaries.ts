import type { Dictionary } from "@/locales/zh";

const dictionaries = {
  en: () => import("@/locales/en").then((module) => module.en),
  zh: () => import("@/locales/zh").then((module) => module.zh),
};

export const getDictionary = async (
  locale: "en" | "zh",
): Promise<Dictionary> => {
  return dictionaries[locale]();
};
