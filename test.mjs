import { source } from './lib/source.ts'; console.log(source.getPages().map(p => ({ url: p.url, lang: p.language })));
