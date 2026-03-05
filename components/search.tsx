'use client';

import {
    SearchDialog,
    SearchDialogClose,
    SearchDialogContent,
    SearchDialogFooter,
    SearchDialogHeader,
    SearchDialogIcon,
    SearchDialogInput,
    SearchDialogList,
    SearchDialogListItem,
    SearchDialogOverlay,
    TagsList,
    TagsListItem,
    type SearchItemType,
    type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { createContentHighlighter, type HighlightedText } from 'fumadocs-core/search';
import { create } from '@orama/orama';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import { useCallback, useMemo, useState, ReactNode } from 'react';
import { getLocalizedProduct, products, type ProductLocale } from '@/data/products';

type SearchLink = [name: string, href: string];
interface TagItem {
    name: string;
    value: string;
}

type SearchItemWithSnippet = SearchItemType & {
    __snippet?: string;
    __snippetHighlights?: HighlightedText<string>[];
};

type GroupedSearchItem = {
    type: 'group';
    id: string;
    url: string;
    title: string;
    description?: string;
    entries: SearchItemWithSnippet[];
};

function escapeRegExp(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildQueryRegex(query: string): RegExp | null {
    const terms = query
        .split(/\s+/)
        .map((term) => term.trim())
        .filter(Boolean)
        .sort((first, second) => second.length - first.length);

    if (terms.length === 0) return null;
    return new RegExp(terms.map(escapeRegExp).join('|'), 'gi');
}

function buildSnippet(content: string, queryRegex: RegExp | null, maxLength = 80): string | undefined {
    if (!content) return undefined;

    const fallback = content.length > maxLength ? `${content.slice(0, maxLength)}…` : content;
    if (!queryRegex) return fallback;

    queryRegex.lastIndex = 0;
    const match = queryRegex.exec(content);
    if (!match) return fallback;

    const matchLength = match[0]?.length ?? 0;
    const halfWindow = Math.max(0, Math.floor((maxLength - matchLength) / 2));

    let start = Math.max(0, match.index - halfWindow);
    let end = Math.min(content.length, start + maxLength);

    if (end - start < maxLength) {
        start = Math.max(0, end - maxLength);
    }

    let snippet = content.slice(start, end).trim();
    if (start > 0) snippet = `…${snippet}`;
    if (end < content.length) snippet = `${snippet}…`;

    return snippet;
}

function renderHighlights(highlights?: HighlightedText<ReactNode>[]): ReactNode {
    if (!highlights) return null;

    return highlights.map((node, index) => {
        if (node.styles?.highlight) {
            return (
                <span key={index} className="text-fd-primary underline">
                    {node.content}
                </span>
            );
        }

        return <span key={index}>{node.content}</span>;
    });
}

function normalizeSearchValue(input: string): string {
    return input.toLowerCase().replace(/\s+/g, '');
}

function matchesKeyword(query: string, keyword: string): boolean {
    const normalizedQuery = normalizeSearchValue(query);
    const normalizedKeyword = normalizeSearchValue(keyword);

    if (!normalizedQuery || !normalizedKeyword) return false;
    if (normalizedQuery.length < 2) return false;

    return (
        normalizedKeyword.includes(normalizedQuery) ||
        normalizedQuery.includes(normalizedKeyword)
    );
}

function normalizeContent(input: string): string {
    return input.toLowerCase().replace(/\s+/g, '');
}

function normalizeUrl(input: string): string {
    const hashIndex = input.indexOf('#');
    return hashIndex >= 0 ? input.slice(0, hashIndex) : input;
}

export interface CustomSearchDialogProps extends SharedProps {
    links?: SearchLink[];
    type?: 'fetch' | 'static';
    defaultTag?: string;
    tags?: TagItem[];
    api?: string;
    delayMs?: number;
    footer?: ReactNode;
    allowClear?: boolean;
}

export default function CustomSearchDialog({
    defaultTag,
    tags = [],
    api,
    delayMs,
    type = 'static',
    allowClear = false,
    links = [],
    footer,
    ...props
}: CustomSearchDialogProps) {
    const { locale } = useI18n();
    const [tag, setTag] = useState(defaultTag);
    const currentLocale: ProductLocale = locale === 'en' ? 'en' : 'zh';

    // Memoize the initialization function to avoid re-renders
    const initOrama = useCallback((initLocale?: string) => {
        return create({
            schema: { _: 'string' },
            language: initLocale === 'zh' ? undefined : 'english',
            components: {
                tokenizer: initLocale === 'zh' ? createTokenizer() : undefined,
            },
        });
    }, []);

    const { search, setSearch, query } = useDocsSearch({
        type: 'static',
        initOrama,
        locale,
        tag,
        delayMs,
        from: api,
    });

    const defaultItems = useMemo(() => {
        if (links.length === 0) return null;
        return links.map(([name, link]) => ({
            type: 'page' as const,
            id: name,
            content: name,
            url: link,
        }));
    }, [links]);

    const localizedProducts = useMemo(
        () => products.map((product) => getLocalizedProduct(product, currentLocale)),
        [currentLocale],
    );

    const matchedProduct = useMemo(() => {
        const trimmedSearch = search.trim();
        if (!trimmedSearch) return null;

        return (
            localizedProducts.find((product) => {
                const keywords = [
                    product.model,
                    product.name,
                    product.summary,
                    product.slug,
                    ...(product.coreSpecs ?? []),
                ];

                return keywords.some((keyword) => matchesKeyword(trimmedSearch, keyword));
            }) || null
        );
    }, [localizedProducts, search]);

    const listItems = useMemo(() => {
        const rawItems = query.data !== 'empty' ? query.data : defaultItems;
        if (!Array.isArray(rawItems)) return rawItems;

        const queryRegex = buildQueryRegex(search);
        const highlighter = queryRegex ? createContentHighlighter(queryRegex) : null;

        return rawItems.map((item) => {
            if (item.type === 'action' || item.type !== 'text') return item;

            const rawContent = typeof item.content === 'string' ? item.content : '';
            const snippet = buildSnippet(rawContent, queryRegex);
            if (!snippet) return item;

            return {
                ...item,
                __snippet: snippet,
                __snippetHighlights: highlighter?.highlight(snippet),
            } as SearchItemWithSnippet;
        });
    }, [defaultItems, query.data, search]);

    const filteredItems = useMemo(() => {
        if (!Array.isArray(listItems)) return listItems;

        const perUrlCount = new Map<string, number>();
        const perUrlContent = new Map<string, Set<string>>();
        const maxPerUrl = 2;

        return listItems.filter((item) => {
            if (item.type === 'action') return true;

            const url = 'url' in item ? normalizeUrl(item.url) : undefined;
            if (!url) return true;

            const isPrimary = item.type === 'page' || item.type === 'heading';
            if (isPrimary) return true;

            const currentCount = perUrlCount.get(url) ?? 0;
            if (currentCount >= maxPerUrl) return false;

            const content = typeof item.content === 'string' ? item.content : '';
            const normalized = normalizeContent(content);
            if (normalized) {
                const existing = perUrlContent.get(url) ?? new Set<string>();
                if (existing.has(normalized)) return false;
                existing.add(normalized);
                perUrlContent.set(url, existing);
            }

            perUrlCount.set(url, currentCount + 1);
            return true;
        });
    }, [listItems, matchedProduct, locale]);

    const groupedItems = useMemo(() => {
        if (!Array.isArray(filteredItems)) return filteredItems;

        const actions: SearchItemType[] = [];
        const groups = new Map<string, SearchItemWithSnippet[]>();
        const order: string[] = [];

        for (const item of filteredItems) {
            if (item.type === 'action') {
                actions.push(item);
                continue;
            }

            const rawUrl = 'url' in item ? item.url : undefined;
            if (!rawUrl) {
                actions.push(item);
                continue;
            }

            const baseUrl = normalizeUrl(rawUrl);
            if (!groups.has(baseUrl)) {
                groups.set(baseUrl, []);
                order.push(baseUrl);
            }

            groups.get(baseUrl)?.push({
                ...(item as SearchItemWithSnippet),
                url: rawUrl,
            });
        }

        const result: Array<SearchItemType | GroupedSearchItem> = [...actions];

        for (const url of order) {
            const items = groups.get(url) ?? [];
            const pageItem = items.find((entry) => entry.type === 'page') ?? items[0];
            const title =
                typeof pageItem?.content === 'string'
                    ? pageItem.content
                    : (pageItem as any)?.title ?? url;
            const description =
                (pageItem as any)?.description ??
                (pageItem as SearchItemWithSnippet)?.__snippet;
            const entries = items.filter((entry) => entry !== pageItem).slice(0, 2);

            result.push({
                type: 'group',
                id: `group:${url}`,
                url,
                title,
                description,
                entries,
            });
        }

        return result;
    }, [filteredItems]);

    const hasContentMatches = Array.isArray(groupedItems)
        && groupedItems.some((item) => (item as GroupedSearchItem).type === 'group');

    return (
        <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
            <SearchDialogOverlay />
            <SearchDialogContent>
                <SearchDialogHeader>
                    <SearchDialogIcon />
                    <SearchDialogInput />
                    <SearchDialogClose />
                </SearchDialogHeader>
                {matchedProduct && (
                    <div className="px-4 pb-3">
                        <div className="mb-2 text-xs font-semibold text-fd-muted-foreground">
                            {locale === 'zh' ? '产品匹配' : 'Product match'}
                        </div>
                        <a
                            className="block rounded-xl border border-fd-primary/40 bg-fd-card/90 px-4 py-3 shadow-sm transition-all hover:border-fd-primary"
                            href={`/${locale}/products/${matchedProduct.slug}`}
                        >
                            <div className="text-sm font-bold text-fd-primary mb-1">
                                {matchedProduct.model}
                            </div>
                            <div className="text-xs text-fd-muted-foreground">
                                {matchedProduct.name}
                            </div>
                            <div className="mt-1 text-[11px] text-fd-muted-foreground">
                                {locale === 'zh' ? '核心参数' : 'Core Specs'}: {matchedProduct.coreSpecs.join(' · ')}
                            </div>
                        </a>
                    </div>
                )}
                {hasContentMatches && (
                    <div className="px-4 pb-2 text-xs font-semibold text-fd-muted-foreground">
                        {locale === 'zh' ? '内容匹配' : 'Content match'}
                    </div>
                )}
                <SearchDialogList
                    items={groupedItems as SearchItemType[]}
                    Item={({ item, onClick }) => {
                        const typedItem = item as SearchItemType | GroupedSearchItem;
                        if (typedItem.type === 'group') {
                            return (
                                <div className="px-2.5 py-2">
                                    <div className="rounded-xl border border-fd-border/60 shadow-sm bg-fd-popover/70 p-2">
                                        <a
                                            className="block rounded-lg bg-fd-card/80 px-3 py-2 transition hover:border-fd-primary"
                                            href={typedItem.url}
                                            onClick={onClick}
                                        >
                                            <div className="text-sm font-semibold text-fd-foreground">
                                                {typedItem.title}
                                            </div>
                                            {typedItem.description && (
                                                <div className="mt-1 text-xs text-fd-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                                                    {typedItem.description}
                                                </div>
                                            )}
                                        </a>
                                        {typedItem.entries.length > 0 && (
                                            <div className="mt-2 space-y-1 pl-4">
                                                {typedItem.entries.map((entry, index) => {
                                                    const entryUrl = 'url' in entry ? entry.url : typedItem.url;
                                                    const entryHasSnippet = Boolean(entry.__snippetHighlights?.length);

                                                    return (
                                                        <a
                                                            key={entry.id ?? `${typedItem.id}-${index}`}
                                                            href={entryUrl}
                                                            onClick={onClick}
                                                            className="block rounded-md px-2 py-2 text-sm transition hover:bg-fd-accent/60"
                                                        >
                                                            <p className="min-w-0 truncate text-fd-popover-foreground/80">
                                                                {entry.contentWithHighlights
                                                                    ? renderHighlights(entry.contentWithHighlights)
                                                                    : entry.content}
                                                            </p>
                                                            {entryHasSnippet && (
                                                                <p className="mt-1 text-xs text-fd-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                                                                    {renderHighlights(entry.__snippetHighlights as HighlightedText<ReactNode>[])}
                                                                </p>
                                                            )}
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        if (typedItem.type === 'action') {
                            return <SearchDialogListItem item={typedItem} onClick={onClick} />;
                        }

                        const itemWithSnippet = typedItem as SearchItemWithSnippet;
                        const hasSnippet = Boolean(itemWithSnippet.__snippetHighlights?.length);
                        const hasBreadcrumbs = Boolean(typedItem.breadcrumbs && typedItem.breadcrumbs.length > 0);
                        const padClass = typedItem.type !== 'page' ? 'ps-4' : '';

                        return (
                            <SearchDialogListItem item={typedItem} onClick={onClick}>
                                <div className="min-w-0">
                                    {hasBreadcrumbs && (
                                        <div className="inline-flex items-center text-fd-muted-foreground text-xs">
                                            {typedItem.breadcrumbs?.map((breadcrumb, index) => (
                                                <span key={index} className="inline-flex items-center">
                                                    {index > 0 && <span className="px-1 text-fd-border">/</span>}
                                                    {breadcrumb}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className={`min-w-0 truncate ${padClass} ${typedItem.type === 'page' || typedItem.type === 'heading' ? 'font-medium' : 'text-fd-popover-foreground/80'}`}>
                                        {typedItem.contentWithHighlights
                                            ? renderHighlights(typedItem.contentWithHighlights)
                                            : typedItem.content}
                                    </p>
                                    {hasSnippet && (
                                        <p className={`${padClass} mt-1 text-xs text-fd-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden`}>
                                            {renderHighlights(itemWithSnippet.__snippetHighlights as HighlightedText<ReactNode>[])}
                                        </p>
                                    )}
                                </div>
                            </SearchDialogListItem>
                        );
                    }}
                />
            </SearchDialogContent>
            <SearchDialogFooter>
                {tags.length > 0 && (
                    <TagsList tag={tag} onTagChange={setTag} allowClear={allowClear}>
                        {tags.map((t) => (
                            <TagsListItem key={t.value} value={t.value}>
                                {t.name}
                            </TagsListItem>
                        ))}
                    </TagsList>
                )}
                {footer}
            </SearchDialogFooter>
        </SearchDialog>
    );
}
