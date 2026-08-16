import fs from 'fs';
import path from 'path';

/**
 * Loads a JSON file from the project's data/ folder.
 * Example: loadTestData<{ title: string }>('applicationData.json')
 */
export function loadTestData<T>(fileName: string): T {
  const filePath = path.resolve(__dirname, '..', 'data', fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}
