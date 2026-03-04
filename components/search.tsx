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

type SearchLink = [name: string, href: string];
interface TagItem {
    name: string;
    value: string;
}

type SearchItemWithSnippet = SearchItemType & {
    __snippet?: string;
    __snippetHighlights?: HighlightedText<string>[];
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

    return (
        <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
            <SearchDialogOverlay />
            <SearchDialogContent>
                <SearchDialogHeader>
                    <SearchDialogIcon />
                    <SearchDialogInput />
                    <SearchDialogClose />
                </SearchDialogHeader>
                <SearchDialogList
                    items={listItems}
                    Item={({ item, onClick }) => {
                        if (item.type === 'action') {
                            return <SearchDialogListItem item={item} onClick={onClick} />;
                        }

                        const itemWithSnippet = item as SearchItemWithSnippet;
                        const hasSnippet = Boolean(itemWithSnippet.__snippetHighlights?.length);
                        const hasBreadcrumbs = Boolean(item.breadcrumbs && item.breadcrumbs.length > 0);
                        const padClass = item.type !== 'page' ? 'ps-4' : '';

                        return (
                            <SearchDialogListItem item={item} onClick={onClick}>
                                <div className="min-w-0">
                                    {hasBreadcrumbs && (
                                        <div className="inline-flex items-center text-fd-muted-foreground text-xs">
                                            {item.breadcrumbs?.map((breadcrumb, index) => (
                                                <span key={index} className="inline-flex items-center">
                                                    {index > 0 && <span className="px-1 text-fd-border">/</span>}
                                                    {breadcrumb}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className={`min-w-0 truncate ${padClass} ${item.type === 'page' || item.type === 'heading' ? 'font-medium' : 'text-fd-popover-foreground/80'}`}>
                                        {item.contentWithHighlights
                                            ? renderHighlights(item.contentWithHighlights)
                                            : item.content}
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
