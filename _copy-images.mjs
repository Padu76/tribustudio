// Script temporaneo per copiare immagini da tribu-private-gym
import { cpSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

const src = 'E:\\tribu-private-gym\\public';
const dst = 'E:\\tribustudio\\.claude\\worktrees\\confident-swirles\\public\\images\\private-gym';

const folders = ['studio', 'postazioni', 'attrezzature', 'spogliatoi', 'attesa', 'esterno'];

for (const folder of folders) {
  const srcPath = join(src, folder);
  const dstPath = join(dst, folder);
  if (existsSync(srcPath)) {
    mkdirSync(dstPath, { recursive: true });
    cpSync(srcPath, dstPath, { recursive: true });
    console.log(`OK: ${folder}`);
  } else {
    console.log(`SKIP (non esiste): ${srcPath}`);
  }
}

// Verifica
console.log('\n--- Verifica ---');
for (const folder of folders) {
  const dstPath = join(dst, folder);
  if (existsSync(dstPath)) {
    const { readdirSync } = await import('fs');
    const files = readdirSync(dstPath);
    console.log(`${folder}/: ${files.join(', ')}`);
  }
}

// Controlla calcola-trasformazione
const calcPath = 'E:\\tribustudio\\.claude\\worktrees\\confident-swirles\\app\\calcola-trasformazione';
console.log(`\ncalcola-trasformazione esiste: ${existsSync(calcPath)}`);

console.log('\nDone!');
