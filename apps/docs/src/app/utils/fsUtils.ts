import fs from 'fs';
import path from 'path';

export const loadDocsSource = (filePath: string): string => {
  const fullPath = path.join(process.cwd(), 'src/app', filePath);
  return fs.readFileSync(fullPath, 'utf8');
};

export const loadExampleSource = (filePath: string): string => {
  return loadDocsSource(`examples/${filePath}`);
};

export const loadLibRoot = (filePath: string): string => {
  const fullPath = path.join(process.cwd(), '../../packages/react-tree-multi-select', filePath);
  return fs.readFileSync(fullPath, 'utf8');
};

export const loadLibSource = (filePath: string): string => {
  return loadLibRoot(`src/${filePath}`);
};

export const loadLibVersion = (): string => {
  const pkg = JSON.parse(loadLibRoot('package.json'));
  return pkg.version;
};
