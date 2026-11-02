const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const publicFiles = new Map([
  ["/", ["index.html", "text/html"]],
  ["/index.html", ["index.html", "text/html"]],
  ["/about.html", ["about.html", "text/html"]],
  ["/assets/about/tanuja-resume-2026.pdf", ["assets/about/tanuja-resume-2026.pdf", "application/pdf"]],
  ["/creative-practice.html", ["creative-practice.html", "text/html"]],
  ["/assets/creative-practice/project-01.webp", ["assets/creative-practice/project-01.webp", "image/webp"]],
  ["/assets/creative-practice/project-02.webp", ["assets/creative-practice/project-02.webp", "image/webp"]],
  ["/assets/creative-practice/project-03.webp", ["assets/creative-practice/project-03.webp", "image/webp"]],
  ["/assets/creative-practice/project-04.webp", ["assets/creative-practice/project-04.webp", "image/webp"]],
  ["/assets/creative-practice/project-05.webp", ["assets/creative-practice/project-05.webp", "image/webp"]],
  ["/assets/creative-practice/metta-packaging.webp", ["assets/creative-practice/metta-packaging.webp", "image/webp"]],
  ["/playground.html", ["playground.html", "text/html"]],
  ["/assets/life-and-all/photo-01.webp", ["assets/life-and-all/photo-01.webp", "image/webp"]],
  ["/assets/life-and-all/photo-02.webp", ["assets/life-and-all/photo-02.webp", "image/webp"]],
  ["/assets/life-and-all/photo-03.webp", ["assets/life-and-all/photo-03.webp", "image/webp"]],
  ["/assets/life-and-all/photo-04.webp", ["assets/life-and-all/photo-04.webp", "image/webp"]],
  ["/assets/life-and-all/photo-05.webp", ["assets/life-and-all/photo-05.webp", "image/webp"]],
  ["/assets/life-and-all/photo-06.webp", ["assets/life-and-all/photo-06.webp", "image/webp"]],
  ["/assets/life-and-all/photo-07.webp", ["assets/life-and-all/photo-07.webp", "image/webp"]],
  ["/assets/life-and-all/photo-08.webp", ["assets/life-and-all/photo-08.webp", "image/webp"]],
  ["/assets/life-and-all/photo-09.webp", ["assets/life-and-all/photo-09.webp", "image/webp"]],
  ["/assets/life-and-all/photo-10.webp", ["assets/life-and-all/photo-10.webp", "image/webp"]],
  ["/assets/life-and-all/photo-11.webp", ["assets/life-and-all/photo-11.webp", "image/webp"]],
  ["/assets/life-and-all/photo-12.webp", ["assets/life-and-all/photo-12.webp", "image/webp"]],
  ["/assets/life-and-all/photo-13.webp", ["assets/life-and-all/photo-13.webp", "image/webp"]],
  ["/assets/life-and-all/photo-14.webp", ["assets/life-and-all/photo-14.webp", "image/webp"]],
  ["/assets/life-and-all/photo-15.webp", ["assets/life-and-all/photo-15.webp", "image/webp"]],
  ["/assets/life-and-all/photo-16.webp", ["assets/life-and-all/photo-16.webp", "image/webp"]],
  ["/assets/life-and-all/photo-17.webp", ["assets/life-and-all/photo-17.webp", "image/webp"]],
  ["/project.html", ["project.html", "text/html"]],
  ["/styles.css", ["styles.css", "text/css"]],
  ["/app.js", ["app.js", "text/javascript"]],
  ["/fox.js", ["fox.js", "text/javascript"]],
  ["/assets/icon-organizer/fox-library.png", ["assets/icon-organizer/fox-library.png", "image/png"]],
  ["/assets/icon-organizer/plugin-library-hires.png", ["assets/icon-organizer/plugin-library-hires.png", "image/png"]],
  ["/assets/icon-organizer/thumbnail.png", ["assets/icon-organizer/thumbnail.png", "image/png"]],
  ["/assets/template-validator/cover.png", ["assets/template-validator/cover.png", "image/png"]],
  ["/assets/template-validator/thumbnail.png", ["assets/template-validator/thumbnail.png", "image/png"]],
  ["/assets/template-validator/validation-data.png", ["assets/template-validator/validation-data.png", "image/png"]],
  ["/assets/template-validator/export-reviewed.mp4", ["assets/template-validator/export-reviewed.mp4", "video/mp4"]],
  ["/assets/template-validator/export-reviewed.gif", ["assets/template-validator/export-reviewed.gif", "image/gif"]],
  ["/assets/template-validator/export-reviewed-static.png", ["assets/template-validator/export-reviewed-static.png", "image/png"]],
  ["/assets/template-validator/annotated-overview.png", ["assets/template-validator/annotated-overview.png", "image/png"]],
  ["/assets/template-validator/annotated-detail.png", ["assets/template-validator/annotated-detail.png", "image/png"]],
  ["/assets/template-validator/assessment-latest.mp4", ["assets/template-validator/assessment-latest.mp4", "video/mp4"]],
  ["/assets/template-validator/assessment-latest.gif", ["assets/template-validator/assessment-latest.gif", "image/gif"]],
  ["/assets/template-validator/assessment-latest-static.png", ["assets/template-validator/assessment-latest-static.png", "image/png"]],
  ["/assets/bug-logger/version-one.mp4", ["assets/bug-logger/version-one.mp4", "video/mp4"]],
  ["/assets/bug-logger/version-one-poster.png", ["assets/bug-logger/version-one-poster.png", "image/png"]],
  ["/assets/bug-logger/version-two.mp4", ["assets/bug-logger/version-two.mp4", "video/mp4"]],
  ["/assets/bug-logger/version-two-poster.png", ["assets/bug-logger/version-two-poster.png", "image/png"]],
  ["/assets/bug-logger/banner-skill.png", ["assets/bug-logger/banner-skill.png", "image/png"]],
  ["/assets/bug-logger/banner-toolbar.png", ["assets/bug-logger/banner-toolbar.png", "image/png"]],
  ["/assets/about/about-display.png", ["assets/about/about-display.png", "image/png"]],
  ["/assets/icon-organizer/search-no-results.png", ["assets/icon-organizer/search-no-results.png", "image/png"]],
  ["/assets/icon-organizer/demo.mp4", ["assets/icon-organizer/demo.mp4", "video/mp4"]],
  ["/assets/icon-organizer/search-after.mp4", ["assets/icon-organizer/search-after.mp4", "video/mp4"]],
  ["/assets/icon-organizer/search-after.gif", ["assets/icon-organizer/search-after.gif", "image/gif"]],
  ["/assets/icon-organizer/search-after-static.png", ["assets/icon-organizer/search-after-static.png", "image/png"]],
  ["/assets/icon-organizer/search-after-second.mp4", ["assets/icon-organizer/search-after-second.mp4", "video/mp4"]],
  ["/assets/icon-organizer/search-after-second.gif", ["assets/icon-organizer/search-after-second.gif", "image/gif"]],
  ["/assets/icon-organizer/search-after-second-static.png", ["assets/icon-organizer/search-after-second-static.png", "image/png"]],
  ["/assets/icon-organizer/idc-tech-fair-2025-1.webp", ["assets/icon-organizer/idc-tech-fair-2025-1.webp", "image/webp"]],
  ["/assets/icon-organizer/idc-tech-fair-2025-2.webp", ["assets/icon-organizer/idc-tech-fair-2025-2.webp", "image/webp"]],
  ["/favicon.ico", ["favicon.ico", "image/x-icon"]],
  ["/assets/favicon-32.png", ["assets/favicon-32.png", "image/png"]],
  ["/assets/apple-touch-icon.png", ["assets/apple-touch-icon.png", "image/png"]],
  ["/assets/home/flower-portrait.png", ["assets/home/flower-portrait.png", "image/png"]],
  ["/assets/home/code-flower-seed.png", ["assets/home/code-flower-seed.png", "image/png"]],
  ["/assets/home/thought-cloud-1.png", ["assets/home/thought-cloud-1.png", "image/png"]],
  ["/assets/home/thought-cloud-2.png", ["assets/home/thought-cloud-2.png", "image/png"]],
  ...["blue-flower", "pink-flowers", "fish-bowl", "party-worm"].flatMap((object) =>
    [1, 2].map((frame) => {
      const file = `assets/home/thought-${object}-${frame}.png`;
      return [`/${file}`, [file, "image/png"]];
    })),
  ["/assets/home/code-flower-sketch.png", ["assets/home/code-flower-sketch.png", "image/png"]],
  ["/assets/home/intro-handwritten.png", ["assets/home/intro-handwritten.png", "image/png"]],
  ["/assets/home/intro-highlight.png", ["assets/home/intro-highlight.png", "image/png"]],
  ["/assets/home/flower-hand-cursor.png", ["assets/home/flower-hand-cursor.png", "image/png"]],
  ["/assets/home/flower-cursor-dots.png", ["assets/home/flower-cursor-dots.png", "image/png"]],
  ["/assets/home/greeting-first.png", ["assets/home/greeting-first.png", "image/png"]],
  ["/assets/home/greeting-middle.png", ["assets/home/greeting-middle.png", "image/png"]],
  ["/assets/home/greeting-complete.png", ["assets/home/greeting-complete.png", "image/png"]],
  ["/assets/fonts/sora-variable.ttf", ["assets/fonts/sora-variable.ttf", "font/ttf"]],
  ["/assets/fonts/OFL.txt", ["assets/fonts/OFL.txt", "text/plain"]],
  ["/assets/home/subway-frame.png", ["assets/home/subway-frame.png", "image/png"]],
  ["/assets/home/subway-map.png", ["assets/home/subway-map.png", "image/png"]],
  ["/assets/home/subway-train.png", ["assets/home/subway-train.png", "image/png"]],
  ["/assets/home/subway-title.png", ["assets/home/subway-title.png", "image/png"]],
  ["/assets/home/subway-notes.png", ["assets/home/subway-notes.png", "image/png"]],
  ["/assets/home/pho-stool.png", ["assets/home/pho-stool.png", "image/png"]],
  ["/assets/home/pho-bowl.png", ["assets/home/pho-bowl.png", "image/png"]],
  ["/assets/home/pho-chopsticks.png", ["assets/home/pho-chopsticks.png", "image/png"]],
  ["/assets/home/pho-spark.png", ["assets/home/pho-spark.png", "image/png"]],
  ["/assets/home/pho-notes.png", ["assets/home/pho-notes.png", "image/png"]],
  ["/assets/home/pho-heart.png", ["assets/home/pho-heart.png", "image/png"]],
  ["/assets/home/coffee-base.png", ["assets/home/coffee-base.png", "image/png"]],
  ["/assets/home/coffee-steam.png", ["assets/home/coffee-steam.png", "image/png"]],
  ["/assets/home/coffee-drips.png", ["assets/home/coffee-drips.png", "image/png"]],
  ["/assets/home/coffee-spark.png", ["assets/home/coffee-spark.png", "image/png"]],
  ["/assets/home/coffee-notes.png", ["assets/home/coffee-notes.png", "image/png"]],
  ["/assets/home/coffee-morning-note.png", ["assets/home/coffee-morning-note.png", "image/png"]],
  ["/assets/home/coffee-aroma-note.png", ["assets/home/coffee-aroma-note.png", "image/png"]],
  ["/assets/home/marigold-cursor.png", ["assets/home/marigold-cursor.png", "image/png"]],
  ["/assets/home/doodle-cursor-arrow.png", ["assets/home/doodle-cursor-arrow.png", "image/png"]],
  ["/assets/home/doodle-cursor-yellow.png", ["assets/home/doodle-cursor-yellow.png", "image/png"]],
  ["/assets/home/doodle-cursor-white.png", ["assets/home/doodle-cursor-white.png", "image/png"]],
  ["/assets/home/doodle-cursor-curl.png", ["assets/home/doodle-cursor-curl.png", "image/png"]],
  ["/assets/fox/offui-add-note-16.svg", ["assets/fox/offui-add-note-16.svg", "image/svg+xml"]],
  ["/assets/fox/fluent-note-add-16-regular.svg", ["assets/fox/fluent-note-add-16-regular.svg", "image/svg+xml"]],
  ["/assets/fox/fox-add-note-16.svg", ["assets/fox/fox-add-note-16.svg", "image/svg+xml"]],
  ["/assets/fox/animation-fade-48.svg", ["assets/fox/animation-fade-48.svg", "image/svg+xml"]],
  ["/assets/fox/animation-fly-in-48.svg", ["assets/fox/animation-fly-in-48.svg", "image/svg+xml"]],
  ["/assets/fox/animation-spin-48.svg", ["assets/fox/animation-spin-48.svg", "image/svg+xml"]],
  ["/assets/fox/transition-push-48.svg", ["assets/fox/transition-push-48.svg", "image/svg+xml"]],
  ["/assets/fox/transition-wipe-48.svg", ["assets/fox/transition-wipe-48.svg", "image/svg+xml"]],
  ["/assets/fox/transition-split-48.svg", ["assets/fox/transition-split-48.svg", "image/svg+xml"]],
  ["/assets/fox/offui-animation-fade-32.svg", ["assets/fox/offui-animation-fade-32.svg", "image/svg+xml"]],
  ["/assets/fox/offui-animation-fly-in-32.svg", ["assets/fox/offui-animation-fly-in-32.svg", "image/svg+xml"]],
  ["/assets/fox/offui-animation-spin-32.svg", ["assets/fox/offui-animation-spin-32.svg", "image/svg+xml"]],
  ["/assets/fox/offui-transition-push-32.svg", ["assets/fox/offui-transition-push-32.svg", "image/svg+xml"]],
  ["/assets/fox/offui-transition-wipe-32.svg", ["assets/fox/offui-transition-wipe-32.svg", "image/svg+xml"]],
  ["/assets/fox/offui-transition-split-32.svg", ["assets/fox/offui-transition-split-32.svg", "image/svg+xml"]],
  ["/assets/fox/command-grouping-analysis.png", ["assets/fox/command-grouping-analysis.png", "image/png"]],
  ["/assets/fox/research-overview.png", ["assets/fox/research-overview.png", "image/png"]],
  ["/assets/fox/pixel-padding-comparison.png", ["assets/fox/pixel-padding-comparison.png", "image/png"]],
  ["/assets/fox/fox-banner.png", ["assets/fox/fox-banner.png", "image/png"]],
  ["/assets/fox/fox-ribbon-banner.png", ["assets/fox/fox-ribbon-banner.png", "image/png"]],
  ["/assets/fox/thumbnail-excel-ribbon.png", ["assets/fox/thumbnail-excel-ribbon.png", "image/png"]],
  ["/assets/fox/thumbnail-word-ribbon.png", ["assets/fox/thumbnail-word-ribbon.png", "image/png"]],
  ["/assets/fox/icon-creation-specs.png", ["assets/fox/icon-creation-specs.png", "image/png"]],
  ["/assets/fox/loop-creation-guide-hires.png", ["assets/fox/loop-creation-guide-hires.png", "image/png"]],
  ["/assets/fox/brush-exploration.png", ["assets/fox/brush-exploration.png", "image/png"]],
  ["/assets/fox/paint-bucket-exploration.png", ["assets/fox/paint-bucket-exploration.png", "image/png"]],
  ["/assets/fox/reapply-filter-accessibility.png", ["assets/fox/reapply-filter-accessibility.png", "image/png"]],
  ["/assets/fox/updated-office-ribbons.png", ["assets/fox/updated-office-ribbons.png", "image/png"]],
  ["/assets/fox/powerpoint-before.png", ["assets/fox/powerpoint-before.png", "image/png"]],
  ["/assets/fox/powerpoint-after.png", ["assets/fox/powerpoint-after.png", "image/png"]],
  ["/assets/fox/word-before.png", ["assets/fox/word-before.png", "image/png"]],
  ["/assets/fox/word-after.png", ["assets/fox/word-after.png", "image/png"]],
  ["/assets/fox/excel-before.png", ["assets/fox/excel-before.png", "image/png"]],
  ["/assets/fox/excel-after.png", ["assets/fox/excel-after.png", "image/png"]],
  ["/assets/fox/powerpoint-before-ribbon.png", ["assets/fox/powerpoint-before-ribbon.png", "image/png"]],
  ["/assets/fox/powerpoint-after-ribbon.png", ["assets/fox/powerpoint-after-ribbon.png", "image/png"]],
  ["/assets/fox/word-before-ribbon.png", ["assets/fox/word-before-ribbon.png", "image/png"]],
  ["/assets/fox/word-after-ribbon.png", ["assets/fox/word-after-ribbon.png", "image/png"]],
  ["/assets/fox/excel-before-ribbon.png", ["assets/fox/excel-before-ribbon.png", "image/png"]],
  ["/assets/fox/excel-after-ribbon.png", ["assets/fox/excel-after-ribbon.png", "image/png"]],
]);

const server = http.createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD", "Content-Type": "text/plain" });
    response.end("Method not allowed");
    return;
  }
  let pathname;
  try {
    pathname = new URL(request.url, "http://localhost").pathname;
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain" });
    response.end("Invalid request URL");
    return;
  }
  const entry = publicFiles.get(pathname);
  if (!entry) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Page not found");
    return;
  }
  try {
    const content = await fs.readFile(path.join(__dirname, entry[0]));
    const headers = {
      "Content-Type": entry[1].startsWith("text/") || entry[1] === "image/svg+xml" ? `${entry[1]}; charset=utf-8` : entry[1],
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      "Content-Length": content.length,
    };
    if (entry[1].startsWith("video/")) {
      headers["Accept-Ranges"] = "bytes";
      if (request.method === "GET" && request.headers.range) {
        const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
        const suffix = range && !range[1];
        const start = range ? (suffix ? Math.max(0, content.length - Number(range[2])) : Number(range[1])) : NaN;
        const end = range && range[2] && !suffix ? Math.min(Number(range[2]), content.length - 1) : content.length - 1;
        if (!range || (!range[1] && !range[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= content.length || end < start || (suffix && Number(range[2]) === 0)) {
          response.writeHead(416, { ...headers, "Content-Range": `bytes */${content.length}`, "Content-Length": 0 });
          response.end();
          return;
        }
        response.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${content.length}`, "Content-Length": end - start + 1 });
        response.end(content.subarray(start, end + 1));
        return;
      }
    }
    response.writeHead(200, headers);
    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    console.error(`Unable to serve ${entry[0]}:`, error);
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.end("Unable to load this page");
  }
});

if (require.main === module) {
  const port = Number(process.env.PORT || 5173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("PORT must be an integer between 1 and 65535.");
    process.exitCode = 1;
  } else {
    server.on("error", (error) => {
      console.error("Unable to start the portfolio server:", error.message);
      process.exitCode = 1;
    });
    server.listen(port, "127.0.0.1", () => {
      console.log(`Portfolio ready at http://127.0.0.1:${port}`);
    });
  }
}

module.exports = server;
