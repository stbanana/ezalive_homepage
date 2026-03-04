import { source } from './lib/source';

console.log('Pages URL:');
console.log(source.getPages().map(p => p.url));
console.log('Languages:', source.getLanguages().map(l => l.language));
