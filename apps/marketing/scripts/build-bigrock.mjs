import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const apiDir = join(root, 'src', 'app', 'api');
const apiBackup = join(root, 'src', 'app', '_api_backup');
const outDir = join(root, 'out');
const uploadDir = join(root, '..', '..', 'dist', 'bigrock-upload');

function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...env },
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function hideApi() {
  if (!existsSync(apiDir)) return false;
  if (existsSync(apiBackup)) rmSync(apiBackup, { recursive: true, force: true });
  cpSync(apiDir, apiBackup, { recursive: true });
  rmSync(apiDir, { recursive: true, force: true });
  return true;
}

function restoreApi() {
  if (!existsSync(apiBackup)) return;
  if (existsSync(apiDir)) rmSync(apiDir, { recursive: true, force: true });
  cpSync(apiBackup, apiDir, { recursive: true });
  rmSync(apiBackup, { recursive: true, force: true });
}

let hidden = false;
try {
  hidden = hideApi();
  if (!hidden && existsSync(apiDir)) {
    console.error(
      'Could not hide api/ folder (files may be locked). Stop `pnpm dev` and run build:bigrock again.'
    );
    process.exit(1);
  }
  run('npx', ['next', 'build'], { BIGROCK_STATIC: '1', NODE_ENV: 'production' });
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  restoreApi();
}

if (!existsSync(outDir)) {
  console.error('Build did not produce out/ folder');
  process.exit(1);
}

rmSync(uploadDir, { recursive: true, force: true });
mkdirSync(uploadDir, { recursive: true });
cpSync(outDir, uploadDir, { recursive: true });

const htaccess = join(root, '..', '..', 'scripts', 'bigrock.htaccess');
if (existsSync(htaccess)) {
  cpSync(htaccess, join(uploadDir, '.htaccess'));
}

console.log('\n✓ BigRock upload folder ready:');
console.log(uploadDir);
console.log('\nUpload all files inside bigrock-upload to your BigRock public_html.');
console.log('Static host: signup/contact use browser storage until API is on Vercel.');
