import fs from 'fs';
import path from 'path';

export const loadDocsSource = (filePath: string): string => {
  const fullPath = path.join(process.cwd(), 'src/app', filePath);
  return fs.readFileSync(fullPath, 'utf8');
};

export const loadExampleSource = (filePath: string): string => {
  return loadDocsSource(`examples/${filePath}`);
};

export const loadLibSource = (filePath: string): string => {
  const fullPath = path.join(process.cwd(), '../../packages/react-tree-multi-select/src', filePath);
  return fs.readFileSync(fullPath, 'utf8');
};
