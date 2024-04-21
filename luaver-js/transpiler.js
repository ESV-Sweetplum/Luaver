import { readFileSync, writeFileSync } from "fs";
import { getFilesRecursively } from "./getFilesRecursively.js";

function transpiler() {
  let output = "";

  function addToOutput(str) {
    output = `${output}\n\n${str}`;
  }

  // Transpile Luaver modules

  const modules = getFilesRecursively("luaver-modules");
  modules.forEach((module) => {
    addToOutput(getFile(module));
  });

  // Transpile Pages

  const pages = getFilesRecursively("./src/pages");

  let luaTableStr = [`local routerDictionary = {`];

  pages.forEach((pagePath) => {
    const fileData = getFile(pagePath)
      .split("\n")
      .filter((str) => str); // Filter out empty lines
    const fnIndex = fileData.findIndex((item) => item.includes("function"));
    let pageName = pagePath
      .replace("src\\pages", "")
      .replace(".lua", "")
      .replaceAll("\\", "/")
      .slice(1);
    fileData[fnIndex] = fileData[fnIndex].replace(
      /[A-z_][A-z_0-9]*\(\)/,
      `pages_${pageName.replaceAll("/", "")}()`
    ); // Replace function name with route

    luaTableStr.push(
      `['${pageName}'] = pages_${pageName.replaceAll("/", "")},`
    );
    addToOutput(fileData.join("\n"));
  });

  // Transpile page dictionary and entry file

  luaTableStr.push("}");

  const entryFile = readFileSync("src/main.lua", "utf-8").split("\n");

  const entryIndex = entryFile.findIndex((item) =>
    item.includes("imgui.Begin(")
  );

  entryFile.splice(
    entryIndex + 1,
    0,
    "routerDictionary[routerHistory[#routerHistory]]()"
  );
  entryFile.splice(entryIndex + 1, 0, luaTableStr.join("\n"));

  addToOutput(entryFile.join("\n"));

  writeFileSync("plugin.lua", output.replaceAll("\n\n", "\n"));
}

transpiler();

function getFile(relPath) {
  return readFileSync(relPath, "utf-8");
}

export default transpiler;
