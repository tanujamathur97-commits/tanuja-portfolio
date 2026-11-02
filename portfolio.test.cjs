const { test, after, before } = require("node:test");
const assert = require("node:assert/strict");
const server = require("./server.cjs");
const vm = require("node:vm");
const fs = require("node:fs/promises");
let base;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("all portfolio pages and assets are served with correct content types", async () => {
  for (const [url, type] of [
    ["/", "text/html"], ["/index.html", "text/html"],
    ["/about.html", "text/html"], ["/playground.html", "text/html"],
    ["/creative-practice.html", "text/html"],
    ["/project.html?project=fox-icons", "text/html"],
    ["/styles.css", "text/css"], ["/app.js", "text/javascript"],
    ["/fox.js", "text/javascript"],
  ]) {
    const response = await fetch(`${base}${url}`);
    assert.equal(response.status, 200, url);
    assert.ok(response.headers.get("content-type").startsWith(type), url);
    assert.ok((await response.text()).length > 0, url);
  }
});

test("page shells contain navigation targets and accessible main landmarks", async () => {
  for (const name of ["index", "about", "playground", "project", "creative-practice"]) {
    const html = await (await fetch(`${base}/${name}.html`)).text();
    assert.match(html, /lang="en"/);
    assert.match(html, /<main id="main">/);
    assert.match(html, /class="skip-link"/);
    assert.match(html, /<script src="\.\/app\.js" defer>/);
    assert.match(html, /<html lang="en" data-theme="light">/);
    assert.match(html, /<meta name="color-scheme" content="light">/);
    assert.doesNotMatch(html, /prefers-color-scheme|scoutTheme/);
    assert.ok(html.indexOf('src="./fox.js"') < html.indexOf('src="./app.js"'));
  }
});

test("legacy theme parameters never change page shells or propagate through navigation", async () => {
  for (const name of ["index", "about", "playground", "project", "creative-practice"]) {
    for (const theme of ["light", "dark", "invalid"]) {
      const query = `?scoutTheme=${theme}`;
      const html = await (await fetch(`${base}/${name}.html${query}`)).text();
      assert.match(html, /<html lang="en" data-theme="light">/);
      assert.match(html, /<meta name="color-scheme" content="light">/);
      const rendered = await renderPage(name === "index" ? "work" : name, query);
      assert.doesNotMatch(rendered.html, /scoutTheme=/);
    }
  }
});

test("Creative Practice is a separate freelance page with light-only navigation", async () => {
  const { html, title, elements } = await renderPage("creative-practice", "?scoutTheme=dark");
  assert.equal(title, "Beyond product design · Tanuja");
  assert.match(html, /A little beyond<br><em>the screen\./);
  assert.match(html, /<h1 id="creative-title">/);
  assert.doesNotMatch(html, /page-heading-art|data-motif="flower"/);
  assert.match(html, /brand strategy, visual identities, packaging, and illustration/);
  assert.match(html, /href="https:\/\/www\.behance\.net\/tanujamath97" target="_blank" rel="noopener">Explore my creative work/);
  assert.doesNotMatch(html, /coming soon|creative-preview|utm_source|fbclid/);
  const header = elements.get("#site-header").innerHTML;
  assert.match(header, /href="\.\/creative-practice\.html" aria-current="page">Beyond product design/);
  assert.match(header, /href="\.\/playground\.html" >Life and all/);
  assert.match(header, /href="\.\/index\.html#work"/);
  for (const page of ["work", "about", "playground", "project"]) {
    const { elements: pageElements } = await renderPage(page);
    assert.match(pageElements.get("#site-header").innerHTML, /href="\.\/creative-practice\.html" >Beyond product design/);
  }
});

test("Creative Practice displays all five supplied images with accessible lazy loading", async () => {
  const { html } = await renderPage("creative-practice");
  assert.match(html, /aria-label="Freelance packaging and illustration work"/);
  const images = [...html.matchAll(/<img src="(\.\/assets\/creative-practice\/(?:project-\d{2}|metta-packaging)\.webp)" width="1600" height="\d+" alt="([^"]+)" loading="lazy" decoding="async">/g)];
  assert.equal(images.length, 5);
  assert.match(html, /class="creative-gallery-pair"/);
  assert.match(html, /metta-packaging\.webp" width="1600" height="676"/);
  for (const [index, [, src, alt]] of images.entries()) {
    const filename = index === 4 ? "metta-packaging.webp" : `project-${String(index + 1).padStart(2, "0")}.webp`;
    assert.ok(src.endsWith(filename));
    assert.ok(alt.length > 20);
    const response = await fetch(`${base}/${src.slice(2)}`);
    assert.equal(response.status, 200, src);
    assert.equal(response.headers.get("content-type"), "image/webp");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  }
});

test("Life and all displays 16 photos with the bridge replacing the mural", async () => {
  const { html } = await renderPage("playground");
  assert.match(html, /<h1>A little chaos\.<br><em>A lot of joy\.<\/em><\/h1>/);
  assert.doesNotMatch(html, /page-heading-art/);
  assert.match(html, /aria-label="Life and all photo collage"/);
  const images = [...html.matchAll(/<img src="(\.\/assets\/life-and-all\/photo-\d{2}\.webp)" width="(799|900)" height="1200" alt="([^"]+)" loading="lazy" decoding="async">/g)];
  assert.equal(images.length, 16);
  assert.equal((html.match(/class="life-photo" type="button" aria-pressed="false" aria-label="Bring photo to front:/g) || []).length, 16);
  assert.doesNotMatch(html, /photo-02\.webp|street mural/);
  assert.equal((html.match(/photo-17\.webp/g) || []).length, 1);
  const photoOrder = [10, 17, 1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16];
  for (const [index, [, src, width, alt]] of images.entries()) {
    assert.ok(src.endsWith(`photo-${String(photoOrder[index]).padStart(2, "0")}.webp`));
    assert.equal(width, "900");
    assert.ok(alt.length > 20);
    const response = await fetch(`${base}/${src.slice(2)}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/webp");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  }
  assert.doesNotMatch(html, /lab-grid|type-size|density-preview|new-prompt|Interactive experiments/);
  assert.equal((await fetch(`${base}/assets/life-and-all/originals/photo-01.jpg`)).status, 404);
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.match(css, /\.life-photo img \{ display: block; width: 100%; height: auto;/);
});

test("Life collage front selection is exclusive and can be toggled off", async () => {
  const photos = Array.from({ length: 3 }, () => ({
    pressed: "false",
    getAttribute(name) { assert.equal(name, "aria-pressed"); return this.pressed; },
    setAttribute(name, value) { assert.equal(name, "aria-pressed"); this.pressed = value; },
    addEventListener(name, callback) { assert.equal(name, "click"); this.click = callback; },
  }));
  const source = await (await fetch(`${base}/app.js`)).text();
  const start = source.indexOf("function initLifeCollage()");
  const end = source.indexOf('const main = document.querySelector("#main")', start);
  const context = vm.createContext({
    document: { querySelectorAll(selector) { assert.equal(selector, ".life-photo"); return photos; } },
  });
  vm.runInContext(`${source.slice(start, end)}\ninitLifeCollage();`, context);
  photos[0].click();
  assert.deepEqual(photos.map((photo) => photo.pressed), ["true", "false", "false"]);
  photos[1].click();
  assert.deepEqual(photos.map((photo) => photo.pressed), ["false", "true", "false"]);
  photos[1].click();
  assert.deepEqual(photos.map((photo) => photo.pressed), ["false", "false", "false"]);
});

test("unknown paths and private source files are not exposed", async () => {
  for (const url of ["/missing.html", "/server.cjs", "/package.json", "/.env", "/%2e%2e/package.json"]) {
    assert.equal((await fetch(`${base}${url}`)).status, 404, url);
  }
});

test("all pages use the supplied portrait favicon in browser and Apple sizes", async () => {
  for (const name of ["index", "about", "playground", "project"]) {
    const html = await (await fetch(`${base}/${name}.html`)).text();
    assert.match(html, /<link rel="icon" href="\.\/favicon\.ico\?v=flower" sizes="16x16 32x32 48x48">/);
    assert.match(html, /<link rel="icon" type="image\/png" sizes="32x32" href="\.\/assets\/favicon-32\.png\?v=flower">/);
    assert.match(html, /<link rel="apple-touch-icon" sizes="180x180" href="\.\/assets\/apple-touch-icon\.png\?v=flower">/);
  }
  for (const [file, size] of [["favicon-32.png", 32], ["apple-touch-icon.png", 180]]) {
    const response = await fetch(`${base}/assets/${file}?v=flower`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), size);
    assert.equal(bytes.readUInt32BE(20), size);
  }
  const response = await fetch(`${base}/favicon.ico?v=flower`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/x-icon");
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.readUInt16LE(2), 1);
  assert.equal(bytes.readUInt16LE(4), 3);
  assert.deepEqual([0, 1, 2].map((index) => [
    bytes[6 + index * 16], bytes[7 + index * 16],
  ]), [[16, 16], [32, 32], [48, 48]]);
});

test("HEAD works and unsupported methods are explicitly rejected", async () => {
  const head = await fetch(base, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  const post = await fetch(base, { method: "POST" });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET, HEAD");
});

async function renderPage(page, search = "") {
  const elements = new Map();
  const context = vm.createContext({
    URLSearchParams,
    location: { search },
    window: {
      addEventListener() {},
      matchMedia() { return { matches: false, addEventListener() {} }; },
    },
    document: {
      body: { dataset: { page } },
      documentElement: { style: { setProperty() {} } },
      querySelector(selector) {
        if (!elements.has(selector)) {
          elements.set(selector, {
            innerHTML: "", dataset: {}, listeners: {}, setAttribute() {},
            getBoundingClientRect() { return { height: 96, bottom: 96 }; },
            addEventListener(event, listener) { this.listeners[event] = listener; },
            querySelector: (child) => context.document.querySelector(child),
            querySelectorAll() { return []; },
          });
        }
        return elements.get(selector);
      },
      querySelectorAll() { return []; },
    },
  });
  for (const file of ["fox.js", "app.js"]) {
    const source = await (await fetch(`${base}/${file}`)).text();
    vm.runInContext(source, context, { filename: file });
  }
  return {
    html: elements.get("#main").innerHTML,
    title: vm.runInContext("document.title", context),
    elements,
  };
}

test("all page headers use only the portrait icon as an accessible home link", async () => {
  for (const page of ["work", "about", "playground", "project"]) {
    const { elements } = await renderPage(page, "?project=fox-icons&scoutTheme=light");
    const header = elements.get("#site-header").innerHTML;
    assert.match(header, /<a class="brand" href="\.\/index\.html" aria-label="Home"><img src="\.\/assets\/apple-touch-icon\.png\?v=flower" width="48" height="48" alt=""><\/a>/);
    assert.doesNotMatch(header, /brand-mark|Your Name|Product &amp; experience designer|<small>/);
  }
});

test("sticky header updates anchor offsets when navigation wraps, with a resize fallback", async () => {
  const source = await (await fetch(`${base}/app.js`)).text();
  const initializer = source.slice(source.indexOf("function initStickyHeader()"), source.indexOf('document.querySelector("#site-footer")'));
  for (const withObserver of [true, false]) {
    let height = 96;
    let measuredHeight;
    let onResize;
    const header = { getBoundingClientRect() { return { height }; } };
    const context = vm.createContext({
      document: {
        querySelector() { return header; },
        documentElement: { style: { setProperty(name, value) {
          assert.equal(name, "--cp-header-height");
          measuredHeight = value;
        } } },
      },
      window: {
        addEventListener(event, callback) {
          assert.equal(event, "resize");
          onResize = callback;
        },
      },
    });

    if (withObserver) {
      context.window.ResizeObserver = function (callback) {
        onResize = callback;
        this.observe = (target) => assert.equal(target, header);
      };
    }
    vm.runInContext(`${initializer}\ninitStickyHeader();`, context);
    assert.equal(measuredHeight, "96px");
    height = 136;
    onResize();
    assert.equal(measuredHeight, "136px");
  }
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.match(css, /#site-header \{ position: sticky; top: 0; z-index: 20; background: var\(--cp-bg\); \}/);
  assert.match(css, /scroll-padding-top: calc\(var\(--cp-header-height, 96px\) \+ 16px\)/);
});

test("page navigation uses a static highlight without transition effects", async () => {
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.doesNotMatch(css, /view-transition|page-fade|nav-highlight/);
  assert.match(css, /scrollbar-gutter: stable/);
  assert.match(css, /body\[data-page\] \.nav-shell nav a\[aria-current\] \{ background: var\(--cp-text\); color: var\(--cp-bg\); \}/);
  for (const page of ["work", "project", "about", "playground", "creative-practice"]) {
    const { elements } = await renderPage(page);
    const header = elements.get("#site-header").innerHTML;
    assert.equal((header.match(/aria-current="page"/g) || []).length, 1);
    assert.match(header, /aria-current="page">[^<]+<\/a>/);
    assert.doesNotMatch(header, /nav-highlight/);
  }
});

test("experimental homepage preserves project routes and composes two cropped FOX ribbons", async () => {
  const { html } = await renderPage("work", "?scoutTheme=dark");
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /alt="Hi, I am Tanuja · Product designer at Microsoft"/);
  assert.match(html, /<h1 id="home-heading">Solving real problems with AI\.<br>Crafting stories that connect\.<\/h1>/);
  assert.doesNotMatch(html, /home-greeting|For the love of experiences\.|A sucker for experiences/);
  assert.match(html, /href="#work">Explore my work<\/a>/);
  assert.doesNotMatch(html, /Unlock an experience|class="studio-about-link"/);
  assert.match(html, /class="studio-canvas"><div class="subway-composition"/);
  const hero = html.match(/<section class="studio-hero wrap"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(hero, /home-illustrations|studio-canvas/);
  const personalSection = html.match(/<section class="studio-about wrap"[\s\S]*?<\/section>/)[0];
  assert.match(personalSection, /class="studio-about-profile"[\s\S]*class="studio-about-portrait"[\s\S]*class="studio-about-copy"[\s\S]*id="studio-about-heading"[\s\S]*class="studio-about-links"[\s\S]*<\/div><\/div><\/div>\s*<div class="home-artwork">/);
  assert.match(personalSection, /class="studio-toy home-illustrations"/);
  assert.doesNotMatch(html, /class="home-artwork wrap"/);
  assert.equal((html.match(/class="studio-toy home-illustrations"/g) || []).length, 1);
  assert.doesNotMatch(html, /remix-composition|composition-status|composition-label|data-composition/);
  const thumbnail = html.match(/<div class="art studio-fox-art"[\s\S]*?<\/div>/)[0];
  assert.match(thumbnail, /role="img" aria-label="Two cropped Office ribbons on yellow/);
  assert.equal((thumbnail.match(/<img\b/g) || []).length, 2);
  for (const [app, width, height] of [["excel", 3444, 374], ["word", 4206, 456]]) {
    const file = `/assets/fox/thumbnail-${app}-ribbon.png`;
    assert.ok(thumbnail.includes(`src=".${file}" width="${width}" height="${height}" alt=""`));
    const response = await fetch(`${base}${file}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), width);
    assert.equal(bytes.readUInt32BE(20), height);
  }
  assert.doesNotMatch(thumbnail, /fox-ribbon-banner.png/);
  assert.doesNotMatch(html, /studio-fox-word|studio-fox-flourish|studio-fox-source|studio-fox-bottom/);
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.match(css, /\.studio-fox-art \{ background: var\(--cp-mustard\); \}/);
  assert.match(css, /\.studio-fox-ribbon-excel \{ top: calc\(50% - 142px\);/);
  assert.match(css, /\.studio-fox-ribbon-word \{ top: calc\(50% - 2px\);/);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.studio-fox-ribbon \{ transition: transform 650ms/);
  assert.match(css, /\.project-link:is\(:hover, :focus-visible\) \.studio-fox-ribbon-excel \{ transform: translate\(-12px, -2px\); \}/);
  assert.match(css, /\.project-link:is\(:hover, :focus-visible\) \.studio-fox-ribbon-word \{ transform: translate\(12px, 2px\); \}/);
  assert.doesNotMatch(html, /ORIGINAL TEXTURED ILLUSTRATIONS|case-study draft|class="disciplines"|studio-fox-caption/);
  assert.match(html, /<h2 id="work-heading">Work<\/h2>/);
  assert.doesNotMatch(html, /studio-principles|studio-principle|SELECTED WORK|Thought through|Made to matter|data-filter|filter-status|home-project-count/);
  assert.doesNotMatch(html, /class="art studio-orbit-art"/);
  const filters = [...html.matchAll(/<filter id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(filters).size, filters.length, "Illustration texture IDs must be unique");
  assert.equal((html.match(/studio-featured/g) || []).length, 1);
  assert.match(html, /<h3>FOX Icons:<br>Built to scale<\/h3>/);
  for (const slug of ["fox-icons", "making-icons-searchable", "template-validator", "bug-logger"]) {
    assert.ok(html.includes(`project=${slug}`), slug);
  }
  for (const path of ["about.html", "playground.html"]) {
    assert.ok(html.includes(`${path}`), path);
  }
});

test("homepage intro adds PowerPoint experience without repeating the handwritten identity", async () => {
  const { html } = await renderPage("work");
  const hero = html.match(/<section class="studio-hero wrap"[\s\S]*?<\/section>/)[0];
  assert.match(hero, /<img class="intro-lettering" src="\.\/assets\/home\/intro-handwritten\.png\?v=script" width="1849" height="268" alt="Hi, I am Tanuja · Product designer at Microsoft">/);
  assert.match(hero, /<span class="intro-highlight" aria-hidden="true"><img src="\.\/assets\/home\/intro-highlight\.png" width="1849" height="268" alt=""><\/span>/);
  assert.match(hero, /<h1 id="home-heading">Solving real problems with AI\.<br>Crafting stories that connect\.<\/h1>/);
  const paragraphs = [...hero.matchAll(/<p>(.*?)<\/p>/g)].map((match) => match[1]);
  assert.deepEqual(paragraphs, [
    "For the past 3.5 years, I've been designing experiences for Microsoft PowerPoint, helping people turn ideas into compelling stories. I focus on using AI where it truly matters, making complex tasks simpler, more intuitive, and meaningful.",
  ]);
  assert.doesNotMatch(paragraphs.join(" "), /product designer at Microsoft/i);
  assert.doesNotMatch(hero, /Beyond screens/);
  assert.match(hero, /href="#work">Explore my work<\/a>/);
  const css = await fs.readFile("styles.css", "utf8");
  assert.match(css, /\.studio-kicker \{ position: relative; aspect-ratio: 1849 \/ 268; \}/);
  assert.match(css, /\.studio-intro-copy > :is\(\.studio-kicker, h1\) \{ width: 100%; max-width: 720px; \}/);
  assert.match(hero, /class="studio-intro-copy"><div class="studio-kicker"/);
  assert.match(hero, /Explore my work<\/a><\/div><\/div><div class="code-flower"/);
  assert.match(css, /\.studio-hero \{ display: grid; align-items: center; min-height: calc\(100dvh - var\(--cp-header-height, 96px\)\); padding-block: 28px; \}/);
  assert.match(css, /\.studio-kicker img \{[^}]*position: absolute;[^}]*width: 100%; height: 100%; object-fit: contain; \}/);
  assert.match(css, /\.intro-lettering \{ z-index: 1; \}/);
  const motionRules = css.match(/@media \(prefers-reduced-motion: no-preference\) \{\s*\.studio-toy \{ animation: studio-enter[\s\S]*?\n\}/)[0];
  assert.match(motionRules, /\.intro-highlight \{ animation: intro-highlight-sweep 1000ms cubic-bezier\(0\.35, 0, 0\.2, 1\) 200ms both; \}/);
  assert.match(css, /@keyframes intro-highlight-sweep \{\s*from \{ clip-path: inset\(0 60% 0 0\); \}\s*to \{ clip-path: inset\(0 16% 0 0\); \}/);
  assert.doesNotMatch(css, /html\[data-theme="dark"\]/);
  assert.match(css, /\.studio-intro-copy > p \{ max-width: 720px;/);
  assert.match(css, /\.studio-intro-copy > p \{ font-size: var\(--cp-font-body\); line-height: 1\.6; font-weight: 400;/);
  assert.doesNotMatch(css, /home-greeting/);
  for (const name of ["intro-handwritten", "intro-highlight"]) {
    const response = await fetch(`${base}/assets/home/${name}.png`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), 1849);
    assert.equal(bytes.readUInt32BE(20), 268);
    assert.equal(bytes[25], 6);
  }
});

test("homepage thought cloud renders four two-frame objects and serves aligned artwork", async () => {
  const { html } = await renderPage("work");
  assert.match(html, /class="code-flower" role="region" aria-label="Feed a thought code" data-state="idle"/);
  assert.doesNotMatch(html, /flower-motion|Pause thought animation/);
  assert.match(html, /<p class="flower-status" role="status">Turning thoughts into something new with code\.<\/p>/);
  assert.doesNotMatch(html, /flower-caption|<code>\{ (grow|next)\(\); \}<\/code>/);
  for (const index of [1, 2]) {
    const response = await fetch(`${base}/assets/home/thought-cloud-${index}.png`);
    assert.equal(response.status, 200);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), 512);
    assert.equal(bytes.readUInt32BE(20), 408);
    assert.ok(html.includes(`src="./assets/home/thought-cloud-${index}.png"`));
  }
  assert.equal((html.match(/class="thought-object"/g) || []).length, 4);
  assert.equal((html.match(/--food-delay:/g) || []).length, 18);
  assert.doesNotMatch(html, /flower-code-row|code-flower-shape|flower-sketch/);
  assert.match(html, /<button class="flower-feed" type="button" hidden>Feed me code/);
  for (const object of ["blue-flower", "pink-flowers", "fish-bowl", "party-worm"]) {
    for (const frame of [1, 2]) {
    const file = `/assets/home/thought-${object}-${frame}.png`;
    assert.ok(html.includes(`src=".${file}"`));
    const response = await fetch(`${base}${file}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), 512);
    assert.equal(bytes.readUInt32BE(20), 512);
    assert.equal(bytes[25], 6);
    }
  }
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.code-flower/);
  assert.match(css, /code-flower-grow 4200ms/);
  assert.match(css, /color: var\(--cp-code-ink\)/);
  assert.match(css, /\.code-flower \.flower-feed \{ width: min\(220px, 100%\); height: 48px;/);
  assert.match(css, /\.code-flower \.flower-status \{ height: 72px; min-height: 72px; font-size: 16px; line-height: 24px; \}/);
});

async function codeFlowerFixture({ ready = true, reduced = false } = {}) {
  const source = await fs.readFile("app.js", "utf8");
  const initializer = source.slice(source.indexOf("function initCodeFlower()"), source.indexOf("function initHomePortrait()"));
  const button = { hidden: true, disabled: false, events: {}, addEventListener(name, callback) { this.events[name] = callback; } };
  const status = { textContent: "" };
  const stage = { attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } };
  const growth = { events: {}, addEventListener(name, callback) { this.events[name] = callback; } };
  const objects = [
    ["blue-flower", "a blue flower with a pink heart"],
    ["pink-flowers", "two pink flowers with a yellow star"],
    ["fish-bowl", "a fish bowl with two yellow fish"],
    ["party-worm", "a pink worm wearing a party hat"],
  ].map(([object, label]) => ({ hidden: true, dataset: { object, label } }));
  const images = Array.from({ length: 10 }, (_, index) => ({
    src: `frame-${index}`, complete: ready, naturalWidth: ready ? 512 : 0, events: {},
    addEventListener(name, callback) { this.events[name] = callback; },
  }));
  const elements = { ".flower-feed": button, ".flower-status": status, ".flower-stage": stage, ".flower-growth": growth };
  const root = {
    dataset: { state: "idle" },
    querySelector(selector) { return elements[selector]; },
    querySelectorAll(selector) {
      if (selector === ".thought-object") return objects;
      assert.equal(selector, "img");
      return images;
    },
  };
  const media = { matches: reduced, events: {}, addEventListener(name, callback) { this.events[name] = callback; } };
  const windowEvents = {}, documentEvents = {}, errors = [];
  const timers = new Map();
  let timerId = 0;
  const document = {
    hidden: false,
    querySelectorAll(selector) { assert.equal(selector, ".code-flower"); return [root]; },
    addEventListener(name, callback) { documentEvents[name] = callback; },
  };
  vm.runInNewContext(`${initializer}\ninitCodeFlower();`, {
    document,
    window: {
      matchMedia: () => media,
      addEventListener(name, callback) { windowEvents[name] = callback; },
      setTimeout(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId; },
      clearTimeout(id) { timers.delete(id); },
    },
    console: { error(...args) { errors.push(args); } },
  });
  return { root, button, status, stage, growth, images, media, windowEvents, documentEvents, document, errors, objects, timers };
}

test("homepage code flower grows once per activation, completes its bloom, and allows replay", async () => {
  const { root, button, status, stage, growth, document, documentEvents } = await codeFlowerFixture();
  assert.equal(button.hidden, false);
  button.events.click();
  assert.equal(root.dataset.state, "feeding");
  assert.equal(button.disabled, true);
  assert.equal(status.textContent, "Feeding a little code...");
  button.events.click();
  growth.events.animationend({ target: {}, animationName: "code-flower-grow" });
  assert.equal(root.dataset.state, "feeding");
  growth.events.animationend({ target: growth, animationName: "code-flower-grow" });
  assert.equal(root.dataset.state, "bloomed");
  assert.equal(button.disabled, false);
  assert.equal(button.textContent, "Feed me more code");
  assert.match(stage.attributes["aria-label"], /a blue flower with a pink heart/);
  assert.equal(status.textContent, "Your thought became a blue flower with a pink heart.");
  button.events.click();
  assert.equal(root.dataset.state, "feeding");
  document.hidden = true;
  documentEvents.visibilitychange();
  assert.equal(root.dataset.state, "bloomed");
  assert.equal(button.disabled, false);
});

test("homepage artwork keeps animating while honoring visibility and reduced motion without a pause button", async () => {
  const { root, button, growth, document, documentEvents, media } = await codeFlowerFixture();
  button.events.click();
  growth.events.animationend({ target: growth, animationName: "code-flower-grow" });
  assert.equal(root.dataset.paused, "false");
  document.hidden = true;
  documentEvents.visibilitychange();
  assert.equal(root.dataset.paused, "true");
  document.hidden = false;
  documentEvents.visibilitychange();
  assert.equal(root.dataset.paused, "false");
  media.matches = true;
  media.events.change();
  assert.equal(root.dataset.paused, "true");
  media.matches = false;
  media.events.change();
  assert.equal(root.dataset.paused, "false");
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.match(css, /code-flower-breathe 4800ms ease-in-out infinite/);
  assert.match(css, /\.thought-object:not\(\[hidden\]\) img:nth-child\(2\) \{ animation: thought-cloud-frame 900ms steps\(1\) infinite; \}/);
  assert.match(css, /\[data-paused="true"\][^{]+\{ animation-play-state: paused; \}/);
});

test("homepage thought loader shows one message at a time and clears pending messages on completion or failure", async () => {
  const { button, status, growth, timers, images } = await codeFlowerFixture();
  button.events.click();
  assert.equal(status.textContent, "Feeding a little code...");
  const messages = [...timers.values()].sort((a, b) => a.delay - b.delay);
  assert.deepEqual(messages.map((message) => message.delay), [800, 2800]);
  messages[0].callback();
  assert.equal(status.textContent, "Thinking it through...");
  messages[1].callback();
  assert.equal(status.textContent, "Making something new...");
  growth.events.animationend({ target: growth, animationName: "code-flower-grow" });
  assert.equal(timers.size, 0);
  assert.match(status.textContent, /Your thought became/);
  button.events.click();
  assert.equal(timers.size, 2);
  images[0].events.error();
  assert.equal(timers.size, 0);
  assert.match(status.textContent, /couldn't load/);
  const reduced = await codeFlowerFixture({ reduced: true });
  reduced.button.events.click();
  assert.equal(reduced.timers.size, 0);
  assert.match(reduced.status.textContent, /Your thought became/);
});

test("homepage thought objects cycle in order without overlapping and wrap after the fourth feed", async () => {
  const { root, button, objects } = await codeFlowerFixture({ reduced: true });
  for (const name of ["blue-flower", "pink-flowers", "fish-bowl", "party-worm", "blue-flower"]) {
    button.events.click();
    assert.equal(root.dataset.state, "bloomed");
    assert.equal(root.dataset.object, name);
    assert.equal(objects.filter((object) => !object.hidden).length, 1);
    assert.equal(objects.find((object) => !object.hidden).dataset.object, name);
  }
});

test("homepage code flower waits for artwork, reports failures and never activates broken art", async () => {
  const { images, button, errors, root, status } = await codeFlowerFixture({ ready: false });
  assert.equal(button.hidden, true);
  images[0].complete = true;
  images[0].naturalWidth = 300;
  images[0].events.load();
  assert.equal(button.hidden, true);
  images[1].events.error();
  assert.equal(root.dataset.state, "error");
  assert.match(status.textContent, /couldn't load/);
  assert.equal(errors.length, 1);
  images[1].complete = true;
  images[1].naturalWidth = 300;
  images[1].events.load();
  assert.equal(button.hidden, true);
  button.events.click();
  assert.equal(root.dataset.state, "error");
});

test("homepage code flower honors reduced motion at activation and during growth", async () => {
  const { root, button, media } = await codeFlowerFixture({ reduced: true });
  button.events.click();
  assert.equal(root.dataset.state, "bloomed");
  assert.equal(button.disabled, false);
  media.matches = false;
  button.events.click();
  assert.equal(root.dataset.state, "feeding");
  media.matches = true;
  media.events.change();
  assert.equal(root.dataset.state, "bloomed");
  assert.equal(button.disabled, false);
});

test("homepage about teaser displays the full-resolution flower portrait instead of generated motifs", async () => {
  const { html } = await renderPage("work");
  const teaser = html.match(/<section class="studio-about wrap"[\s\S]*?<\/section>/)[0];
  assert.match(teaser, /<img class="studio-about-portrait" src="\.\/assets\/home\/flower-portrait\.png" width="768" height="768" alt="Hand drawn portrait framed by a yellow flower" loading="lazy">/);
  assert.doesNotMatch(teaser, /data-motif=/);
  const portrait = teaser.match(/<div class="studio-about-art">[\s\S]*?<\/div>/)[0];
  assert.doesNotMatch(portrait, /aria-hidden="true"/);
  const response = await fetch(`${base}/assets/home/flower-portrait.png`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.readUInt32BE(16), 768);
  assert.equal(bytes.readUInt32BE(20), 768);
  assert.equal(bytes[25], 6, "Portrait preserves RGBA transparency");
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.match(css, /\.studio-about-portrait \{[^}]*width: 100%;[^}]*height: auto;[^}]*object-fit: contain;/);
  assert.doesNotMatch(css, /\.studio-about-art[^{}]*\{[^}]*background:/);
});

test("homepage portrait responds to scrolling, springs to rest and respects visibility and reduced motion", async () => {
  const app = await fs.readFile("app.js", "utf8");
  const source = app.slice(app.indexOf("function initHomePortrait("), app.indexOf("function initHomeIllustrations("));
  let onVisibility;
  const events = {}, mediaEvents = {}, frames = new Map(), styles = new Map(), classes = new Set();
  let frameId = 0, time = 1000;
  const media = { matches: true, addEventListener(name, callback) { mediaEvents[name] = callback; } };
  const portrait = {
    parentElement: {},
    classList: { add(name) { classes.add(name); }, remove(name) { classes.delete(name); } },
    style: { setProperty(name, value) { styles.set(name, value); }, removeProperty(name) { styles.delete(name); } },
  };
  const context = vm.createContext({
    document: { querySelector(selector) { assert.equal(selector, ".studio-about-portrait"); return portrait; } },
    window: {
      scrollY: 0,
      matchMedia: () => media,
      addEventListener(name, callback, options) {
        events[name] = callback;
        if (name === "scroll") assert.equal(options.passive, true);
      },
      requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
      cancelAnimationFrame(id) { frames.delete(id); },
      IntersectionObserver: class {
        constructor(callback) { onVisibility = callback; }
        observe(element) { assert.equal(element, portrait.parentElement); }
      },
    },
  });
  const scroll = (position) => { context.window.scrollY = position; events.scroll(); };
  const advance = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    time += 1000 / 60;
    callbacks.forEach((callback) => callback(time));
    return parseFloat(styles.get("--portrait-tilt") || "0");
  };
  vm.runInContext(`${source}\ninitHomePortrait();`, context);
  scroll(120);
  assert.equal(frames.size, 0, "Offscreen scrolling does not animate");
  onVisibility([{ isIntersecting: true }]);
  assert.equal(frames.size, 0, "Visibility alone does not trigger a canned animation");
  scroll(240);
  assert.equal(classes.has("is-shaking"), true);
  assert.ok(advance() > 0, "Downward scrolling tilts clockwise");
  let peak = 0, rebounded = false;
  for (let i = 0; i < 200 && frames.size; i++) {
    const angle = advance();
    peak = Math.max(peak, Math.abs(angle));
    if (angle < -0.1) rebounded = true;
    assert.ok(Math.abs(angle) <= 10, "Shake stays within the 10-degree limit");
  }
  assert.ok(peak >= 5, "Shake must be clearly visible, not the previous two-degree sway");
  assert.ok(rebounded, "Spring overshoots instead of stopping abruptly");
  assert.equal(frames.size, 0, "Spring settles and stops requesting frames");
  assert.equal(classes.has("is-shaking"), false);
  assert.equal(styles.size, 0);
  scroll(120);
  assert.ok(advance() < 0, "Reversing scroll reverses the impulse");
  onVisibility([{ isIntersecting: false }]);
  assert.equal(frames.size, 0);
  assert.equal(styles.size, 0);
  onVisibility([{ isIntersecting: true }]);
  scroll(240);
  advance();
  media.matches = false;
  mediaEvents.change();
  assert.equal(frames.size, 0);
  assert.equal(styles.size, 0);
  scroll(360);
  assert.equal(frames.size, 0, "Reduced motion prevents scroll impulses");
  delete context.window.IntersectionObserver;
  assert.doesNotThrow(() => vm.runInContext("initHomePortrait();", context));
  const css = await fs.readFile("styles.css", "utf8");
  const motionRules = css.match(/@media \(prefers-reduced-motion: no-preference\) \{\s*\.studio-toy \{ animation: studio-enter[\s\S]*?\n\}/)[0];
  assert.match(motionRules, /\.studio-about-portrait\.is-shaking \{ transform: translateY\(var\(--portrait-lift, 0px\)\) rotate\(var\(--portrait-tilt, 0deg\)\);/);
  assert.doesNotMatch(css, /portrait-greet/);
});

test("homepage assembles Subway, Pho and coffee layers with accessible individual compositions", async () => {
  const { html } = await renderPage("work");
  const composition = html.match(/<figure class="studio-canvas">[\s\S]*?<\/figure>/)[0];
  assert.match(composition, /<figcaption class="subway-caption">Some experiences stay with you\. I draw mine\.<\/figcaption>/);
  assert.match(composition, /role="img" aria-label="Hand drawn NYC Subway composition/);
  assert.match(composition, /role="img" aria-label="Hand drawn Pho in Vietnam composition/);
  assert.match(composition, /data-name="Pho in Vietnam" hidden/);
  assert.match(composition, /role="img" aria-label="Hand drawn filter kaapi composition/);
  assert.match(composition, /data-name="Filter kaapi" hidden/);
  assert.equal((composition.match(/class="home-illustration"/g) || []).length, 3);
  assert.equal((composition.match(/<img\b/g) || []).length, 18);
  for (const layer of ["frame", "map", "train", "title", "notes"]) {
    const file = `/assets/home/subway-${layer}.png`;
    assert.ok(composition.includes(`src=".${file}" width="592" height="656" alt=""`));
    const response = await fetch(`${base}${file}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), 592);
    assert.equal(bytes.readUInt32BE(20), 656);
  }
  for (const layer of ["stool", "bowl", "chopsticks", "spark", "notes", "heart"]) {
    const file = `/assets/home/pho-${layer}.png`;
    assert.ok(composition.includes(`src=".${file}" width="728" height="720" alt=""`));
    const response = await fetch(`${base}${file}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), 728);
    assert.equal(bytes.readUInt32BE(20), 720);
  }
  for (const layer of ["base", "steam", "drips", "spark", "notes", "morning-note", "aroma-note"]) {
    const file = `/assets/home/coffee-${layer}.png`;
    assert.ok(composition.includes(`src=".${file}" width="704" height="696" alt=""`));
    const response = await fetch(`${base}${file}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), 704);
    assert.equal(bytes.readUInt32BE(20), 696);
    assert.equal(bytes[25], 6);
  }
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.illustration-layer \{ animation: subway-assemble 1000ms/);
  for (const [layer, delay] of [["steam", 140], ["drips", 280], ["spark", 380], ["notes", 500], ["morning-note", 550], ["aroma-note", 600]]) {
    assert.ok(css.includes(`.coffee-${layer} { animation-delay: ${delay}ms; }`));
  }
  assert.doesNotMatch(html, /illustration-pause|Pause illustration loop|Play illustration loop/);
  assert.match(html, /class="illustration-next"/);
  assert.doesNotMatch(composition, /studio-stage|studio-piece|<button/);
});

test("homepage illustration loop wraps, pauses and supports manual reduced-motion navigation", async () => {
  const app = await fs.readFile("app.js", "utf8");
  const source = app.slice(app.indexOf("function initHomeIllustrations("), app.indexOf("function initDoodleCursor("));
  const events = {};
  const documentEvents = {};
  const mediaEvents = {};
  const slides = [
    { hidden: false, dataset: { name: "NYC Subway" } },
    { hidden: true, dataset: { name: "Pho in Vietnam" } },
    { hidden: true, dataset: { name: "Filter kaapi" } },
  ];
  const control = () => ({
    hidden: true, textContent: "", events: {}, attributes: {},
    addEventListener(name, callback) { this.events[name] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
  });
  const controls = control(), next = control(), status = control();
  const children = { ".illustration-controls": controls, ".illustration-next": next, ".illustration-status": status };
  const gallery = {
    querySelectorAll: () => slides, querySelector: (selector) => children[selector],
    addEventListener: (name, callback) => { events[name] = callback; },
    contains: (element) => element === next,
  };
  const media = { matches: false, addEventListener: (name, callback) => { mediaEvents[name] = callback; } };
  const timers = new Map();
  let timerId = 0, observe;
  const document = {
    visibilityState: "visible", querySelector: () => gallery,
    addEventListener: (name, callback) => { documentEvents[name] = callback; },
  };
  const context = vm.createContext({
    document,
    window: {
      matchMedia: () => media,
      setTimeout: (callback, delay) => { assert.equal(delay, 2500); timers.set(++timerId, callback); return timerId; },
      clearTimeout: (id) => timers.delete(id),
      IntersectionObserver: class {
        constructor(callback) { observe = callback; }
        observe() {}
      },
    },
  });
  vm.runInContext(`${source}\ninitHomeIllustrations();`, context);
  const tick = () => {
    assert.equal(timers.size, 1);
    const callback = [...timers.values()][0];
    timers.clear();
    callback();
  };
  assert.equal(controls.hidden, false);
  assert.equal(timers.size, 0);
  observe([{ isIntersecting: true }]);
  tick();
  assert.deepEqual(slides.map((slide) => slide.hidden), [true, false, true]);
  tick();
  assert.deepEqual(slides.map((slide) => slide.hidden), [true, true, false]);
  tick();
  assert.deepEqual(slides.map((slide) => slide.hidden), [false, true, true]);
  assert.equal(status.textContent, "");
  events.pointerenter();
  assert.equal(timers.size, 0);
  events.pointerleave();
  assert.equal(timers.size, 1);
  next.events.click();
  assert.equal(status.textContent, "Illustration 2 of 3: Pho in Vietnam");
  assert.equal(timers.size, 1);
  events.focusin();
  assert.equal(timers.size, 0);
  events.focusout({ relatedTarget: null });
  assert.equal(timers.size, 1);
  media.matches = true;
  mediaEvents.change();
  assert.equal(timers.size, 0);
  next.events.click();
  assert.deepEqual(slides.map((slide) => slide.hidden), [true, true, false]);
  assert.equal(status.textContent, "Illustration 3 of 3: Filter kaapi");
  next.events.click();
  assert.deepEqual(slides.map((slide) => slide.hidden), [false, true, true]);
  assert.equal(status.textContent, "Illustration 1 of 3: NYC Subway");
  assert.equal(timers.size, 0);
  media.matches = false;
  mediaEvents.change();
  assert.equal(timers.size, 1);
  document.visibilityState = "hidden";
  documentEvents.visibilitychange();
  assert.equal(timers.size, 0);
  document.visibilityState = "visible";
  documentEvents.visibilitychange();
  assert.equal(timers.size, 1);
  observe([{ isIntersecting: false }]);
  assert.equal(timers.size, 0);
});

test("flower-in-hand cursor preserves transparency and native accessibility fallbacks", async () => {
  const response = await fetch(`${base}/assets/home/flower-hand-cursor.png`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.readUInt32BE(16), 64);
  assert.equal(bytes.readUInt32BE(20), 64);
  assert.equal(bytes[25], 6);
  const dotsResponse = await fetch(`${base}/assets/home/flower-cursor-dots.png`);
  assert.equal(dotsResponse.status, 200);
  assert.equal(dotsResponse.headers.get("content-type"), "image/png");
  const dotsBytes = Buffer.from(await dotsResponse.arrayBuffer());
  assert.equal(dotsBytes.readUInt32BE(16), 458);
  assert.equal(dotsBytes.readUInt32BE(20), 224);
  assert.equal(dotsBytes[25], 6);
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\) \{\s*body \{ cursor: url\("\.\/assets\/home\/flower-hand-cursor\.png\?v=bright"\) 34 2, auto; \}/);
  assert.match(css, /cursor: url\("\.\/assets\/home\/flower-hand-cursor\.png\?v=bright"\) 34 2, pointer;/);
  assert.doesNotMatch(css, /doodle-cursor-(?:arrow|yellow|white)/);
  assert.match(css, /\[contenteditable="true"\] \{\s*cursor: text;/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\) and \(prefers-reduced-motion: no-preference\)/);
  assert.match(css, /\.doodle-cursor \{[^}]*pointer-events: none;/);
  assert.match(css, /transform-origin: 34px 2px;/);
  assert.match(css, /body\.doodle-cursor-active \.fox-evidence a,[^}]*cursor: zoom-in;/);
  assert.match(css, /\.doodle-cursor\.is-hovering img \{[^}]*scale\(1\.15\)/);
  assert.match(css, /\.doodle-cursor\.is-pressed img \{[^}]*scale\(0\.9\)/);
  assert.match(css, /\.cursor-burst \{[^}]*pointer-events: none;[^}]*animation: flower-burst 650ms ease-out both;/);
});

test("flower cursor loads before activation and preserves hover, press, text and reduced-motion behavior", async () => {
  const app = await fs.readFile("app.js", "utf8");
  const source = app.slice(app.indexOf("function initDoodleCursor("));
  const events = {}, frames = new Map(), errors = [], created = [];
  let frameId = 0;
  const media = () => ({ matches: true, events: {}, addEventListener(name, callback) { this.events[name] = callback; } });
  const pointer = media(), motion = media();
  class CursorElement {
    constructor() {
      this.children = [];
      this.events = {};
      this.classes = new Set();
      this.classList = {
        add: (name) => this.classes.add(name),
        remove: (name) => this.classes.delete(name),
        toggle: (name, enabled) => enabled ? this.classes.add(name) : this.classes.delete(name),
      };
      this.style = { setProperty(name, value) { this[name] = value; } };
    }
    append(element) { this.children.push(element); element.parentElement = this; }
    remove() {
      if (this.parentElement) this.parentElement.children = this.parentElement.children.filter((child) => child !== this);
      this.parentElement = null;
    }
    cloneNode() {
      const clone = new CursorElement();
      for (const name of ["src", "alt", "width", "height", "aria-hidden"]) clone[name] = this[name];
      return clone;
    }
    setAttribute(name, value) { this[name] = value; }
    addEventListener(name, callback) { this.events[name] = callback; }
    closest() { return this.link ? this : null; }
  }
  const body = new CursorElement();
  const context = vm.createContext({
    Element: CursorElement,
    document: { body, createElement() { const element = new CursorElement(); created.push(element); return element; } },
    console: { error: (message) => errors.push(message) },
    window: {
      matchMedia: (query) => query.includes("pointer: fine") ? pointer : motion,
      getComputedStyle: (element) => ({ cursor: element.nativeCursor || 'url("flower-hand-cursor.png") 34 2, auto' }),
      addEventListener(name, callback) { events[name] = callback; },
      requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
      cancelAnimationFrame(id) { frames.delete(id); },
    },
  });
  vm.runInContext(source, context);
  const cursor = body.children[0], image = cursor.children[0];
  assert.equal(cursor["aria-hidden"], "true");
  assert.equal(image.src, "./assets/home/flower-hand-cursor.png?v=bright");
  assert.equal(image.width, 64);
  assert.equal(image.height, 64);
  const target = new CursorElement();
  target.link = true;
  const event = { pointerType: "mouse", button: 0, detail: 1, clientX: 100, clientY: 120, target };
  const dots = created.find((element) => element.src === "./assets/home/flower-cursor-dots.png?v=bright");
  const bursts = () => body.children.filter((element) => element.className === "cursor-burst");
  const flush = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback());
  };
  events.pointermove(event);
  assert.equal(frames.size, 0, "Native cursor remains until the artwork loads");
  image.events.load();
  events.pointerdown(event);
  assert.ok(cursor.classes.has("is-pressed"));
  flush();
  assert.equal(cursor.style.transform, "translate3d(66px, 118px, 0)");
  assert.equal(cursor.hidden, false);
  assert.ok(body.classes.has("doodle-cursor-active"));
  assert.ok(cursor.classes.has("is-hovering"));
  events.pointerup();
  assert.equal(cursor.classes.has("is-pressed"), false);
  events.click(event);
  assert.equal(bursts().length, 0, "Dots preload before click bursts appear");
  dots.events.load();
  events.click(event);
  events.click(event);
  assert.equal(bursts().length, 2, "Repeated clicks produce independent bursts");
  assert.equal(bursts()[0].src, dots.src);
  assert.equal(bursts()[0]["aria-hidden"], "true");
  assert.equal(bursts()[0].style.left, "52px");
  assert.equal(bursts()[0].style.top, "90px");
  bursts()[0].events.animationend();
  assert.equal(bursts().length, 1);
  bursts()[0].events.animationcancel();
  assert.equal(bursts().length, 0);
  for (let i = 0; i < 20; i++) events.click(event);
  assert.equal(bursts().length, 12, "Rapid clicks cannot accumulate unlimited DOM nodes");
  events.blur();
  assert.equal(bursts().length, 0);
  for (const override of [{ detail: 0 }, { pointerType: "touch" }, { button: 1 }, { button: 2 }]) {
    events.click({ ...event, ...override });
    assert.equal(bursts().length, 0);
  }
  for (const nativeCursor of ["text", "zoom-in"]) {
    target.nativeCursor = nativeCursor;
    events.pointermove(event);
    assert.equal(cursor.hidden, true, nativeCursor);
    assert.equal(body.classes.has("doodle-cursor-active"), false);
    events.click(event);
    assert.equal(bursts().length, 0, nativeCursor);
  }
  target.nativeCursor = "";
  events.pointermove(event);
  flush();
  events.click(event);
  assert.equal(bursts().length, 1);
  motion.matches = false;
  motion.events.change();
  events.pointermove(event);
  assert.equal(cursor.hidden, true);
  assert.equal(frames.size, 0, "Reduced motion uses only the static native cursor");
  assert.equal(bursts().length, 0);
  events.click(event);
  assert.equal(bursts().length, 0, "Reduced motion disables new bursts");
  motion.matches = true;
  events.pointermove({ ...event, pointerType: "touch" });
  assert.equal(frames.size, 0);
  events.pointermove(event);
  flush();
  events.scroll();
  assert.equal(cursor.hidden, true);
  events.pointermove(event);
  flush();
  events.click(event);
  assert.equal(bursts().length, 1);
  dots.events.error();
  assert.equal(bursts().length, 0);
  assert.equal(cursor.hidden, false, "Dots failure does not disable the flower cursor");
  events.click(event);
  assert.equal(bursts().length, 0);
  image.events.error();
  assert.equal(cursor.hidden, true);
  assert.equal(errors.length, 2);
  events.pointermove(event);
  assert.equal(frames.size, 0, "A failed image restores the native fallback");
  pointer.matches = false;
  pointer.events.change();
  assert.equal(cursor.hidden, true);
});

test("all pages share a subtle light dot-grid background without an overlay", async () => {
  const css = await fs.readFile("styles.css", "utf8");
  const shared = css.match(/body\[data-page\] \{([^}]+)\}/)[1];
  assert.match(shared, /--cp-dot: color-mix\(in srgb, var\(--cp-text\) 22%, var\(--cp-bg\)\);/);
  assert.match(shared, /background-image: radial-gradient\(circle, var\(--cp-dot\) 1px, var\(--cp-bg\) 1\.2px\);/);
  assert.match(shared, /background-size: 28px 28px;/);
  for (const page of ["index", "about", "playground", "project"]) {
    const html = await fs.readFile(`${page}.html`, "utf8");
    assert.match(html, /<body data-page="[^"]+">/);
    assert.match(html, /href="\.\/styles\.css"/);
  }
});

test("all pages share the reference palette, readable type scale, and local Sora font", async () => {
  const css = await (await fetch(`${base}/styles.css`)).text();
  const palette = css.match(/body\[data-page\] \{([^}]+)\}/)[1];
  for (const color of ["#0b1834", "#ff8a3d", "#ffc629", "#f5a3c7"]) {
    assert.ok(palette.includes(color), color);
  }
  assert.doesNotMatch(css, /data-theme="dark"|color-scheme:\s*dark/);
  assert.doesNotMatch(palette, /#(?:00a896|007f75|00675f|58d9c3|76e9d4|61e0c9|2f6bff|91b1ff|ff6b58)\b/i);
  assert.match(palette, /--cp-blue: var\(--cp-midnight\)/);
  assert.match(palette, /--cp-coral: var\(--cp-orange\)/);
  assert.match(css, /:root \{[^}]+--cp-accent: #b11f4b;/);
  assert.doesNotMatch(css, /body\[data-page="work"\]/);
  for (const token of ["--cp-font-display: clamp(36px, 4.24vw, 61px)", "--cp-font-title: 40px", "--cp-font-body: 20px", "--cp-font-ui: 18px", "--cp-font-meta: 16px"]) {
    assert.ok(css.includes(token), token);
  }
  assert.match(css, /font-display: swap/);
  const font = await fetch(`${base}/assets/fonts/sora-variable.ttf`);
  assert.equal(font.status, 200);
  assert.equal(font.headers.get("content-type"), "font/ttf");
  assert.equal(new DataView(await font.arrayBuffer()).getUint32(0), 0x00010000);
  const license = await fetch(`${base}/assets/fonts/OFL.txt`);
  assert.equal(license.status, 200);
  assert.match(await license.text(), /SIL OPEN FONT LICENSE/);
  assert.equal((await fetch(`${base}/assets/fonts/unlisted.ttf`)).status, 404);
});

test("pages omit decorative captions and editing instructions", async () => {
  for (const page of ["work", "about", "playground"]) {
    const { html, elements } = await renderPage(page);
    assert.doesNotMatch(html, /Remix composition|Composition 1 of 3|Original illustration, not a portrait|Portrait coming soon|Curated prompts|Add your background|Then share something/);
    assert.doesNotMatch(elements.get("#site-footer").innerHTML, /Add your email|GOOD THINGS START|A work in progress/);
  }
});

test("FOX follows Problem, Insight, Solution while retaining metrics and supporting detail", async () => {
  const { html, title } = await renderPage("project", "?project=fox-icons&scoutTheme=dark");
  assert.equal(title, "FOX Icons · Office icon system · Your Name");
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  const chapters = [...html.matchAll(/<section id="([^"]+)" class="[^"]*\bfox-chapter\b[^"]*"/g)];
  assert.deepEqual(chapters.map(([, id]) => id), ["problem", "insight", "solution"]);
  const nav = html.match(/<nav class="fox-chapters"[\s\S]*?<\/nav>/)[0];
  assert.deepEqual([...nav.matchAll(/href="#([^"]+)"><span>\d+<\/span>([^<]+)/g)].map(([, id, label]) => [id, label]), [
    ["problem", "Problem"], ["insight", "Insight"], ["solution", "Solution"],
  ]);
  const problem = html.match(/<section id="problem"[\s\S]*?<\/section>/)[0];
  const insight = html.match(/<section id="insight"[\s\S]*?<\/section>/)[0];
  assert.match(problem, /id="research"|research-overview\.png/);
  assert.doesNotMatch(problem, /fox-equation|Earlier iPad feedback/);
  assert.match(problem, /Office looked dated, and its crowded command UI made tools harder to find and prioritize/);
  assert.match(problem, /My scope was the icon layer: visual hierarchy, recognition, and consistency, not command architecture/);
  assert.match(insight, /Rebuilding Office web apps from the core gave us an opportunity to test new icons/);
  assert.match(insight, /Earlier iPad feedback/);
  assert.match(insight, /fox-equation/);
  const solution = html.slice(html.indexOf('<section id="solution"'), html.indexOf("</article>"));
  for (const id of ["craft", "scale", "team", "alignment", "impact", "learning", "ownership"]) {
    assert.ok(solution.includes(`id="${id}"`), `Solution retains ${id}`);
  }
  for (const metric of ["5,000+", "30+", "+24 pts", "~60%", "20 ms", "229"]) {
    assert.ok(html.includes(metric), metric);
  }
  const preview = html.match(/<dl class="fox-hero-metrics">[\s\S]*?<\/dl>/)[0];
  assert.deepEqual([...preview.matchAll(/<dd>([^<]+)/g)].map((match) => match[1]), ["5,000+", "~60%", "20 ms"]);
  assert.match(preview, /icons created and redesigned/);
  assert.match(html, /FOX \(Fluent Office Crossover\)/);
  assert.doesNotMatch(preview, /HVS|Office web apps|icons \/ day/);
  assert.match(html, /At scale, the team produced 30\+ icons per day/);
  assert.doesNotMatch(html, /fox-notes|Project notes|Program-level outcomes await/);
  assert.doesNotMatch(html, /\+44%/);
  assert.match(html, /project=making-icons-searchable/);
  assert.doesNotMatch(html, /https:\/\/(?:loop|outlook|teams|microsoft|www\.office)/);
  for (const id of ["insight", "role", "stakeholders", "guidance", "localization", "system", "learning", "ownership"]) {
    assert.ok(html.includes(`id="${id}"`), `Legacy anchor: ${id}`);
  }
  assert.doesNotMatch(html, /<details\b|<summary\b|<select\b/);
  const primaryText = html.replace(/<svg\b[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, " ");
  const words = primaryText.trim().split(/\s+/).length;
  assert.ok(words < 1000, `Keep the primary story concise with full quotes and stakeholder decision evidence: ${words} words`);
});

test("chapter introductions group their headings and copy without section-sized gaps", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  const intros = [...html.matchAll(/<header class="fox-chapter-intro fox-reveal">[\s\S]*?<\/header>/g)].map((match) => match[0]);
  assert.equal(intros.length, 3);
  for (const [index, chapter] of ["problem", "insight", "solution"].entries()) {
    assert.ok(intros[index].includes(`id="${chapter}-heading"`));
  }
  assert.match(intros[0], /<\/h2>\s*<p>Office looked dated/);
  assert.equal((intros[1].match(/<p>/g) || []).length, 2);
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.match(css, /\.fox-chapter-intro \{ display: grid; gap: var\(--cp-space-copy\); \}/);
  assert.match(css, /\.fox-section \.fox-chapter-intro > h2 \{ margin: 0; \}/);
  assert.match(css, /\.fox-chapter-label \{ display: block; margin-bottom: 12px;/);
});

test("FOX ends before a separate more-work navigation region with explicit links", async () => {
  const { html } = await renderPage("project", "?project=fox-icons&scoutTheme=dark");
  assert.match(html, /<\/article>\s*<section class="fox-case-exit wrap" aria-labelledby="fox-exit-title">/);
  const exit = html.match(/<section class="fox-case-exit wrap"[\s\S]*?<\/section>/)[0];
  assert.match(exit, /END OF PROJECT/);
  assert.match(exit, /<h2 id="fox-exit-title">Explore more work\.<\/h2>/);
  assert.match(exit, /href="\.\/index\.html"/);
  assert.match(exit, /href="\.\/project\.html\?project=making-icons-searchable"/);
  assert.match(exit, /Next project: Making Icons searchable/);
  assert.equal((exit.match(/<a\b/g) || []).length, 2);
  assert.doesNotMatch(html, /class="next-project wrap"/);
  assert.doesNotMatch(exit, / hidden\b|<button\b|aria-expanded/);
});

test("impact and learning close the solution while keeping both closing anchors", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  const impact = html.match(/<section id="impact"[\s\S]*?<\/section>/)[0];
  assert.match(impact, /class="fox-section fox-conclusion"/);
  assert.match(impact, /fox-impact-metrics/);
  assert.match(impact, /suite wide changes, not icons alone/);
  assert.match(impact, /These results do not establish whether people found commands faster/);
  assert.match(impact, /<div id="learning" class="fox-closing fox-reveal">/);
  assert.match(impact, /<h3 id="ownership">A faster, well received Office experience/);
  assert.equal((impact.match(/<h2\b/g) || []).length, 1);
  const nav = html.match(/<nav class="fox-chapters"[\s\S]*?<\/nav>/)[0];
  assert.equal((nav.match(/<a\b/g) || []).length, 3);
  assert.match(nav, /href="#solution"><span>03<\/span>Solution/);
  assert.doesNotMatch(nav, /href="#impact"|href="#learning"|The learning/);
  assert.doesNotMatch(html, /<section id="learning"/);
});

test("About and Side Quests use the shared illustration language and concise content", async () => {
  for (const [page, search, motif] of [
    ["about", "", null], ["playground", "", null],
  ]) {
    const { html } = await renderPage(page, search);
    if (motif) assert.ok(html.includes(`data-motif="${motif}"`), `${page}${search}`);
    const text = html.replace(/<svg\b[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, " ");
    if (page === "playground") assert.ok(text.trim().split(/\s+/).length < 350, `Keep ${page}${search} concise`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
  }
});

test("navigation uses About and Side Quests with a direct Work section link", async () => {
  for (const page of ["work", "about", "playground", "project"]) {
    const { elements } = await renderPage(page, "?scoutTheme=dark");
    const header = elements.get("#site-header").innerHTML;
    assert.match(header, /Life and all/);
    assert.match(header, /About/);
    assert.doesNotMatch(header, /nav-spark/);
    assert.match(header, /href="\.\/index\.html#work"/);
    assert.doesNotMatch(header, />Resume<|>Playground /);
    assert.match(header, /about\.html/);
    assert.match(header, /playground\.html/);
  }
  const resume = await renderPage("about", "?scoutTheme=dark");
  assert.equal(resume.title, "About · Tanuja");
  assert.match(resume.html, /I'm Tanuja/);
  assert.doesNotMatch(resume.html, /Sample experience|Your current role|Company name|download=/);
  assert.match(resume.html, /playground\.html/);
  const quests = await renderPage("playground");
  assert.equal(quests.title, "Life and all · Your Name");
  assert.match(quests.html, /class="life-collage wrap"/);
  assert.doesNotMatch(quests.html, /id="type-size"|id="new-prompt"/);
  const home = await renderPage("work");
  assert.match(home.html, /A little about me/);
  assert.match(home.html, /Life and all/);
});

test("shared footer provides labeled social icon buttons and an email app link", async () => {
  for (const page of ["work", "about", "playground", "project"]) {
    const { elements } = await renderPage(page);
    const footer = elements.get("#site-footer").innerHTML;
    assert.doesNotMatch(footer, /Contact details coming soon/);
    assert.match(footer, /Vibe coded\. Designer approved\. Made with &lt;3/);
    assert.match(footer, /<\/svg>Email<\/a>[\s\S]*<\/svg>LinkedIn<\/a>[\s\S]*<\/svg>Instagram<\/a>/);
    assert.doesNotMatch(footer, /Your Name/);
    assert.equal((footer.match(/class="button contact-social-button"/g) || []).length, 3);
    assert.equal((footer.match(/aria-hidden="true" focusable="false"/g) || []).length, 3);
    assert.match(footer, /href="https:\/\/www\.linkedin\.com\/in\/tanuja-5b11091a0\/"/);
    assert.match(footer, /href="https:\/\/www\.instagram\.com\/tanuja_draws\/"/);
    assert.match(footer, /href="mailto:tanujamathur97@gmail\.com"/);
  }
});

test("About includes the supplied biography, interests and valid contact destinations", async () => {
  const { html } = await renderPage("about", "?scoutTheme=dark");
  assert.match(html, /soft spot for complicated problems, and making them feel simple/);
  for (const text of ["Product Designer at Microsoft", "College of Art, New Delhi", "NID Ahmedabad", "3.5 years", "Microsoft PowerPoint", "storyteller at heart", "Indian art, textiles, architecture", "Cooking elaborate meals", "Crocheting, embroidering", "Rearranging and decorating my home", "Illustrating the little things", "Most recently, swimming!", "25K people on", "Eat. Create. Explore. Craft. Chill. Sleep. Repeat."]) {
    assert.ok(html.includes(text), text);
  }
  assert.match(html, /href="https:\/\/www\.instagram\.com\/tanuja_draws\/" target="_blank" rel="noopener"/);
  assert.match(html, /href="mailto:tanujamathur97@gmail\.com"/);
  assert.match(html, /href="https:\/\/www\.linkedin\.com\/in\/tanuja-5b11091a0\/" target="_blank" rel="noopener"/);
  assert.match(html, /class="button about-quests-button" href="\.\/playground\.html"/);
  assert.doesNotMatch(html, /coming soon|Sample experience/i);
  assert.equal((html.match(/<li>/g) || []).length, 7);
  assert.match(html, /meaningful ways\.<\/p>\s*<div class="about-resume"><a class="button about-resume-button" href="\.\/assets\/about\/tanuja-resume-2026\.pdf" target="_blank" rel="noopener">Resume<\/a>/);
  assert.doesNotMatch(html, /about-resume-status|Resume will be available here/);
});

test("the supplied resume PDF is served intact with PDF content type", async () => {
  const response = await fetch(`${base}/assets/about/tanuja-resume-2026.pdf`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.toString("ascii", 0, 5), "%PDF-");
  assert.deepEqual(bytes, await fs.readFile("assets/about/tanuja-resume-2026.pdf"));
  const head = await fetch(`${base}/assets/about/tanuja-resume-2026.pdf`, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(Number(head.headers.get("content-length")), bytes.length);
});

test("About displays the supplied portrait without cropping", async () => {
  const { html } = await renderPage("about");
  assert.match(html, /class="about-photo"><img src="\.\/assets\/about\/about-display\.png" width="768" height="907"/);
  assert.match(html, /class="about-story-copy">\s*<header class="about-story-intro">/);
  assert.doesNotMatch(html, /page-heading-art|<section class="page-intro/);
  const response = await fetch(`${base}/assets/about/about-display.png`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.readUInt32BE(16), 768);
  assert.equal(bytes.readUInt32BE(20), 907);
});

test("FOX opens with two complete anonymous quotes highlighting command overload and hierarchy", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  assert.ok(html.indexOf('id="research"') < html.indexOf('class="fox-equation'));
  assert.equal((html.match(/class="fox-research-card fox-reveal"/g) || []).length, 2);
  assert.match(html, /02 \/ INSIGHT<\/span>Modernize Office\.<br><em>Keep it familiar\.<\/em><\/h2>/);
  assert.doesNotMatch(html, /fox-research-takeaway|fox-research-balance|The goal:|Still familiar\./);
  assert.match(html, /too many places to look for commands/);
  assert.match(html, /my attention is split/);
  assert.doesNotMatch(html, /I'd still recommend Excel over Sheets|complicated for nothing/);
  assert.doesNotMatch(html, /Too much to scan|Competing signals|Power still matters|DESIGN IMPLICATION/);
  assert.equal((html.match(/<figcaption class="sr-only">Anonymous/g) || []).length, 2);
  assert.equal((html.match(/From user interviews/g) || []).length, 1);
  assert.match(html, /<\/figure><\/div>\s*<p class="fox-research-attribution">From user interviews<\/p>/);
  const research = [...html.matchAll(/<figure class="fox-research-card fox-reveal">[\s\S]*?<\/figure>/g)].map((match) => match[0]).join("");
  const quotes = [...research.matchAll(/<blockquote><p>“([\s\S]*?)”<\/p><\/blockquote>/g)].map((match) => match[1].replace(/<\/?mark>/g, ""));
  assert.equal(quotes.length, 2);
  assert.equal(quotes[0], "There are too many places to look for commands, that makes me feel overwhelmed and inadequate finding what I need.");
  assert.equal(quotes[1], "I have trouble finding things because the toolbar is cluttered...some of the icons are bigger than the rest of the options. There are two different sizes that I have to get through, it's a little harder to skim through than a uniform list... Color draws my eye. With the amount of color, my attention is split, I don't know what is more important than anything else, then I need to read the labels.");
  assert.deepEqual([...research.matchAll(/<mark>([^<]+)<\/mark>/g)].map((match) => match[1]), [
    "too many places to look for commands", "overwhelmed and inadequate",
    "toolbar is cluttered", "my attention is split",
    "I don't know what is more important than anything else",
  ]);
  const css = await (await fetch(`${base}/styles.css`)).text();
  assert.match(css, /\.fox-research-signals \{ display: grid; grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(css, /\.fox-research-card mark \{ background: var\(--cp-mustard-soft\); color: inherit; font-weight: 650; \}/);
  assert.doesNotMatch(research, /…|line-clamp|text-overflow/);
  assert.doesNotMatch(research, /<img\b|\bP\d{2}\b|\bAge \d+/);
  assert.doesNotMatch(html.match(/<figure class="fox-hero-art[\s\S]*?<\/figure>/)[0], /<figcaption/);
  const diagram = html.match(/<figure class="fox-leadership-graph[\s\S]*?<\/figure>/)[0];
  assert.deepEqual([...diagram.matchAll(/<strong>([^<]+)<\/strong>/g)].map((match) => match[1]), [
    "Lead production. Drive quality. Expand FOX.", "Design production", "Engineering partners",
  ]);
  assert.match(diagram, /MY ROLE \/ CROSS APP OWNERSHIP/);
  assert.match(html, /aligned with Fluent \/ OPG partners and engineering stakeholders/);
  assert.match(html, /I set icon specifications and reviewed designs across Excel, Word, PowerPoint, and OneNote/);
  assert.match(html, /I led icon production, quality, and expansion across four Office web apps with FOX \(Fluent Office Crossover\)/);
  assert.doesNotMatch(diagram, /Icon craft · Quality reviews · Cross-app expansion/);
  const ending = html.match(/<div id="learning" class="fox-closing fox-reveal">[\s\S]*?<\/div>/)[0];
  assert.match(ending, /<h3 id="ownership">A faster, well received Office experience\.<br><em>A shared system other teams could build on\.<\/em><\/h3>/);
  assert.doesNotMatch(ending, /My takeaway|Next, I would|command-finding tests|<p>/);
  assert.doesNotMatch(ending, /Regular reviews aligned|proved|confirmed faster command discovery/);
  assert.doesNotMatch(ending, /fox-flow|Design the system|My ownership spanned|better-liked|more liked/);
  assert.doesNotMatch(html.replace(/<[^>]+>/g, ""), /leadership/i);
  assert.doesNotMatch(html, /MY ROLE \/ POWERPOINT|I owned the PowerPoint workflow|small production pod/);
  const { html: home } = await renderPage("work");
  assert.match(home, /Leading icon production, quality, and FOX expansion across Office web apps/);
});

test("newsletter evidence adds rollout, team automation and self-serve adoption without overstating ownership", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  assert.match(html, /scale across Office web/);
  assert.match(html, /Office web apps/);
  assert.doesNotMatch(html, />Windows<|>Mac<|Production partner 0[12]/);
  for (const [id, label, cards] of [
    ["rollout", "Pilot to rollout", 3],
    ["automation", "Team built automation", 4],
    ["adoption", "Self serve icon adoption", 3],
  ]) {
    const story = html.match(new RegExp(`<div class="fox-program-story" id="${id}">[\\s\\S]*?<\\/(?:ol|ul)>\\s*<\\/div>`))[0];
    assert.ok(story.includes(`aria-label="${label}"`), id);
    if (id === "adoption") assert.match(story, /OneNote adopted FOX icons/);
    if (id === "rollout") {
      assert.match(story, /<span>OneNote<\/span>/);
      assert.doesNotMatch(story, /OneNote adopted FOX icons/);
    }
    assert.equal((story.match(/class="fox-story-card fox-reveal"/g) || []).length, cards, id);
    assert.doesNotMatch(story, /<button\b|<input\b|<details\b|\shidden(?:[\s=>])|aria-expanded/);
    const words = story.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
    assert.ok(words < 60, `Keep ${id} visual and concise: ${words} words`);
  }
  for (const evidence of [
    "Excel pilot", "Home", "Review", "Task time", "FY24", "6 to 7 months",
    "RTL flip plugin", "Merge locale variants", "Swap icons in Figma", "Icons PR Bot",
    "Tools built with shared engineering and partner teams.",
    "Keywords", "Metadata", "Wiki", "Tutorials", "Create independently", "Create + ship",
    "The wider program involved three design vendor partners.",
    "Office hours", "Weekly triage", "Bug bashes", "Milestone checks",
    "Usage · Surveys · Performance", "Earlier iPad feedback",
    "contextual tabs", "A week of fixes tightened review.",
  ]) assert.ok(html.includes(evidence), evidence);
  const impact = html.match(/<section id="impact"[\s\S]*?<\/section>/)[0];
  assert.match(impact, /Suite HVS benchmark/);
  assert.match(impact, /Reported FY24 program results/);
  assert.match(impact, /HVS \(high value scenarios\) reached 79%; the gain reflects suite wide changes, not icons alone/);
  assert.doesNotMatch(impact, /<img\b|updated-office-ribbons/);
  assert.doesNotMatch(html, /\+44%|10B\/month|262M|NPS/);
});

test("Add Note compares three actual assets on their original 16-pixel component canvases", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  const variants = [
    ["offui-add-note-16.svg", "741:51811", 16],
    ["fluent-note-add-16-regular.svg", "13374:336", 14],
    ["fox-add-note-16.svg", "1253:1852", 16],
  ];
  assert.equal((html.match(/class="fox-icon-variant"/g) || []).length, 3);
  const comparison = [...html.matchAll(/<figure class="fox-icon-variant"[\s\S]*?<\/figure>/g)].map((match) => match[0]).join("");
  assert.doesNotMatch(comparison, /fox-native-row|fox-native-preview|fox-source-canvas|16 px|4× above/);
  assert.deepEqual([...comparison.matchAll(/<figcaption><strong>([^<]+)<\/strong><\/figcaption>/g)].map((match) => match[1]), [
    "Legacy OFFUI", "Fluent", "FOX",
  ]);
  for (const [file, node, size] of variants) {
    assert.ok(html.includes(`data-source-node="${node}"`), node);
    assert.equal(comparison.split(`src="./assets/fox/${file}"`).length - 1, 1, file);
    const response = await fetch(`${base}/assets/fox/${file}`);
    assert.equal(response.status, 200, file);
    assert.equal(response.headers.get("content-type"), "image/svg+xml; charset=utf-8");
    const svg = await response.text();
    assert.ok(svg.length > 100, file);
    const root = svg.match(/<svg\b[^>]*>/)?.[0];
    assert.ok(root, file);
    assert.match(root, new RegExp(`\\bwidth="${size}"`), file);
    assert.match(root, new RegExp(`\\bheight="${size}"`), file);
  }
  assert.doesNotMatch(html, /https:\/\/www\.figma\.com\/api\/mcp\/asset/);
  assert.equal((await fetch(`${base}/assets/fox/unlisted.svg`)).status, 404);
});

test("the motion study compares six original OFFUI and FOX pairs without controls", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  const craft = html.match(/<section id="craft"[\s\S]*?<\/section>/)[0];
  const study = craft.slice(craft.indexOf('<div class="fox-motion-study"'), craft.indexOf('<div class="fox-before-after"'));
  assert.match(study, /The most fun part/);
  assert.match(study, /Simple, but still literal/);
  assert.equal((study.match(/class="fox-motion-card fox-reveal"/g) || []).length, 6);
  assert.equal((study.match(/class="fox-motion-original"/g) || []).length, 6);
  assert.equal((study.match(/class="fox-motion-icon"/g) || []).length, 6);
  assert.equal((study.match(/class="fox-motion-key"/g) || []).length, 2);
  assert.doesNotMatch(study, /<button\b|<details\b|\shidden(?:[\s=>])|tabindex=/);
  const studyWords = study.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  assert.ok(studyWords < 25, `Keep the new visual study concise: ${studyWords} words`);
  for (const [file, effect, node, originalNode] of [
    ["animation-fade", "fade", "3604:1533", "741:120369"],
    ["animation-fly-in", "fly-in", "3604:1535", "741:122380"],
    ["animation-spin", "spin", "3608:989", "741:122430"],
    ["transition-push", "push", "3396:738", "741:122190"],
    ["transition-wipe", "wipe", "3397:804", "741:120856"],
    ["transition-split", "split", "3397:874", "741:122443"],
  ]) {
    assert.ok(study.includes(`data-effect="${effect}" data-source-node="${node}"`), file);
    const card = study.match(new RegExp(`<li class="fox-motion-card[^>]+data-effect="${effect}"[\\s\\S]*?<\\/li>`))[0];
    assert.ok(card.includes(`data-source-node="${originalNode}"`), file);
    assert.ok(card.indexOf(`offui-${file}-32.svg`) < card.indexOf(`/${file}-48.svg`), file);
    for (const [asset, size] of [[`${file}-48.svg`, 48], [`offui-${file}-32.svg`, 32]]) {
      assert.ok(card.includes(`src="./assets/fox/${asset}"`), asset);
      const response = await fetch(`${base}/assets/fox/${asset}`);
      assert.equal(response.status, 200, asset);
      assert.equal(response.headers.get("content-type"), "image/svg+xml; charset=utf-8");
      const svg = await response.text();
      assert.match(svg, new RegExp(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"`));
      assert.match(svg, /<path\b/);
      assert.doesNotMatch(svg, /<script\b|<foreignObject\b|https:\/\/www\.figma\.com\/api/);
      assert.equal((await fetch(`${base}/assets/fox/${asset}`, { method: "HEAD" })).status, 200);
    }
  }
  const css = await (await fetch(`${base}/styles.css`)).text();
  const motion = css.match(/@media \(prefers-reduced-motion: no-preference\) \{\n  \.fox-motion-card[\s\S]*?\n\}/)[0];
  assert.doesNotMatch(motion, /infinite/);
  for (const name of ["fade", "fly", "spin", "push", "wipe", "split"]) {
    assert.ok(motion.includes(`@keyframes fox-motion-${name}`), name);
  }
});

test("research overview displays and links to the complete uncropped source slide", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  assert.doesNotMatch(html, /command-grouping-analysis\.png|user-research-verbatims\.png|loop-creation-guide\.png|updated-office-ribbons\.png/);
  for (const [chapter, file, width, height] of [
    ["problem", "research-overview.png", 1306, 768],
  ]) {
    const section = html.match(new RegExp(`<section id="${chapter}"[\\s\\S]*?<\\/section>`))[0];
    const figure = section.match(/<figure class="fox-evidence">[\s\S]*?<\/figure>/)[0];
    assert.ok(figure.includes(`href="./assets/fox/${file}"`), file);
    assert.ok(figure.includes(`src="./assets/fox/${file}"`), file);
    assert.ok(figure.includes(`width="${width}" height="${height}"`), file);
    assert.match(figure, /aria-label="Open [^"]+ at full size"/);
    assert.match(figure, /loading="lazy" decoding="async" alt="[^"]+"/);
    assert.doesNotMatch(figure, /<figcaption/);
    const response = await fetch(`${base}/assets/fox/${file}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), width);
    assert.equal(bytes.readUInt32BE(20), height);
    const head = await fetch(`${base}/assets/fox/${file}`, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(head.headers.get("content-type"), "image/png");
    assert.equal(await head.text(), "");
  }
  for (const original of ["user-research-verbatims.png", "loop-creation-guide.png"]) {
    assert.equal((await fetch(`${base}/assets/fox/${original}`)).status, 404);
    await assert.rejects(fs.access(`${__dirname}/assets/fox/${original}`), { code: "ENOENT" });
  }
  assert.equal((await fetch(`${base}/assets/fox/unlisted.png`)).status, 404);
});

test("solution shows the pixel-level trade-off and stakeholder decision with original evidence", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  const craft = html.match(/<section id="craft"[\s\S]*?<\/section>/)[0];
  const decision = craft.slice(craft.indexOf('id="pixel-decisions"'), craft.indexOf('id="new-icon-craft"'));
  assert.match(decision, /Every pixel mattered/);
  assert.match(decision, /square shapes had 3px padding for optical balance; other shapes had 2px/);
  assert.match(decision, /complex PowerPoint, Excel, and Word icons/);
  assert.match(decision, /I helped compare iterations and build stakeholder agreement on <strong>2px padding for square shapes<\/strong>/);
  assert.match(decision, /thicker details, including the magnifying glass/);
  assert.match(decision, /prioritized legibility over strict optical balance/);
  assert.match(decision, /Both icons use a 20px canvas/);
  assert.doesNotMatch(decision, /50%|measured|tested with users/);
  assert.match(decision, /href="\.\/assets\/fox\/pixel-padding-comparison\.png"/);
  assert.match(decision, /width="1650" height="722" loading="lazy" decoding="async"/);
  const response = await fetch(`${base}/assets/fox/pixel-padding-comparison.png`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.readUInt32BE(16), 1650);
  assert.equal(bytes.readUInt32BE(20), 722);
});

test("craft covers new icons and existing-design approval with real exploration images", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  const craft = html.match(/<section id="craft"[\s\S]*?<\/section>/)[0];
  const study = craft.slice(craft.indexOf('id="new-icon-craft"'), craft.indexOf('id="motion-study"'));
  assert.match(study, /Not every icon was a redraw/);
  assert.match(study, /created icons from scratch, refined older designs, and reviewed existing icons for approval/);
  assert.match(study, /including Excel's complex features/);
  assert.match(study, /<figcaption>Brush: experimental versus Fluent, compared in Excel's Format as Table command\.<\/figcaption>/);
  assert.match(study, /<figcaption>Paint bucket: the proposed variant was approved in response to legibility and color emphasis feedback\.<\/figcaption>/);
  assert.match(study, /<figcaption>Reapply Filter: flagged during accessibility testing, with modifier variants compared at pixel level\.<\/figcaption>/);
  assert.doesNotMatch(study, /\bshipped\b|\bfinal\b|<button|<details/);
  for (const [file, width] of [["brush-exploration.png", 1767], ["paint-bucket-exploration.png", 1820], ["reapply-filter-accessibility.png", 1867]]) {
    assert.ok(study.includes(`href="./assets/fox/${file}"`));
    assert.ok(study.includes(`src="./assets/fox/${file}" width="${width}" height="768"`));
    const response = await fetch(`${base}/assets/fox/${file}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), width);
    assert.equal(bytes.readUInt32BE(20), 768);
  }
});

test("FOX uses the supplied banner above its opening metrics without cropping", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  const hero = html.match(/<figure class="fox-hero-art[\s\S]*?<\/figure>/)[0];
  assert.match(hero, /src="\.\/assets\/fox\/fox-ribbon-banner.png" width="2440" height="544" fetchpriority="high"/);
  assert.doesNotMatch(hero, /fox-icon-wall|fox-hero-word|loading="lazy"/);
  assert.ok(hero.indexOf("fox-ribbon-banner.png") < hero.indexOf('class="fox-hero-metrics"'));
  const response = await fetch(`${base}/assets/fox/fox-ribbon-banner.png`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.readUInt32BE(16), 2440);
  assert.equal(bytes.readUInt32BE(20), 544);
});

test("owner-created specs and Loop guide show real artifacts in the relevant chapters", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  for (const [chapter, id, file, width, height] of [
    ["scale", "icon-specs", "icon-creation-specs.png", 1730, 768],
    ["alignment", "creation-guide", "loop-creation-guide-hires.png", 2048, 1152],
  ]) {
    const section = html.match(new RegExp(`<section id="${chapter}"[\\s\\S]*?<\\/section>`))[0];
    const figure = section.match(new RegExp(`<figure class="fox-document fox-reveal" id="${id}">[\\s\\S]*?<\\/figure>`))[0];
    assert.ok(figure.includes(`href="./assets/fox/${file}"`));
    assert.ok(figure.includes(`src="./assets/fox/${file}" width="${width}" height="${height}"`));
    assert.match(figure, /loading="lazy" decoding="async" alt="[^"]+"/);
    assert.match(figure, /<figcaption>[^<]+I created[^<]+<\/figcaption>/);
    const response = await fetch(`${base}/assets/fox/${file}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), width);
    assert.equal(bytes.readUInt32BE(20), height);
  }
});

test("high-resolution Original and FOX ribbons are readable without switches or horizontal swipes", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  const craft = html.match(/<section id="craft"[\s\S]*?<\/section>/)[0];
  assert.equal((craft.match(/class="fox-app-comparison fox-reveal"/g) || []).length, 6);
  assert.equal((craft.match(/class="fox-comparison-phase"/g) || []).length, 2);
  assert.ok(craft.includes('<h3 id="fox-ribbons-before">Original</h3>'));
  assert.ok(craft.includes('<h3 id="fox-ribbons-after">FOX</h3>'));
  assert.doesNotMatch(craft, /<button\b|data-fox-version| hidden\b/);
  for (const [slug, name] of [["powerpoint", "PowerPoint"], ["word", "Word"], ["excel", "Excel"]]) {
    assert.ok(craft.indexOf(`${slug}-before.png`) < craft.indexOf(`${slug}-after.png`));
    for (const state of ["Before", "After"]) {
      const file = `${slug}-${state.toLowerCase()}.png`;
      const version = state.toLowerCase();
      const label = state === "Before" ? "Original" : "FOX";
      const pair = craft.match(new RegExp(`<figure class="fox-evidence fox-ribbon-panel" id="fox-${slug}-${version}">[\\s\\S]*?<\\/figure>`))[0];
      assert.ok(pair.includes(`<figcaption class="sr-only">${name} · ${label}</figcaption>`));
      assert.ok(pair.includes(`href="./assets/fox/${file}"`));
      assert.equal((pair.match(/class="fox-ribbon-strip"/g) || []).length, 3);
      assert.match(pair, /class="fox-ribbon-strips" aria-hidden="true"/);
      for (const offset of ["0%", "-85%", "-170%"]) {
        assert.ok(pair.includes(`--fox-ribbon-offset: ${offset}`));
      }
      const crop = `${slug}-${version}-ribbon.png`;
      assert.ok(pair.includes(`src="./assets/fox/${crop}" width="4050" height="408" loading="lazy" decoding="async" alt="${name} ${label} ribbon.`));
      const croppedResponse = await fetch(`${base}/assets/fox/${crop}`);
      assert.equal(croppedResponse.status, 200);
      assert.equal(croppedResponse.headers.get("content-type"), "image/png");
      const croppedBytes = Buffer.from(await croppedResponse.arrayBuffer());
      assert.equal(croppedBytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
      assert.equal(croppedBytes.readUInt32BE(16), 4050);
      assert.equal(croppedBytes.readUInt32BE(20), 408);
      assert.ok(croppedBytes.readUInt32BE(16) >= 3 * 1000, "Provide at least 3x detail for a 1000px ribbon preview");
      const croppedHead = await fetch(`${base}/assets/fox/${crop}`, { method: "HEAD" });
      assert.equal(croppedHead.status, 200);
      assert.equal(croppedHead.headers.get("content-type"), "image/png");
      assert.equal(await croppedHead.text(), "");
      const response = await fetch(`${base}/assets/fox/${file}`);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "image/png");
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
      assert.equal(bytes.readUInt32BE(16), 4482);
      assert.equal(bytes.readUInt32BE(20), 2949);
      const head = await fetch(`${base}/assets/fox/${file}`, { method: "HEAD" });
      assert.equal(head.status, 200);
      assert.equal(head.headers.get("content-type"), "image/png");
      assert.equal(await head.text(), "");
    }
  }
});

test("visual story shows eight distinct process artifacts and an approximate rating graphic", async () => {
  const { html } = await renderPage("project", "?project=fox-icons");
  assert.equal((html.match(/class="fox-process-panel fox-reveal"/g) || []).length, 8);
  assert.equal((html.match(/data-fox-scene="/g) || []).length, 8);
  assert.doesNotMatch(html, /<button\b|<details\b|<select\b| hidden\b|data-playing/);
  assert.match(html, /<ol class="fox-system-demo fox-process-flow" aria-label="Icon production process">/);
  assert.match(html, /id="localization">[\s\S]*?data-fox-scene="7"/);
  const rating = html.match(/<span class="fox-rating-dots"[\s\S]*?<\/span>/)[0];
  assert.equal((rating.match(/<i class="filled"><\/i>/g) || []).length, 6);
  assert.equal((rating.match(/<i><\/i>/g) || []).length, 4);
  for (const artifact of ["AddNoteboardNote", "fox-process-grid", "fox-process-review", "fox-process-deliverables", "fox-process-handoff", "fox-process-repair", "fox-process-locales"]) {
    assert.ok(html.includes(artifact), artifact);
  }
});

async function workflowFixture(withObserver = true, hash = "", { headerHeight = 0, viewportHeight = 800 } = {}) {
  function revealTarget() {
    const classes = new Set();
    return { classes, classList: { add(name) { classes.add(name); } } };
  }
  const reveals = Array.from({ length: 8 }, revealTarget);
  const copyEntries = Array.from({ length: 3 }, revealTarget);
  const links = ["problem", "insight", "solution"].map((id) => ({
    hash: `#${id}`, attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
  }));
  const scrolls = [];
  const localization = { id: "localization", scrollIntoView(options) {
    scrolls.push(options);
    sections.forEach((section, index) => { section.top = -9000 + index * 1000; });
  } };
  const sections = links.map((link, index) => ({
    id: link.hash.slice(1), top: index * 1000,
    getBoundingClientRect() { return { top: this.top }; },
  }));
  const frames = [];
  const observers = [];
  const location = { hash };
  const events = {};
  const eventOptions = {};
  const context = vm.createContext({
    location,
    document: { querySelector() { return { getBoundingClientRect() { return { bottom: headerHeight }; } }; } },
    window: {
      innerHeight: viewportHeight,
      addEventListener(event, listener, options) { events[event] = listener; eventOptions[event] = options; },
      requestAnimationFrame(callback) { frames.push(callback); },
      setTimeout() { throw new Error("The story must not require timed playback"); },
    },
    root: {
      querySelectorAll(selector) {
        if (selector === ".fox-reveal, .fox-icon-variant, .fox-section > h2, .fox-section > p, .fox-section > .fox-evidence") return [...reveals, ...copyEntries];
        if (selector === ".fox-chapters a") return links;
        if (selector === ".fox-chapter") return sections;
        if (selector === "[id]") return [localization];
        return [];
      },
    },
  });
  if (withObserver) {
    context.IntersectionObserver = function (callback) {
      const observer = { callback, observed: [], unobserved: [] };
      this.observe = (element) => observer.observed.push(element);
      this.unobserve = (element) => observer.unobserved.push(element);
      observers.push(observer);
    };
  }
  vm.runInContext(await (await fetch(`${base}/fox.js`)).text(), context);
  vm.runInContext("initFoxCaseStudy(root)", context);
  return {
    reveals, copyEntries, links, sections, scrolls, location, events, eventOptions, observers, frames,
    flushFrames() { frames.splice(0).forEach((callback) => callback()); },
  };
}

test("chapter highlight stays below the sticky header on short mobile viewports", async () => {
  const { links, sections, events, flushFrames } = await workflowFixture(false, "", { headerHeight: 136, viewportHeight: 480 });
  sections[0].top = -500;
  sections[1].top = 176;
  events.scroll();
  flushFrames();
  assert.equal(links[1].attributes["aria-current"], "location");
  assert.equal(links[0].attributes["aria-current"], undefined);
});

test("scrolling reveals process stages and chapter copy once without clicks or playback timers", async () => {
  const { reveals, copyEntries, observers } = await workflowFixture();
  const observer = observers[0];
  const entries = [...reveals, ...copyEntries];
  assert.equal(observer.observed.length, entries.length);
  observer.callback([{ target: reveals[0], isIntersecting: false }], { unobserve() {} });
  assert.equal(reveals[0].classes.size, 0);
  for (const target of entries) {
    observer.callback([{ target, isIntersecting: true }], {
      unobserve(element) { observer.unobserved.push(element); },
    });
    assert.ok(target.classes.has("is-seen"));
  }
  assert.deepEqual(observer.unobserved, entries);
});

test("chapter tracking and localization anchors work without unfolding a stage", async () => {
  const { links, sections, scrolls, location, events } = await workflowFixture(true, "#localization");
  assert.equal(scrolls.length, 1);
  assert.equal(scrolls[0].behavior, "instant");
  location.hash = "#localization";
  sections[0].top = -900;
  sections[1].top = 100;
  events.hashchange();
  assert.equal(scrolls.length, 2);
  assert.equal(links[2].attributes["aria-current"], "location");
  assert.equal(links[0].attributes["aria-current"], undefined);
});

test("chapter highlight tracks both scroll directions, long sections and resize without an observer", async () => {
  for (const withObserver of [true, false]) {
    const { links, sections, events, eventOptions, frames, flushFrames, location } = await workflowFixture(withObserver);
    const active = () => links.filter((link) => link.attributes["aria-current"] === "location").map((link) => link.hash);
    assert.deepEqual(active(), ["#problem"]);
    assert.equal(eventOptions.scroll.passive, true);
    for (const [tops, expected] of [
      [[-900, 100, 1100], "#insight"],
      [[-6000, -5000, 900], "#insight"],
      [[-6800, -5800, 100], "#solution"],
      [[-6699, -5699, 201], "#insight"],
      [[-6698, -5698, 200], "#solution"],
      [[0, 1000, 2000], "#problem"],
    ]) {
      sections.forEach((section, index) => { section.top = tops[index]; });
      events.scroll();
      events.scroll();
      events.resize();
      assert.equal(frames.length, 1);
      flushFrames();
      assert.deepEqual(active(), [expected]);
    }
    assert.equal(location.hash, "");
  }
});

test("all content and legacy anchors remain available without animation support", async () => {
  const { observers, scrolls, location, events } = await workflowFixture(false);
  assert.equal(observers.length, 0);
  location.hash = "#localization";
  events.hashchange();
  assert.equal(scrolls.length, 1);
  const { html } = await renderPage("project", "?project=fox-icons");
  assert.doesNotMatch(html, / hidden\b|aria-expanded|aria-pressed|fox-process-play/);
  assert.match(html, /Handed off icons so engineers could raise PRs and swap old icons with the new ones/);
});

test("website copy has no dashes while project links retain their original slugs", async () => {
  const pages = [["work", ""], ["about", ""], ["playground", ""],
    ...["fox-icons", "making-icons-searchable", "template-validator", "bug-logger", "form-and-feeling", "not-a-project"].map(slug => ["project", `?project=${slug}`])];
  for (const [page, search] of pages) {
    const { html, title, elements } = await renderPage(page, search);
    const markup = html + elements.get("#site-header").innerHTML + elements.get("#site-footer").innerHTML;
    assert.doesNotMatch(markup.replace(/<[^>]*>/g, ""), /[-\u2013\u2014]/, `${page}${search} text`);
    for (const match of markup.matchAll(/(?:alt|aria-label)="([^"]*)"/g)) {
      assert.doesNotMatch(match[1], /[-\u2013\u2014]/, `${page}${search} accessible copy`);
    }
    if (title) assert.doesNotMatch(title, /[-\u2013\u2014]/);
  }
  const { html } = await renderPage("work");
  assert.match(html, /project=making-icons-searchable/);
  assert.match(html, /project=template-validator/);
  assert.doesNotMatch(html, /project=form-and-feeling/);
});

test("home promotes four projects without case study labels or the removed sample", async () => {
  const { html } = await renderPage("work", "?scoutTheme=light");
  assert.match(html, /View project: FOX Icons/);
  assert.match(html, /project=fox-icons/);
  assert.match(html, /View project: Making Icons searchable/);
  assert.match(html, /View project: Template Validator/);
  assert.match(html, /View project: Bug Logger/);
  assert.equal((html.match(/View project:/g) || []).length, 4);
  assert.equal((html.match(/View sample project:/g) || []).length, 0);
  assert.doesNotMatch(html, /case stud|form-and-feeling|A little less expected/i);
  assert.doesNotMatch(html, /All names, projects, and descriptions below are placeholders/);
});

test("legacy URLs work and removed or unknown projects show an error", async () => {
  assert.match((await renderPage("project", "?project=everyday")).html, /class="fox-case fox-visual-case"/);
  assert.match((await renderPage("project", "?project=closer")).html, /class="fox-case fox-visual-case organizer-case"/);
  for (const slug of ["form-and-feeling"]) {
    const { html } = await renderPage("project", `?project=${slug}`);
    assert.match(html, /PROJECT NOT FOUND/);
    assert.doesNotMatch(html, /class="fox-case fox-visual-case"/);
  }
  const last = await renderPage("project", "?project=bug-logger");
  assert.match(last.html, /project=fox-icons/);
  assert.match(last.html, /Next project: FOX Icons/);
  const missing = await renderPage("project", "?project=not-a-project");
  assert.match(missing.html, /PROJECT NOT FOUND/);
});

test("searchable icons tells the supplied story with real media and exact impact figures", async () => {
  const { html, title, elements } = await renderPage("project", "?project=making-icons-searchable&scoutTheme=dark");
  assert.equal(title, "Making Icons searchable · Your Name");
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.indexOf('id="organizer-problem"') < html.indexOf('id="organizer-solution"'));
  assert.ok(html.indexOf('id="organizer-solution"') < html.indexOf('id="organizer-impact"'));
  assert.match(html, /5,000\+ icons\.<br><em>Almost no useful metadata\.<\/em>/);
  assert.match(html, /I built an AI powered Figma plugin to <em>make the library searchable\.<\/em>/);
  assert.match(html, /<dt>icons organised<\/dt><dd>5,000\+<\/dd>/);
  assert.match(html, /<dt>minutes of manual tagging saved<\/dt><dd>8,000<\/dd>/);
  assert.doesNotMatch(html, /3,000|6,000/);
  const home = await renderPage("work");
  assert.match(home.html, /src="\.\/assets\/icon-organizer\/thumbnail\.png" width="957" height="642"/);
  assert.doesNotMatch(home.html, /organizer-card-label|Now searchable\./);
  assert.match(home.html, /An AI powered Figma plugin that makes 5,000\+ icons searchable\./);
  assert.doesNotMatch(home.html, /3,000|6,000/);
  assert.match(html, /<dt>to auto tag selected icons<\/dt><dd>1 click<\/dd>/);
  assert.match(html, /<video controls playsinline preload="metadata"/);
  assert.match(html, /src="\.\/assets\/icon-organizer\/demo\.mp4" type="video\/mp4"/);
  assert.match(html, /src="\.\/assets\/icon-organizer\/plugin-library-hires\.png" width="3428" height="1644"/);
  assert.match(html, /project=template-validator/);
  assert.match(html, /href="\.\/index\.html"/);
  assert.doesNotMatch(html, /autoplay|SAMPLE CASE STUDY|placeholder|sharepoint\.com|measured savings/i);
  assert.equal(typeof elements.get(".organizer-demo video").listeners.error, "function");
  elements.get("source").listeners.error();
  assert.equal(elements.get("#organizer-solution > .organizer-video-error").hidden, false);
  elements.get(".organizer-demo video").listeners.error();
  assert.equal(elements.get("#organizer-solution > .organizer-video-error").hidden, false);

  const screenshot = await fetch(`${base}/assets/icon-organizer/plugin-library-hires.png`);
  assert.equal(screenshot.headers.get("content-type"), "image/png");
  const image = Buffer.from(await screenshot.arrayBuffer());
  assert.equal(image.readUInt32BE(16), 3428);
  assert.equal(image.readUInt32BE(20), 1644);
});

test("Template Validator preserves the supplied UX story and shared architecture", async () => {
  const { html, title } = await renderPage("project", "?project=template-validator&scoutTheme=dark");
  assert.equal(title, "Template Validator · Your Name");
  assert.doesNotMatch(html, /MY ROLE \/ UX & CONTENT DESIGN|CONTEXT \/ BRAND KIT/);
  assert.match(html, /<ol class="validator-chart">/);
  assert.equal((html.match(/class="validator-chart-arrow" aria-hidden="true"/g) || []).length, 2);
  assert.match(html, /without overwhelming them or blocking their workflow/);
  assert.match(html, /aria-labelledby="validator-chart-caption"/);
  assert.match(html, /class="fox-case fox-visual-case validator-case"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const chapters = ["challenge", "role", "feedback", "workflow", "evolution", "learning"];
  for (const chapter of chapters) {
    assert.match(html, new RegExp(`href="#validator-${chapter}"`));
    assert.match(html, new RegExp(`id="validator-${chapter}" aria-labelledby="validator-${chapter}-title"`));
  }
  assert.equal((html.match(/class="fox-section fox-chapter(?: fox-conclusion)?"/g) || []).length, 6);
  assert.doesNotMatch(html, /validator-evaluation|ITERATION & EVALUATION/);
  assert.match(html, /05 \/ PRODUCT EVOLUTION/);
  assert.match(html, /06 \/ WHAT I LEARNT/);
  assert.match(html, /content design, engineering handoff, evaluation and bug bashing/);
  assert.match(html, /What happened\?/);
  assert.match(html, /Why does it matter\?/);
  assert.match(html, /How do I fix it\?/);
  const feedback = html.match(/id="validator-feedback"[\s\S]*?<\/section>/)[0];
  const role = html.match(/id="validator-role"[\s\S]*?<\/section>/)[0];
  assert.match(feedback, /<span>Non blocking<\/span><span>Prioritised<\/span><span>Actionable<\/span>/);
  assert.doesNotMatch(role, /class="fox-principles"/);
  assert.match(feedback, /We deliberately avoided colour coding findings/);
  assert.match(feedback, /more visual signals could overwhelm users/);
  assert.match(feedback, /We tested multiple decks and marked redundant issues/);
  assert.match(feedback, /Our goal was to surface a maximum of two or three critical issues/);
  assert.match(feedback, /Validation starts as soon as a user uploads a template/);
  assert.match(feedback, /The template remains usable/);
  assert.match(feedback, /In the user study, people told us they wanted to stay in control/);
  assert.match(feedback, /see exactly what changes AI made for them/);
  assert.match(feedback, /As a triad, we treated AI assisted fixing with user oversight as a north star vision/);
  assert.match(feedback, /gather usage data before investing in that broader experience/);
  assert.match(feedback, /MVP did not let users open the PowerPoint directly from the tool/);
  assert.match(feedback, /src="\.\/assets\/template-validator\/validation-data\.png" width="3418" height="1498"/);
  const validationData = await fetch(`${base}/assets/template-validator/validation-data.png`);
  assert.equal(validationData.status, 200);
  assert.equal(validationData.headers.get("content-type"), "image/png");
  const validationBytes = Buffer.from(await validationData.arrayBuffer());
  assert.equal(validationBytes.readUInt32BE(16), 3418);
  assert.equal(validationBytes.readUInt32BE(20), 1498);
  assert.doesNotMatch(html, /Translating system language into product language|CONTENT DESIGN EXAMPLE|The same approach could be used for typography/);
  assert.match(html, /An annotated deck did not become part of the initial release/);
  assert.match(html, /Automatic fixing remained outside the initial scope/);
  assert.match(html, /production UI is visually different from my original explorations/);
  assert.match(html, /Template Assessment experience available in Brand Kit/);
  assert.match(html, /Next project: Bug Logger/);
  assert.match(html, /project=bug-logger/);
  assert.doesNotMatch(html, /SAMPLE CASE STUDY|organizer-case|fox-hero-metrics/);
  assert.match(html, /class="validator-cover fox-reveal" src="\.\/assets\/template-validator\/cover\.png" width="2820" height="1096"/);
  const home = await renderPage("work");
  assert.match(home.html, /src="\.\/assets\/template-validator\/thumbnail\.png" width="794" height="616" alt=""/);
  assert.doesNotMatch(home.html, /assets\/template-validator\/cover\.png/);
  assert.doesNotMatch(home.html, /validator-card-sheet|From findings<br>to next steps/);
  const cover = await fetch(`${base}/assets/template-validator/cover.png`);
  assert.equal(cover.status, 200);
  assert.equal(cover.headers.get("content-type"), "image/png");
  const bytes = Buffer.from(await cover.arrayBuffer());
  assert.equal(bytes.readUInt32BE(16), 2820);
  assert.equal(bytes.readUInt32BE(20), 1096);
  const thumbnail = await fetch(`${base}/assets/template-validator/thumbnail.png`);
  assert.equal(thumbnail.status, 200);
  assert.equal(thumbnail.headers.get("content-type"), "image/png");
  const thumbnailBytes = Buffer.from(await thumbnail.arrayBuffer());
  assert.equal(thumbnailBytes.readUInt32BE(16), 794);
  assert.equal(thumbnailBytes.readUInt32BE(20), 616);
  const styles = await (await fetch(`${base}/styles.css`)).text();
  assert.match(styles, /\.validator-card-art \{ padding: 0;/);
  assert.match(styles, /\.validator-card-art > img \{ display: block; position: relative; top: 24px; width: 100%; height: 100%; object-fit: cover; \}/);
  assert.ok(home.html.indexOf("project=making-icons-searchable") < home.html.indexOf("project=template-validator"));
  const previous = await renderPage("project", "?project=making-icons-searchable");
  assert.match(previous.html, /Next project: Template Validator/);
});

test("Bug Logger preserves ownership, workflow, impact attribution and case study navigation", async () => {
  const { html, title } = await renderPage("project", "?project=bug-logger&scoutTheme=dark");
  assert.equal(title, "Bug Logger · Your Name");
  const problem = html.match(/id="bug-problem"[\s\S]*?<\/section>/)[0];
  assert.match(problem, /As we built new apps, we needed human eyes to catch bugs and understand what had gone wrong/);
  assert.match(problem, /each finding still needed to become a clear, actionable report/);
  assert.ok(problem.indexOf("human eyes") < problem.indexOf("An issue might only take a few seconds"));
  assert.match(html, /class="fox-case fox-visual-case bug-case"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/class="fox-section fox-chapter(?: fox-conclusion)?"/g) || []).length, 4);
  for (const chapter of ["problem", "workflow", "evolution", "impact"]) {
    assert.match(html, new RegExp(`href="#bug-${chapter}"`));
    assert.match(html, new RegExp(`id="bug-${chapter}" aria-labelledby="bug-${chapter}-title"`));
  }
  const evolution = html.match(/id="bug-evolution"[\s\S]*?<\/section>/)[0];
  assert.match(evolution, /A teammate came up with the skill version of Bug Logger in Cowork/);
  assert.match(evolution, /I built on top of it to make bug identification and supporting evidence more precise/);
  assert.match(evolution, /Rather than waiting for people to use specific words or explicitly announce a bug/);
  assert.match(evolution, /understand the issue from the conversation and screen recording, then trim the video to the relevant moments/);
  assert.doesNotMatch(html, /Rachit Jain|Primus/);
  const workflow = html.match(/id="bug-workflow"[\s\S]*?<\/section>/)[0];
  assert.match(workflow, /The idea began as a documentation tool before evolving into Bug Logger/);
  assert.match(html, /What started as a documentation tool evolved into bug capture, and then into a broader workflow/);
  assert.match(html, /screenshots, screen recordings and spoken descriptions/);
  for (const output of ["A concise bug description", "Reproduction steps", "Screenshot context", "Supporting information for investigation", "Azure DevOps \\(ADO\\)"]) {
    assert.match(html, new RegExp(output));
  }
  assert.match(html, /reviewed afterwards, and then logged together/);
  assert.match(html, /Cowork workflow could work from meeting recordings and chat/);
  assert.match(html, /check for duplicates/);
  assert.match(html, /Human reviews/);
  assert.match(html, /before anything was filed/);
  assert.match(html, /continued tweaking this evolved version/);
  assert.match(html, /actively used in product bug bashes/);
  assert.match(html, /Team feedback described bug work/);
  assert.match(html, /around half an hour/);
  assert.match(html, /within a few minutes/);
  assert.match(html, /not a measured benchmark/);
  assert.match(html, /people started asking when it would be restored/);
  assert.match(html, /Next project: FOX Icons/);
  assert.match(html, /project=fox-icons/);
  assert.match(html, /href="\.\/index\.html"/);
  assert.doesNotMatch(html, /SAMPLE CASE STUDY|fox-hero-metrics/);
  const home = await renderPage("work", "?scoutTheme=dark");
  assert.match(home.html, /project=bug-logger/);
  assert.match(home.html, /class="art bug-card-art"/);
  const thumbnail = home.html.match(/<div class="art bug-card-art"[\s\S]*?<\/div>/)[0];
  assert.match(thumbnail, /banner-skill\.png/);
  assert.match(thumbnail, /banner-toolbar\.png/);
  assert.doesNotMatch(thumbnail, /<strong|<span|<svg/);
  assert.match(home.html, /<span>04<\/span><\/div><h3>Bug Logger<\/h3>/);
  assert.doesNotMatch(home.html, /A little less expected|form-and-feeling/);
  assert.ok(home.html.indexOf("project=template-validator") < home.html.indexOf("project=bug-logger"));
});

test("Bug Logger banner displays both supplied images beside its text", async () => {
  const { html } = await renderPage("project", "?project=bug-logger");
  const hero = html.match(/<section class="bug-hero[\s\S]*?<\/section>/)[0];
  assert.match(hero, /class="bug-hero-copy"/);
  assert.match(hero, /class="bug-hero-images"/);
  for (const [name, width, height] of [["skill", 426, 451], ["toolbar", 1083, 168]]) {
    assert.match(hero, new RegExp(`banner-${name}\\.png" width="${width}" height="${height}"`));
    const response = await fetch(`${base}/assets/bug-logger/banner-${name}.png`);
    assert.equal(response.status, 200);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.readUInt32BE(16), width);
    assert.equal(bytes.readUInt32BE(20), height);
  }
});

test("Bug Logger presents both narrated versions in order with independent playback fallbacks", async () => {
  const { html, elements } = await renderPage("project", "?project=bug-logger");
  const first = html.match(/id="bug-workflow"[\s\S]*?<\/section>/)[0];
  const second = html.match(/id="bug-evolution"[\s\S]*?<\/section>/)[0];
  assert.match(first, /02 \/ FIRST EXPLORATION/);
  assert.match(first, /A widget for bug capture/);
  assert.match(first, /widget that sat alongside the app being tested/);
  assert.match(first, /journal brought saved findings together for review/);
  assert.match(first, /log all the reviewed bugs in one click/);
  assert.match(first, /kept a history so people could revisit earlier reports/);
  assert.match(first, /why do we need another app\?/);
  assert.match(first, /bringing bug logging into the workflow people were already using/);
  assert.match(first, /version-one\.mp4/);
  assert.doesNotMatch(first, /version-two\.mp4/);
  assert.match(second, /03 \/ SECOND VERSION/);
  assert.match(second, /From a widget/);
  assert.match(second, /A teammate came up with the skill version of Bug Logger in Cowork/);
  assert.match(second, /version-two\.mp4/);
  assert.doesNotMatch(second, /version-one\.mp4/);
  assert.equal((html.match(/<video controls playsinline preload="metadata"/g) || []).length, 2);
  assert.doesNotMatch(html, /autoplay|<video[^>]*\bloop\b/);
  for (const name of ["one", "two"]) {
    elements.get(`.bug-version-${name} video`).listeners.error();
    assert.equal(elements.get(`#bug-version-${name}-error`).hidden, false);
    const video = await fetch(`${base}/assets/bug-logger/version-${name}.mp4`, { headers: { Range: "bytes=0-31" } });
    assert.equal(video.status, 206);
    assert.equal(video.headers.get("content-type"), "video/mp4");
    assert.match(video.headers.get("content-range"), /^bytes 0-31\/\d+$/);
    assert.equal((await video.arrayBuffer()).byteLength, 32);
    const poster = await fetch(`${base}/assets/bug-logger/version-${name}-poster.png`);
    assert.equal(poster.status, 200);
    assert.equal(poster.headers.get("content-type"), "image/png");
    const image = Buffer.from(await poster.arrayBuffer());
    assert.equal(image.readUInt32BE(16), 1280);
    assert.equal(image.readUInt32BE(20), 720);
  }
  const fresh = await renderPage("project", "?project=bug-logger");
  fresh.elements.get("source").listeners.error();
  assert.equal(fresh.elements.get("#bug-version-two-error").hidden, false);
  assert.equal(fresh.elements.get("#bug-version-one-error"), undefined);
});

test("Template Validator shows the reviewed PowerPoint export and annotations in Resolution workflow", async () => {
  const { html, elements } = await renderPage("project", "?project=template-validator");
  const workflow = html.match(/id="validator-workflow"[\s\S]*?<\/section>/)[0];
  assert.match(workflow, /A list wasn't enough/);
  assert.match(workflow, /Instead of long paragraphs, we broke the guidance into clear, step by step actions/);
  assert.match(workflow, /Export reviewed PPT/);
  assert.match(workflow, /export-reviewed\.gif" width="1920" height="1014"/);
  assert.match(workflow, /media="\(prefers-reduced-motion: reduce\)" srcset="\.\/assets\/template-validator\/export-reviewed-static\.png"/);
  assert.match(workflow, /annotated-overview\.png" width="3448" height="1804"/);
  assert.match(workflow, /annotated-detail\.png" width="3446" height="1858"/);
  assert.match(workflow, /An annotated deck did not become part of the initial release/);
  assert.doesNotMatch(workflow, /<video|Pause animation|Play animation/);
  elements.get(".validator-export img").listeners.error();
  assert.equal(elements.get("#validator-export-error").hidden, false);
  for (const file of ["annotated-overview.png", "annotated-detail.png", "export-reviewed-static.png"]) {
    const response = await fetch(`${base}/assets/template-validator/${file}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/png");
  }
  const gifResponse = await fetch(`${base}/assets/template-validator/export-reviewed.gif`);
  assert.equal(gifResponse.status, 200);
  assert.equal(gifResponse.headers.get("content-type"), "image/gif");
  const gif = Buffer.from(await gifResponse.arrayBuffer());
  assert.equal(gif.subarray(0, 6).toString(), "GIF89a");
  assert.equal(gif.readUInt16LE(6), 1920);
  assert.equal(gif.readUInt16LE(8), 1014);
  assert.ok(gif.includes(Buffer.from("NETSCAPE2.0")));
  const response = await fetch(`${base}/assets/template-validator/export-reviewed.mp4`, { headers: { Range: "bytes=0-31" } });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("content-type"), "video/mp4");
  assert.equal((await response.arrayBuffer()).byteLength, 32);
});

test("Template Validator shows the latest assessment recording in Product evolution", async () => {
  const { html, elements } = await renderPage("project", "?project=template-validator");
  const evolution = html.match(/id="validator-evolution"[\s\S]*?<\/section>/)[0];
  assert.match(evolution, /assessment-latest\.gif" width="1920" height="1014"/);
  assert.match(evolution, /media="\(prefers-reduced-motion: reduce\)" srcset="\.\/assets\/template-validator\/assessment-latest-static\.png"/);
  assert.match(evolution, /latest Template Assessment experience/);
  elements.get(".validator-assessment img").listeners.error();
  assert.equal(elements.get("#validator-assessment-error").hidden, false);
  assert.equal(elements.get("#validator-export-error"), undefined);
  const response = await fetch(`${base}/assets/template-validator/assessment-latest.gif`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/gif");
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.subarray(0, 6).toString(), "GIF89a");
  assert.equal(bytes.readUInt16LE(6), 1920);
  assert.equal(bytes.readUInt16LE(8), 1014);
  assert.ok(bytes.includes(Buffer.from("NETSCAPE2.0")));
  assert.equal((await fetch(`${base}/assets/template-validator/assessment-latest-static.png`)).status, 200);
});

test("searchable icons frames the opening library and uses the no-results evidence under Problem", async () => {
  const { html } = await renderPage("project", "?project=making-icons-searchable");
  const hero = html.match(/<figure class="fox-hero-art wrap"[\s\S]*?<\/figure>/)[0];
  const problem = html.match(/<section class="fox-section fox-chapter" id="organizer-problem"[\s\S]*?<\/section>/)[0];
  assert.match(hero, /src="\.\/assets\/icon-organizer\/plugin-library-hires\.png"/);
  assert.match(problem, /class="fox-document organizer-search-evidence fox-reveal"/);
  assert.match(problem, /href="\.\/assets\/icon-organizer\/search-no-results\.png"/);
  assert.match(problem, /src="\.\/assets\/icon-organizer\/search-no-results\.png" width="476" height="348"/);
  assert.doesNotMatch(problem, /fox-library\.png/);
  assert.match(problem, /star anim/);
  const response = await fetch(`${base}/assets/icon-organizer/search-no-results.png`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.readUInt32BE(16), 476);
  assert.equal(bytes.readUInt32BE(20), 348);
  const css = await fs.readFile(require("node:path").join(__dirname, "styles.css"), "utf8");
  assert.match(css, /\.organizer-case \.fox-hero-visual \{ border: clamp\(8px, 1\.4vw, 20px\) solid var\(--cp-mustard\)/);
  assert.match(css, /\.organizer-case \.fox-hero-visual > img \{ border-radius: 12px; \}/);
});

test("searchable icons thumbnail uses the supplied clean artwork without added text", async () => {
  const { html } = await renderPage("work");
  const thumbnail = html.match(/<div class="art organizer-card-art"[\s\S]*?<\/div>/)[0];
  assert.match(thumbnail, /src="\.\/assets\/icon-organizer\/thumbnail\.png"/);
  assert.equal(thumbnail.replace(/<[^>]+>/g, "").trim(), "");
  const response = await fetch(`${base}/assets/icon-organizer/thumbnail.png`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  const image = Buffer.from(await response.arrayBuffer());
  assert.equal(image.readUInt32BE(16), 957);
  assert.equal(image.readUInt32BE(20), 642);
});

test("searchable icons reuses the FOX template architecture and shared chapter behavior", async () => {
  for (const slug of ["fox-icons", "making-icons-searchable"]) {
    const { html } = await renderPage("project", `?project=${slug}`);
    for (const className of ["fox-intro wrap", "fox-hero-art wrap", "fox-hero-metrics", "fox-story-layout wrap", "fox-story", "fox-case-exit wrap"]) {
      assert.ok(html.includes(`class="${className}"`), `${slug}: ${className}`);
    }
    assert.match(html, /class="fox-case fox-visual-case/);
    assert.match(html, /<\/article>\s*<section class="fox-case-exit wrap"/);
    assert.equal((html.match(/<section\b[^>]*class="[^"]*\bfox-chapter(?:\s|")/g) || []).length, 3);
    const nav = html.match(/<nav class="fox-chapters"[\s\S]*?<\/nav>/)[0];
    assert.match(nav, /THE STORY/);
    assert.equal((nav.match(/<a\b/g) || []).length, 3);
  }
  const { html } = await renderPage("project", "?project=making-icons-searchable");
  const nav = html.match(/<nav class="fox-chapters"[\s\S]*?<\/nav>/)[0];
  for (const [index, chapter] of ["problem", "solution", "impact"].entries()) {
    assert.ok(nav.includes(`href="#organizer-${chapter}"><span>0${index + 1}</span>`));
    assert.ok(html.includes(`class="fox-section fox-chapter${chapter === "impact" ? " fox-conclusion" : ""}" id="organizer-${chapter}"`));
  }
  assert.doesNotMatch(html, /organizer-intro|organizer-chapters|organizer-metrics/);
  const source = await fs.readFile(require("node:path").join(__dirname, "app.js"), "utf8");
  assert.match(source, /main\.innerHTML = renderIconOrganizer\([^;]+;\s*initFoxCaseStudy\(main\)/);
});

test("searchable icons closes with a statement without repeating the hero stats", async () => {
  const { html } = await renderPage("project", "?project=making-icons-searchable");
  const impact = html.match(/<section class="fox-section fox-chapter fox-conclusion" id="organizer-impact"[\s\S]*?<\/section>/)[0];
  assert.match(impact, /Less time tagging icons\.<br><em>More time designing\.<\/em>/);
  assert.doesNotMatch(impact, /<dl\b|<dd\b|fox-impact-metrics|5,000|8,000|1 click/);
  assert.equal((html.match(/<dl\b/g) || []).length, 1);
  assert.match(html, /class="fox-hero-metrics"/);
});

test("searchable icons shows before and after evidence and a grounded implementation sentence", async () => {
  const { html } = await renderPage("project", "?project=making-icons-searchable");
  assert.match(html, /Using VS Code, I built a Figma plugin that generates AI descriptions for selected icons, turning missing metadata into searchable terms\./);
  const solution = html.match(/<section class="fox-section fox-chapter" id="organizer-solution"[\s\S]*?<\/section>/)[0];
  const impact = html.match(/<section class="fox-section fox-chapter fox-conclusion" id="organizer-impact"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(solution, /search-after\.mp4|search-no-results\.png/);
  assert.match(solution, /src="\.\/assets\/icon-organizer\/demo\.mp4"/);
  assert.match(impact, /AFTER TAGGING/);
  assert.match(impact, /TAGS ADDED TO ICONS/);
  assert.match(impact, /AI generated tags added to each icon's description\./);
  assert.match(impact, /src="\.\/assets\/icon-organizer\/search-after\.gif"/);
  assert.match(html, /AFTER TAGGING/);
  assert.match(html, /alt="After tagging: searching star anim finds matching animation icons in the FOX library\."/);
  assert.match(html, /media="\(prefers-reduced-motion: reduce\)" srcset="\.\/assets\/icon-organizer\/search-after-static\.png"/);
  assert.equal((html.match(/<video controls playsinline preload="metadata"/g) || []).length, 1);
  const response = await fetch(`${base}/assets/icon-organizer/search-after.mp4`, { headers: { Range: "bytes=0-31" } });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("content-type"), "video/mp4");
  assert.equal((await response.arrayBuffer()).byteLength, 32);
});

test("searchable icons loops GIFs without buttons, with reduced-motion and failure handling", async () => {
  const { html, elements } = await renderPage("project", "?project=making-icons-searchable");
  assert.doesNotMatch(html, /organizer-gif-toggle|Pause animation|Play animation/);
  for (const name of ["search-after", "search-after-second"]) {
    assert.ok(html.includes(`media="(prefers-reduced-motion: reduce)" srcset="./assets/icon-organizer/${name}-static.png"`));
  }
  const image = elements.get("#search-after img");
  image.listeners.error();
  assert.equal(elements.get("#search-after .organizer-image-error").hidden, false);
  const response = await fetch(`${base}/assets/icon-organizer/search-after.gif`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/gif");
  const gif = Buffer.from(await response.arrayBuffer());
  assert.equal(gif.subarray(0, 6).toString(), "GIF89a");
  assert.equal(gif.readUInt16LE(6), 550);
  assert.equal(gif.readUInt16LE(8), 688);
  assert.ok(gif.includes(Buffer.from("NETSCAPE2.0")));
  const poster = await fetch(`${base}/assets/icon-organizer/search-after-static.png`);
  assert.equal(poster.status, 200);
  const secondImage = elements.get("#search-after-second img");
  secondImage.listeners.error();
  assert.equal(elements.get("#search-after-second .organizer-image-error").hidden, false);
  const secondResponse = await fetch(`${base}/assets/icon-organizer/search-after-second.gif`);
  assert.equal(secondResponse.status, 200);
  assert.equal(secondResponse.headers.get("content-type"), "image/gif");
  assert.equal((await fetch(`${base}/assets/icon-organizer/search-after-second-static.png`)).status, 200);
});

test("searchable icons includes both leadership presentation photos in Impact", async () => {
  const { html } = await renderPage("project", "?project=making-icons-searchable");
  const impact = html.match(/<section class="fox-section fox-chapter fox-conclusion" id="organizer-impact"[\s\S]*?<\/section>/)[0];
  assert.match(impact, /Presenting Icon Organizer to leadership at IDC Tech Fair 2025\./);
  assert.match(impact, /<h3>Presenting Icon Organizer<br><em>to leadership at IDC Tech Fair 2025\.<\/em><\/h3>/);
  for (const index of [1, 2]) {
    const file = `/assets/icon-organizer/idc-tech-fair-2025-${index}.webp`;
    assert.ok(impact.includes(`href=".${file}"`));
    assert.ok(impact.includes(`src=".${file}" width="2016" height="1512"`));
    const response = await fetch(`${base}${file}`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/webp");
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.subarray(8, 12).toString(), "WEBP");
  }
});

test("local demo supports playback, HEAD and byte-range seeking", async () => {
  const video = await fs.readFile(require("node:path").join(__dirname, "assets/icon-organizer/demo.mp4"));
  const url = `${base}/assets/icon-organizer/demo.mp4`;
  const head = await fetch(url, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get("content-type"), "video/mp4");
  assert.equal(head.headers.get("accept-ranges"), "bytes");
  assert.equal(Number(head.headers.get("content-length")), video.length);
  assert.equal(await head.text(), "");
  const full = await fetch(url);
  assert.equal(full.status, 200);
  assert.deepEqual(Buffer.from(await full.arrayBuffer()), video);
  for (const [range, start, end] of [
    ["bytes=0-31", 0, 31],
    [`bytes=${video.length - 32}-`, video.length - 32, video.length - 1],
    ["bytes=-32", video.length - 32, video.length - 1],
    [`bytes=${video.length - 16}-${video.length + 20}`, video.length - 16, video.length - 1],
  ]) {
    const response = await fetch(url, { headers: { Range: range } });
    assert.equal(response.status, 206, range);
    assert.equal(response.headers.get("content-range"), `bytes ${start}-${end}/${video.length}`);
    assert.equal(Number(response.headers.get("content-length")), end - start + 1);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), video.subarray(start, end + 1));
  }
  for (const range of [`bytes=${video.length}-`, "bytes=10-5", "bytes=-0", "bytes=-", "bytes=0-1,4-5", "nonsense"]) {
    const response = await fetch(url, { headers: { Range: range } });
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get("content-range"), `bytes */${video.length}`);
    assert.equal(await response.text(), "");
  }
});
