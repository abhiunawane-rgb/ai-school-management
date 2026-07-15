import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'out');
const uploadDir = join(root, '..', '..', 'dist', 'bigrock-admin-upload');

function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, NODE_ENV: 'production', ...env },
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run('npx', ['next', 'build'], { BIGROCK_STATIC: '1' });

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

console.log('\n✓ BigRock admin upload folder ready:');
console.log(uploadDir);
console.log('\nUpload to BigRock subdomain folder, e.g. public_html for admin.aischoolmanagement.tech');
