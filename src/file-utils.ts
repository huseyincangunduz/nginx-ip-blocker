import * as FileSystemAsync from 'fs/promises';

export async function readLastLines(filePath: string, numLines: number) {
  const contents = await FileSystemAsync.readFile(filePath, 'utf8');
  return contents.split('\n').slice(-numLines).join('\n');
}
