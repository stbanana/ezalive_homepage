'use client';

import { useEffect, useMemo, useState } from 'react';

type Locale = 'zh' | 'en';

const CHINESE_PREFIXES = ['zh', 'zh-cn', 'zh-tw', 'zh-hk', 'zh-mo'];
const DISMISS_KEY = 'ezalive_lang_notice_dismissed';

function getLanguageList(): string[] {
  if (typeof navigator === 'undefined') {
    return [];
  }
  const list = navigator.languages?.length ? navigator.languages : [navigator.language];
  return list.filter(Boolean).map((lang) => lang.toLowerCase());
}

function isChineseLanguage(): boolean {
  return getLanguageList().some((lang) => CHINESE_PREFIXES.some((prefix) => lang.startsWith(prefix)));
}

export default function LanguageNotice({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const isChinese = useMemo(() => isChineseLanguage(), []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === '1';
    if (dismissed) {
      return;
    }

    if (locale === 'en' && isChinese) {
      setVisible(true);
      return;
    }
    if (locale === 'zh' && !isChinese) {
      setVisible(true);
    }
  }, [locale, isChinese]);

  if (!visible) {
    return null;
  }

  const targetLocale = locale === 'en' ? 'zh' : 'en';
  const message =
    locale === 'en'
      ? '该网站有更适合你的语言版本'
      : 'A version in your language is available.';
  const jumpText = locale === 'en' ? '跳转本地站点' : 'Go to your local site';
  const dismissText = locale === 'en' ? '不用，谢谢' : 'No, thanks';

  return (
    <div className="w-full bg-neutral-900 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-2 text-sm">
        <span>{message}</span>
        <div className="flex items-center gap-3">
          <a className="underline" href={`/${targetLocale}`}>
            {jumpText}
          </a>
          <button
            className="text-neutral-200"
            type="button"
            onClick={() => {
              window.localStorage.setItem(DISMISS_KEY, '1');
              setVisible(false);
            }}
          >
            {dismissText}
          </button>
        </div>
      </div>
    </div>
  );
}
