import { source } from "@/lib/source";
import { createI18nSearchAPI } from "fumadocs-core/search/server";
import { i18n } from "@/lib/i18n";
import { createTokenizer } from "@orama/tokenizers/mandarin";

export const revalidate = false;

export const { staticGET: GET } = createI18nSearchAPI("advanced", {
  i18n,
  localeMap: {
    en: "english",
    zh: {
      tokenizer: createTokenizer(),
    },
  },
  indexes: async () => {
    return Promise.all(
      source.getPages().map(async (page) => {
        const segments = page.url.split("/").filter(Boolean);
        const parsedLocale = segments[0] as "en" | "zh";
        const loaded =
          typeof (page.data as any).load === "function"
            ? await (page.data as any).load()
            : page.data;

        return {
          id: page.url,
          title: page.data.title || "",
          description: page.data.description,
          url: page.url,
          structuredData: (loaded as any).structuredData ?? {
            headings: [],
            contents: [],
          },
          breadcrumbs: [],
          locale: parsedLocale,
        };
      }),
    );
  },
});
