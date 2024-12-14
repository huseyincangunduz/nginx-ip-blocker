import * as FileSystemAsync from 'fs/promises';

// const map = new Map([
//   ["key1", "value1"],
//   ["key2", "value2"],
// ]);

export const saveToFile = async (map: Map<any, any>, jsonPath: string) => {
  const json = JSON.stringify([...map]);
  //@ts-ignore
  await FileSystemAsync.writeFile(jsonPath, json, { encoding: 'utf-8' });
};

export const readToMap = async (jsonPath: string) => {
  const fileExists = async (path) =>
    !!(await FileSystemAsync.stat(path).catch((e) => false));

  if (await fileExists(jsonPath)) {
    const json = await FileSystemAsync.readFile('map.json', {
      //@ts-ignore
      encoding: 'utf-8',
    });
    return new Map(JSON.parse(json));
  }
  return new Map();
};
