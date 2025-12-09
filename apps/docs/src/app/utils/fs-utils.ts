import fs from 'fs';
import path from 'path';

export const loadSource = (filePath: string): string => {
  const fullPath = path.join(process.cwd(), 'src/app/examples', filePath);
  return fs.readFileSync(fullPath, 'utf8');
};
