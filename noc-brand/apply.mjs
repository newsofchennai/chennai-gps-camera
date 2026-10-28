// News of Chennai copy only: after Reclaim Chennai's app is built, swap in the News of Chennai camera icon and home-screen name.
// Runs in the Cloudflare build (Root directory: app → this file is ../noc-brand/apply.mjs). Their source is never edited, so the
// weekly sync with Reclaim Chennai stays clean. If anything here fails, it says so and leaves their own icon in place.
import { readFile, writeFile, copyFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(process.cwd(), 'dist');
try {
  for (const f of await readdir(join(HERE, 'icons'))) await copyFile(join(HERE, 'icons', f), join(DIST, 'icons', f));
  const mf = join(DIST, 'manifest.webmanifest');
  const m = JSON.parse(await readFile(mf, 'utf8'));
  m.name = 'NoC GPS Camera (Chennai GPS Camera by Reclaim Chennai)';
  m.short_name = 'NoC Camera';
  await writeFile(mf, JSON.stringify(m));
  const ix = join(DIST, 'index.html');
  let html = await readFile(ix, 'utf8');
  html = html.replace(/<meta name="apple-mobile-web-app-title"[^>]*>/gi, '').replace(/<head>/i, '<head><meta name="apple-mobile-web-app-title" content="NoC Camera">');
  await writeFile(ix, html);
  console.log('✓ News of Chennai icon and name applied');
} catch (e) { console.log(`! News of Chennai icon not applied (${e?.message || e}); Reclaim Chennai's own icon stays`); }
