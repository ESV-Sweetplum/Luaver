import * as fs from "fs";
import * as path from "path";

export function getFilesRecursively(directory) {
  let files = [];

  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      files = [...files, ...getFilesRecursively(absolute)];
    } else {
      files.push(absolute);
    }
  }

  return files;
}
