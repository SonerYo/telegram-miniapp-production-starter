import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { glob } from 'node:fs/promises';

const root = resolve(import.meta.dirname, '../../..');
const files = [];
for await (const file of glob(['*.md', 'docs/**/*.md', '.github/**/*.md'], { cwd: root })) {
  files.push(file);
}

const failures = [];
const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
for (const file of files) {
  const source = await readFile(resolve(root, file), 'utf8');
  for (const match of source.matchAll(linkPattern)) {
    const href = match[1]?.split('#')[0];
    if (
      !href ||
      href.startsWith('http:') ||
      href.startsWith('https:') ||
      href.startsWith('mailto:')
    )
      continue;
    const target = resolve(root, dirname(file), decodeURIComponent(href));
    try {
      await access(target);
    } catch {
      failures.push(`${file}: ${href}`);
    }
  }
}

if (failures.length) {
  throw new Error(`Broken internal links:\n${failures.join('\n')}`);
}
console.info(`Checked internal links in ${files.length} Markdown files.`);
