import { source } from "@/lib/source";
import { createI18nSearchAPI } from "fumadocs-core/search/server";
import { i18n } from "@/lib/i18n";

export const revalidate = false;

export const { staticGET: GET } = createI18nSearchAPI("advanced", {
  i18n,
  localeMap: {
    en: "english",
    zh: "english",
  },
  indexes: () => {
    return source.getPages().map((page) => {
      const segments = page.url.split("/").filter(Boolean);
      const parsedLocale = segments[0] as "en" | "zh";

      return {
        id: page.url,
        title: page.data.title || "",
        description: page.data.description,
        url: page.url,
        structuredData: (page.data as any).structuredData ?? {
          headings: [],
          contents: [],
        },
        breadcrumbs: [],
        locale: parsedLocale,
      };
    });
  },
});
