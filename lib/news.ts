import type { ComponentType } from 'react';
import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import matter from 'gray-matter';

export type Locale = 'zh' | 'en';

export type NewsMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tag: string;
};

type NewsFileEntry = {
  slug: string;
  filePath: string;
};

const NEWS_EXTENSION = '.mdx';

function getNewsDirectory(locale: Locale) {
  return join(process.cwd(), 'content', locale, 'news');
}

async function getNewsEntries(locale: Locale): Promise<NewsFileEntry[]> {
  const dirPath = getNewsDirectory(locale);

  try {
    const dirents = await readdir(dirPath, { withFileTypes: true });

    return dirents
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith(NEWS_EXTENSION))
      .map((dirent) => {
        const slug = basename(dirent.name, NEWS_EXTENSION);

        return {
          slug,
          filePath: join('content', locale, 'news', dirent.name),
        };
      });
  } catch {
    return [];
  }
}

function loadNewsComponent(locale: Locale, slug: string) {
  return import(`@/content/${locale}/news/${slug}.mdx`) as Promise<{ default: ComponentType<any> }>;
}

function asText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export async function getNewsSlugsByLocale(locale: Locale) {
  const entries = await getNewsEntries(locale);
  return entries.map((entry) => entry.slug);
}

export async function getNewsStaticParams(locales: Locale[]) {
  const slugGroups = await Promise.all(
    locales.map(async (locale) => {
      const slugs = await getNewsSlugsByLocale(locale);
      return slugs.map((slug) => ({ locale, slug }));
    }),
  );

  return slugGroups.flat();
}

export async function hasNewsPage(locale: Locale, slug: string) {
  const slugs = await getNewsSlugsByLocale(locale);
  return slugs.includes(slug);
}

export async function getNewsList(locale: Locale): Promise<NewsMeta[]> {
  const entries = await getNewsEntries(locale);

  const news = await Promise.all(
    entries.map(async ({ slug, filePath }) => {
      const source = await readFile(join(process.cwd(), filePath), 'utf-8');
      const { data } = matter(source);

      return {
        slug,
        title: asText(data.title, slug),
        summary: asText(data.summary),
        date: asText(data.date),
        tag: asText(data.tag),
      };
    }),
  );

  return news.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getLatestNews(locale: Locale, limit = 3): Promise<NewsMeta[]> {
  const all = await getNewsList(locale);
  return all.slice(0, limit);
}

export async function loadNewsPage(locale: Locale, slug: string) {
  const entries = await getNewsEntries(locale);
  const entry = entries.find((item) => item.slug === slug);
  if (!entry) return null;

  const source = await readFile(join(process.cwd(), entry.filePath), 'utf-8');
  const { data } = matter(source);
  const Content = (await loadNewsComponent(locale, slug)).default;

  return {
    slug,
    Content,
    meta: {
      title: asText(data.title, slug),
      summary: asText(data.summary),
      date: asText(data.date),
      tag: asText(data.tag),
    } as NewsMeta,
  };
}
