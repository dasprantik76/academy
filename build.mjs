import { cp, mkdir, rm } from 'node:fs/promises';

const outputDirectory = new URL('./public/', import.meta.url);
const publicFiles = [
  'index.html',
  'admin.html',
  'admin-config.js',
  'admin-script.js',
  'admin-style.css'
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  publicFiles.map(file => cp(new URL(file, import.meta.url), new URL(file, outputDirectory)))
);
