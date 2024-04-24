import chokidar from "chokidar";
import transpiler from "./transpiler.js";
import chalk from "chalk";

console.log(
  "Began watch of src directory. Modifying src will recompile plugin.lua."
);

chokidar
  .watch("src", { ignoreInitial: true })
  .on("all", async (event, path) => {
    console.log(
      `\nDetected event ${chalk.red(event)} in path ${chalk.blue(path)}.`
    );
    const startTime = Date.now();
    transpiler();
    console.log(
      `Transpiled src in ${chalk.greenBright(`${Date.now() - startTime}ms`)}.`
    );
  });
