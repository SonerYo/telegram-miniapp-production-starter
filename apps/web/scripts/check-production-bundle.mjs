import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const assetsDirectory = new URL('../dist/assets/', import.meta.url);
const files = await readdir(assetsDirectory);
const javascript = files.filter((file) => file.endsWith('.js'));
const forbidden = ['Mock environment controls'];

for (const file of javascript) {
  const contents = await readFile(join(assetsDirectory.pathname, file), 'utf8');
  const match = forbidden.find((value) => contents.includes(value));
  if (match) {
    throw new Error(`Production bundle contains dev-only marker: ${match}`);
  }
}

console.info('Production bundle excludes browser mock controls and auth markers.');
