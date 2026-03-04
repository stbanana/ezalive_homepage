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
    SearchDialogOverlay,
    TagsList,
    TagsListItem,
    type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { create } from '@orama/orama';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import { useCallback, useMemo, useState, ReactNode } from 'react';

type SearchLink = [name: string, href: string];
interface TagItem {
    name: string;
    value: string;
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

    return (
        <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
            <SearchDialogOverlay />
            <SearchDialogContent>
                <SearchDialogHeader>
                    <SearchDialogIcon />
                    <SearchDialogInput />
                    <SearchDialogClose />
                </SearchDialogHeader>
                <SearchDialogList items={query.data !== 'empty' ? query.data : defaultItems} />
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
