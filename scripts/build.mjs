import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { minify } from "html-minifier-terser";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const [html, css, javascript] = await Promise.all([
  read("src/index.html"),
  read("src/style.css"),
  read("src/app.js"),
]);

// Функции замены сохраняют символы $ в JavaScript как обычный текст.
const standalone = html
  .replace(
    /<link\s+rel="stylesheet"\s+href="style\.css"\s*\/?>/,
    () => `<style>${css}</style>`,
  )
  .replace(
    /<script\s+src="app\.js"\s*><\/script>/,
    () => `<script>${javascript}</script>`,
  );

if (standalone === html || standalone.includes('src="app.js"')) {
  throw new Error("Не удалось встроить стили или JavaScript в страницу");
}

const release = await minify(standalone, {
  collapseWhitespace: true,
  removeComments: true,
  minifyJS: true,
  minifyCSS: { inline: ["none"] },
});

await mkdir(new URL("dist/", root), { recursive: true });
await mkdir(new URL("github-pages/", root), { recursive: true });

await Promise.all([
  writeFile(new URL("index.html", root), release),
  writeFile(new URL("github-pages/index.html", root), release),
  writeFile(new URL("Лизе.html", root), standalone),
  ...["index.html", "style.css", "app.js"].map((name) =>
    copyFile(new URL(`src/${name}`, root), new URL(`dist/${name}`, root)),
  ),
]);

console.log(`Готово: ${fileURLToPath(new URL("index.html", root))}`);
