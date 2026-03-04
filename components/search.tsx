'use client';

import {
    SearchDialog,
    SearchDialogClose,
    SearchDialogContent,
    SearchDialogHeader,
    SearchDialogIcon,
    SearchDialogInput,
    SearchDialogList,
    SearchDialogOverlay,
    type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { create } from '@orama/orama';

import { useCallback } from 'react';

export default function CustomSearchDialog(props: SharedProps) {
    const { locale } = useI18n();

    // Memoize the initialization function to avoid re-renders
    const initOrama = useCallback(() => {
        return create({
            language: 'english',
            schema: {
                content: 'string',
                page_id: 'string',
                type: 'string',
                breadcrumbs: 'string[]',
                tags: 'enum[]',
                url: 'string',
                embeddings: 'vector[512]',
            }
        });
    }, []);

    const { search, setSearch, query } = useDocsSearch({
        type: 'static',
        initOrama,
        locale,
    });

    return (
        <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
            <SearchDialogOverlay />
            <SearchDialogContent>
                <SearchDialogHeader>
                    <SearchDialogIcon />
                    <SearchDialogInput />
                    <SearchDialogClose />
                </SearchDialogHeader>
                <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
            </SearchDialogContent>
        </SearchDialog>
    );
}
