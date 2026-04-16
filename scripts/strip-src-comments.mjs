import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const strip = require("strip-comments");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function walk(dir, extensions, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === "dist") continue;
      walk(full, extensions, out);
    } else if (extensions.some((ext) => name.endsWith(ext))) {
      out.push(full);
    }
  }
  return out;
}

function stripFile(filePath) {
  const ext = path.extname(filePath);
  const input = fs.readFileSync(filePath, "utf8");
  let language = "javascript";
  if (ext === ".css") language = "css";
  let out = strip(input, { language, preserveNewlines: true });

  if (ext === ".js" || ext === ".jsx") {
    out = out.replace(/^\s*\{\}\s*$/gm, "");
    out = out.replace(/\n{3,}/g, "\n\n");
  }

  if (out !== input) {
    fs.writeFileSync(filePath, out, "utf8");
    return true;
  }
  return false;
}

const targets = [
  ...walk(path.join(root, "src"), [".js", ".jsx", ".css"]),
  ...walk(path.join(root, "api"), [".js"]),
  path.join(root, "vite.config.js"),
  path.join(root, "eslint.config.js"),
].filter((p) => fs.existsSync(p));

let changed = 0;
for (const file of targets) {
  if (stripFile(file)) changed += 1;
}
console.log(`strip-comments: updated ${changed} of ${targets.length} files`);
