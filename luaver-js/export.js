import AdmZip from "adm-zip";
import fs from "fs";

if (!fs.existsSync("dist-temp")) fs.mkdirSync("dist-temp");
fs.copyFileSync("plugin.lua", "dist-temp/plugin.lua");
fs.copyFileSync("settings.ini", "dist-temp/settings.ini");

const zip = new AdmZip();

zip.addLocalFolder("dist-temp");

if (!fs.existsSync("dist")) fs.mkdirSync("dist");

zip.writeZip("dist/plugin.zip");

fs.rmSync("dist-temp", { recursive: true, force: true });
