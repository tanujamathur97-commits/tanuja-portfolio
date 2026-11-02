const foxProject = {
  slug: "fox-icons",
  name: "FOX Icons",
  label: "FOX Icons",
  description: "Leading icon production, quality, and FOX expansion across Office web apps.",
  category: "Product design",
  discipline: "Icon design · Production ownership · Design systems",
  number: "01",
  visual: "fox",
  isCaseStudy: true,
};

const foxMetrics = [
  ["5,000+", "icons created and redesigned"],
  ["4", "Office web apps"],
  ["30+", "icons / day at scale"],
  ["+24 pts", "Suite HVS benchmark"],
  ["~60%", "rated FOX ≥4 stars"],
  ["20 ms", "faster Time to Visual Readiness"],
];

function foxIconWall() {
  const paths = [
    '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h4"/>',
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M10 5v14M16 10v9"/>',
    '<path d="M4 5h16v12H4zM12 17v4M8 21h8M8 13l3-3 3 2 3-4"/>',
    '<path d="M5 4h11l3 3v13H5zM15 4v5h4M8 13h8M8 16h6"/>',
    '<path d="M4 7h6l2 2h8v11H4zM4 7V4h7l2 3h7v2"/>',
    '<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m4 17 5-4 4 3 4-5 3 4"/>',
    '<path d="M4 7h16M8 4 4 7l4 3M20 17H4M16 14l4 3-4 3"/>',
    '<path d="M5 5h14M5 10h10M5 15h14M5 20h10"/>',
    '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M7 10h6M10 7v6"/>',
    '<path d="m12 3 8 5v8l-8 5-8-5V8zM4 8l8 5 8-5M12 13v8"/>',
    '<rect x="4" y="6" width="16" height="14" rx="2"/><path d="M8 3v6M16 3v6M4 11h16M8 15h3M14 15h2"/>',
    '<path d="M5 4h14v16H5zM9 4v16M5 9h14M12 13h4M12 16h4"/>',
  ];
  return `<div class="fox-icon-wall" aria-hidden="true">${Array.from({ length: 48 }, (_, index) => `<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${paths[index % paths.length]}</svg></span>`).join("")}</div>`;
}

function foxArtwork() {
  return `<div class="art art-fox">${foxIconWall()}<div class="fox-card-word" aria-hidden="true">FOX<span>Fluent Office Crossover</span></div></div>`;
}

function foxMetricList(metrics, className) {
  return `<dl class="${className}">${metrics.map(([value, label]) => `<div class="fox-reveal"><dt>${label}</dt><dd>${value}${value === "~60%" ? `<span class="fox-rating-dots" aria-hidden="true">${Array.from({ length: 10 }, (_, index) => `<i${index < 6 ? ' class="filled"' : ""}></i>`).join("")}</span>` : ""}</dd></div>`).join("")}</dl>`;
}

function foxFlow(items, className = "") {
  return `<ol class="fox-flow ${className}">${items.map((item) => `<li>${item}</li>`).join("")}</ol>`;
}

function foxAddNoteComparison() {
  const variants = [
    { label: "Legacy OFFUI", path: "offui-add-note-16.svg", node: "741:51811" },
    { label: "Fluent", path: "fluent-note-add-16-regular.svg", node: "13374:336" },
    { label: "FOX", path: "fox-add-note-16.svg", node: "1253:1852" },
  ];
  return `<div class="fox-command-study">
    <h3>Add Note, across three systems.</h3>
    <div class="fox-icon-comparison">${variants.map((variant) => `<figure class="fox-icon-variant" data-source-node="${variant.node}">
      <div class="fox-icon-stage"><span class="fox-icon-glyph" data-display-scale="4"><img src="./assets/fox/${variant.path}" alt="${variant.label} Add Note icon"></span></div>
      <figcaption><strong>${variant.label}</strong></figcaption>
    </figure>`).join("")}</div>
  </div>`;
}

function foxResearchEvidence() {
  const signals = [
    ["There are <mark>too many places to look for commands</mark>, that makes me feel <mark>overwhelmed and inadequate</mark> finding what I need.", "Excel"],
    ["I have trouble finding things because the <mark>toolbar is cluttered</mark>...some of the icons are bigger than the rest of the options. There are two different sizes that I have to get through, it's a little harder to skim through than a uniform list... Color draws my eye. With the amount of color, <mark>my attention is split</mark>, <mark>I don't know what is more important than anything else</mark>, then I need to read the labels.", "PowerPoint"],
  ];
  return `<div class="fox-research" id="research">
    <div class="fox-research-signals">${signals.map(([quote, context]) => `<figure class="fox-research-card fox-reveal"><blockquote><p>“${quote}”</p></blockquote><figcaption class="sr-only">Anonymous · ${context}</figcaption></figure>`).join("")}</div>
    <p class="fox-research-attribution">From user interviews</p>
  </div>`;
}

function foxMotionStudy() {
  const groups = [
    ["Animations", [
      ["Fade", "animation-fade", "fade", "3604:1533", "741:120369"],
      ["Fly In", "animation-fly-in", "fly-in", "3604:1535", "741:122380"],
      ["Spin", "animation-spin", "spin", "3608:989", "741:122430"],
    ]],
    ["Transitions", [
      ["Push", "transition-push", "push", "3396:738", "741:122190"],
      ["Wipe", "transition-wipe", "wipe", "3397:804", "741:120856"],
      ["Split", "transition-split", "split", "3397:874", "741:122443"],
    ]],
  ];
  return `<div class="fox-motion-study" id="motion-study" aria-labelledby="fox-motion-title">
    <h3 id="fox-motion-title">The most fun part.<br><em>Simple, but still literal.</em></h3>
    ${groups.map(([label, icons], index) => `<div class="fox-motion-group">
      <div class="fox-motion-group-heading"><h4 id="fox-motion-group-${index}">${label}</h4><p class="fox-motion-key"><span>Original</span><span aria-hidden="true">→</span><span>FOX</span></p></div>
      <ul class="fox-motion-grid" aria-labelledby="fox-motion-group-${index}">${icons.map(([name, file, effect, node, originalNode]) => `<li class="fox-motion-card fox-reveal" data-effect="${effect}" data-source-node="${node}">
        <div class="fox-motion-stage"><img class="fox-motion-original" src="./assets/fox/offui-${file}-32.svg" width="32" height="32" data-source-node="${originalNode}" alt="Original OFFUI ${name} icon"><span class="fox-motion-arrow" aria-hidden="true"></span><img class="fox-motion-icon" src="./assets/fox/${file}-48.svg" width="48" height="48" alt="FOX ${name} icon"></div>
        <span>${name}</span>
      </li>`).join("")}</ul>
    </div>`).join("")}
  </div>`;
}

function foxBeforeAfter() {
  const apps = [["powerpoint", "PowerPoint"], ["word", "Word"], ["excel", "Excel"]];
  const versions = [["before", "Original"], ["after", "FOX"]];
  return `<div class="fox-before-after" id="before-after">
    ${versions.map(([version, label]) => `<div class="fox-comparison-phase" aria-labelledby="fox-ribbons-${version}">
      <h3 id="fox-ribbons-${version}">${label}</h3>
      ${apps.map(([slug, name]) => {
        const source = `./assets/fox/${slug}-${version}-ribbon.png`;
        return `<div class="fox-app-comparison fox-reveal">
          <h4>${name}</h4>
          <figure class="fox-evidence fox-ribbon-panel" id="fox-${slug}-${version}"><figcaption class="sr-only">${name} · ${label}</figcaption><a href="./assets/fox/${slug}-${version}.png" aria-label="Open ${name} ${label} screenshot at full size"><img class="fox-ribbon-full" src="${source}" width="4050" height="408" loading="lazy" decoding="async" alt="${name} ${label} ribbon."><span class="fox-ribbon-strips" aria-hidden="true">${["0%", "-85%", "-170%"].map((offset) => `<span class="fox-ribbon-strip" style="--fox-ribbon-offset: ${offset}"><img src="${source}" width="4050" height="408" loading="lazy" decoding="async" alt=""></span>`).join("")}</span></a></figure>
        </div>`;
      }).join("")}
    </div>`).join("")}</div>`;
}

const foxPipeline = [
  ["Metaphor", "Balanced Office familiarity with Fluent simplicity.", "Keep the command recognizable."],
  ["Naming", "Cataloged actual names across ribbons, menus, and contextual tabs.", "Give every asset a shared identity."],
  ["Creation", "Refined form, color, and consistency.", "Build one visual language."],
  ["Review", "Resolved ambiguity through shared craft reviews.", "Make quality a shared decision."],
  ["Export", "Prepared assets, sizes, and locale requirements.", "Turn drawings into a handoff."],
  ["Engineering", "Handed off icons so engineers could raise PRs and swap old icons with the new ones.", "Hand off icons. Ship the swap."],
  ["Validation", "A naming error replaced dialog close icons with trashcans. A week of fixes tightened review.", "Close the implementation gaps."],
  ["Localization", "Mapped direction, scripts, and sizes across 229 unique icons.", "Design beyond the default."],
];

function foxProcessScenes() {
  const icon = `<img class="fox-process-icon" src="./assets/fox/fox-add-note-16.svg" alt="Final FOX Add Note asset">`;
  const scenes = [
    `<div class="fox-process-orbit"><span>Familiarity</span><div class="fox-process-asset">${icon}</div><span>Clarity</span></div>`,
    `<div class="fox-process-requests"><span>Excel</span><span>Word</span><span>PowerPoint</span><span>OneNote</span></div><div class="fox-process-arrow" aria-hidden="true">↓</div><div class="fox-process-file">${icon}<strong>AddNoteboardNote</strong><span>Shared asset name</span></div>`,
    `<div class="fox-process-grid">${icon}</div><span class="fox-process-dimension">16 × 16</span>`,
    `<div class="fox-process-review"><div class="fox-process-asset">${icon}</div><ul><li><b aria-hidden="true">✓</b> Metaphor</li><li><b aria-hidden="true">✓</b> Color</li><li><b aria-hidden="true">✓</b> Consistency</li></ul></div><div class="fox-process-review-loop"><span>Production</span><b aria-hidden="true">↔</b><span>Shared review</span></div>`,
    `<div class="fox-process-export"><div class="fox-process-asset">${icon}</div><div class="fox-process-arrow" aria-hidden="true">↓</div><div class="fox-process-deliverables"><span><b aria-hidden="true">↗</b>SVG assets</span><span><b aria-hidden="true">↗</b>Size variants</span><span><b aria-hidden="true">↗</b>Locale needs</span></div></div>`,
    `<div class="fox-process-handoff"><div class="fox-process-file">${icon}<strong>Icon handoff</strong><span>Engineering</span></div><div class="fox-process-pr"><strong>Raise PRs</strong><b class="fox-process-arrow" aria-hidden="true">↓</b></div><div class="fox-process-swap"><div><span class="fox-process-swap-icon"><img class="fox-process-icon" src="./assets/fox/offui-add-note-16.svg" alt="Old OFFUI Add Note icon"></span><span>Old icons</span></div><b class="fox-process-arrow" aria-hidden="true">→</b><div><span class="fox-process-swap-icon">${icon}</span><span>New icons</span></div></div></div>`,
    `<div class="fox-process-repair"><div><div class="fox-process-map">Close</div><span>Expected</span></div><b class="fox-process-arrow" aria-hidden="true">→</b><div><div class="fox-process-map fox-process-map-error">Trash</div><span>Naming error</span></div></div>`,
    `<div class="fox-process-locales"><div class="fox-process-locale" role="img" aria-label="Left to right layout illustration"><span>LTR</span><i></i><i></i><i></i></div><div class="fox-process-locale fox-process-rtl" role="img" aria-label="Right to left layout illustration"><span>RTL</span><i></i><i></i><i></i></div></div><div class="fox-process-locale-count"><strong>229</strong><span>icons in the localization tracker</span></div>`,
  ];
  return scenes.map((scene, index) => `<li class="fox-process-panel fox-reveal" data-step="${index}" id="${index === 7 ? "localization" : `fox-process-${index}`}">
    <div class="fox-process-scenes"><div class="fox-process-scene" data-fox-scene="${index}">${scene}</div></div>
    <div class="fox-process-decision"><span class="fox-process-step-label">${String(index + 1).padStart(2, "0")} · ${foxPipeline[index][0]}</span><h3>${foxPipeline[index][2]}</h3><p>${foxPipeline[index][1]}</p></div>
  </li>`).join("");
}

function foxSystemInfographic() {
  return `<ol class="fox-system-demo fox-process-flow" aria-label="Icon production process">${foxProcessScenes()}</ol>`;
}

function foxRolloutStory() {
  const steps = [
    ["Excel pilot", `<div class="fox-pilot-tabs"><span>Home</span><span>Review</span><i aria-hidden="true"></i><i aria-hidden="true"></i><i aria-hidden="true"></i></div>`],
    ["Validate", `<div class="fox-proof-checks"><span><b aria-hidden="true">✓</b> HVS</span><span><b aria-hidden="true">✓</b> Task time</span></div>`],
    ["Scale across web", `<div class="fox-suite-stack"><span>Word</span><span>PowerPoint</span><span>OneNote</span></div>`],
  ];
  return `<div class="fox-program-story" id="rollout">
    <div class="fox-story-heading"><h3>Excel first. Then the suite.</h3><p>FY24 · 6 to 7 months</p></div>
    <ol class="fox-story-grid fox-rollout-flow" aria-label="Pilot to rollout">${steps.map(([title, art]) => `<li class="fox-story-card fox-reveal"><div class="fox-story-art">${art}</div><h4>${title}</h4></li>`).join("")}</ol>
  </div>`;
}

function foxAutomationStory() {
  const note = (file) => `<img class="fox-tool-asset" src="./assets/fox/${file}" width="16" height="16" alt="">`;
  const tools = [
    ["RTL flip plugin", `<div class="fox-process-locales"><div class="fox-process-locale"><span>LTR</span><i></i><i></i><i></i></div><div class="fox-process-locale fox-process-rtl"><span>RTL</span><i></i><i></i><i></i></div></div>`],
    ["Merge locale variants", `<div class="fox-tool-files" aria-hidden="true"><span>SVG</span><span>SVG</span><span>SVG</span></div><span class="fox-story-arrow" aria-hidden="true"></span><div class="fox-tool-package" aria-hidden="true">${note("fox-add-note-16.svg")}</div>`],
    ["Swap icons in Figma", `<div class="fox-tool-package" aria-hidden="true">${note("offui-add-note-16.svg")}</div><span class="fox-story-arrow" aria-hidden="true"></span><div class="fox-tool-package" aria-hidden="true">${note("fox-add-note-16.svg")}</div>`],
    ["Icons PR Bot", `<div class="fox-proof-checks"><span><b aria-hidden="true">✓</b> Scale</span><span><b aria-hidden="true">✓</b> Locale</span><span><b aria-hidden="true">✓</b> Style</span></div>`],
  ];
  return `<div class="fox-program-story" id="automation">
    <div class="fox-story-heading"><h3>Automate the repeat work.</h3><p>Tools built with shared engineering and partner teams.</p></div>
    <ul class="fox-story-grid fox-tool-grid" aria-label="Team built automation">${tools.map(([title, art]) => `<li class="fox-story-card fox-reveal"><div class="fox-story-art">${art}</div><h4>${title}</h4></li>`).join("")}</ul>
  </div>`;
}

function foxAdoptionStory() {
  const steps = [
    ["Find by function", `<div class="fox-adoption-tags"><span>Keywords</span><span>Metadata</span></div><span class="fox-story-arrow" aria-hidden="true"></span><img class="fox-tool-asset" src="./assets/fox/fox-add-note-16.svg" width="16" height="16" alt="FOX Add Note library asset">`],
    ["Use with confidence", `<div class="fox-adoption-guides"><span>Wiki</span><span>Tutorials</span></div>`],
    ["Create independently", `<div class="fox-suite-stack"><span>OneNote adopted FOX icons</span><span>Create + ship</span></div>`],
  ];
  return `<div class="fox-program-story" id="adoption">
    <div class="fox-story-heading"><h3>Find it. Use it. Own it.</h3></div>
    <ol class="fox-story-grid" aria-label="Self serve icon adoption">${steps.map(([title, art]) => `<li class="fox-story-card fox-reveal"><div class="fox-story-art">${art}</div><h4>${title}</h4></li>`).join("")}</ol>
  </div>`;
}

function renderFoxCaseStudy(next) {
  const chapters = [
    ["problem", "Problem"], ["insight", "Insight"], ["solution", "Solution"],
  ];
  return `<article class="fox-case fox-visual-case">
    <header class="fox-intro wrap">
      <a class="text-link back-link" href="${route("index.html")}">← All work</a>
      <div class="fox-title-row"><p class="eyebrow">FOX ICONS · MICROSOFT OFFICE</p></div>
      <h1>Designing an icon system<br>that could <em>scale across Office web.</em></h1>
      <p class="fox-summary">I led icon production, quality, and expansion across four Office web apps with FOX (Fluent Office Crossover).</p>
    </header>
    <figure class="fox-hero-art wrap" aria-label="FOX project banner and program metrics">
      <div class="fox-hero-visual fox-reveal"><img src="./assets/fox/fox-ribbon-banner.png" width="2440" height="544" fetchpriority="high" decoding="async" alt="Excel and Word command ribbons featuring FOX icons on a soft yellow to pink background."></div>
      ${foxMetricList([foxMetrics[0], foxMetrics[4], foxMetrics[5]], "fox-hero-metrics")}
    </figure>
    <div class="fox-story-layout wrap">
      <nav class="fox-chapters" aria-label="Project chapters"><p class="eyebrow">THE STORY</p>${chapters.map(([id, label], index) => `<a href="#${id}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`).join("")}</nav>
      <div class="fox-story">
        <section id="problem" class="fox-section fox-chapter" aria-labelledby="problem-heading">
          <header class="fox-chapter-intro fox-reveal">
            <h2 id="problem-heading"><span class="fox-chapter-label">01 / PROBLEM</span>Too many commands.<br><em>Not enough clarity.</em></h2>
            <p>Office looked dated, and its crowded command UI made tools harder to find and prioritize.</p>
            <p>My scope was the icon layer: visual hierarchy, recognition, and consistency, not command architecture.</p>
          </header>
          ${foxResearchEvidence()}
          <figure class="fox-evidence"><a href="./assets/fox/research-overview.png" aria-label="Open complete research slide at full size"><img src="./assets/fox/research-overview.png" width="1306" height="768" loading="lazy" decoding="async" alt="Full research slide balancing visual simplicity with efficiency and effectiveness, with interview quotes comparing Office and Google command interfaces."></a></figure>
        </section>
        <section id="insight" class="fox-section fox-chapter" aria-labelledby="insight-heading">
          <header class="fox-chapter-intro fox-reveal">
            <h2 id="insight-heading"><span class="fox-chapter-label">02 / INSIGHT</span>Modernize Office.<br><em>Keep it familiar.</em></h2>
            <p>Rebuilding Office web apps from the core gave us an opportunity to test new icons: a cleaner, more modern visual language that still felt familiar.</p>
            <p>Earlier iPad feedback showed that monochrome commands lost familiarity without labels. We kept recognizable color.</p>
          </header>
          <div class="fox-equation fox-reveal"><div><span>OFFICE</span><strong>Familiar color</strong></div><b aria-hidden="true">+</b><div><span>FLUENT</span><strong>Cleaner forms</strong></div><b aria-hidden="true">=</b><div class="fox-equation-result"><span>FOX</span><strong>The crossover</strong></div></div>
        </section>
        <section id="solution" class="fox-chapter" aria-labelledby="solution-heading">
        <section id="craft" class="fox-section">
          <header class="fox-chapter-intro fox-reveal">
            <h2 id="solution-heading"><span class="fox-chapter-label">03 / SOLUTION</span>Less noise.<br><em>Still recognizably Office.</em></h2>
          </header>
          ${foxAddNoteComparison()}
          <div class="fox-craft-explorations" id="pixel-decisions" aria-labelledby="fox-pixel-title">
            <div class="fox-story-heading fox-reveal">
              <h3 id="fox-pixel-title">Every pixel mattered.</h3>
              <p>At 20px, square shapes had 3px padding for optical balance; other shapes had 2px. That left less room for complex PowerPoint, Excel, and Word icons.</p>
              <p>I helped compare iterations and build stakeholder agreement on <strong>2px padding for square shapes</strong> and thicker details, including the magnifying glass. We prioritized legibility over strict optical balance.</p>
            </div>
            <figure class="fox-document fox-reveal"><a class="fox-evidence" href="./assets/fox/pixel-padding-comparison.png" aria-label="Open 20px icon padding and stroke comparison at full size"><img src="./assets/fox/pixel-padding-comparison.png" width="1650" height="722" loading="lazy" decoding="async" alt="Two image search icons enlarged on a pixel grid, comparing square image frames and magnifying glass details."></a><figcaption>Both icons use a 20px canvas; enlarged to compare padding and stroke weight.</figcaption></figure>
          </div>
          <div class="fox-craft-explorations" id="new-icon-craft" aria-labelledby="fox-new-icon-title">
            <div class="fox-story-heading"><h3 id="fox-new-icon-title">Not every icon was a redraw.</h3><p>We created icons from scratch, refined older designs, and reviewed existing icons for approval, including Excel's complex features.</p></div>
            <figure class="fox-document fox-reveal"><a class="fox-evidence" href="./assets/fox/brush-exploration.png" aria-label="Open brush icon exploration at full size"><img src="./assets/fox/brush-exploration.png" width="1767" height="768" loading="lazy" decoding="async" alt="Brush exploration comparing an experimental table and brush icon with the Fluent version and both treatments in the Excel ribbon."></a><figcaption>Brush: experimental versus Fluent, compared in Excel's Format as Table command.</figcaption></figure>
            <figure class="fox-document fox-reveal"><a class="fox-evidence" href="./assets/fox/paint-bucket-exploration.png" aria-label="Open paint bucket icon exploration at full size"><img src="./assets/fox/paint-bucket-exploration.png" width="1820" height="768" loading="lazy" decoding="async" alt="Paint bucket exploration showing Fluent, redrawn, and proposed variants alongside the ribbon, responding to feedback about legibility and color emphasis."></a><figcaption>Paint bucket: the proposed variant was approved in response to legibility and color emphasis feedback.</figcaption></figure>
            <figure class="fox-document fox-reveal"><a class="fox-evidence" href="./assets/fox/reapply-filter-accessibility.png" aria-label="Open Reapply Filter accessibility review at full size"><img src="./assets/fox/reapply-filter-accessibility.png" width="1867" height="768" loading="lazy" decoding="async" alt="Reapply Filter icon with a green reapply modifier and two pixel grid comparisons, flagged by the accessibility test team."></a><figcaption>Reapply Filter: flagged during accessibility testing, with modifier variants compared at pixel level.</figcaption></figure>
          </div>
          ${foxMotionStudy()}
          ${foxBeforeAfter()}
        </section>
        <section id="scale" class="fox-section">
          <span id="system" class="fox-anchor" aria-hidden="true"></span>
          <h2>One icon is craft.<br><em>Thousands need a system.</em></h2>
          ${foxRolloutStory()}
          <p>At scale, the team produced ${foxMetrics[2][0]} icons per day.</p>
          <figure class="fox-document fox-reveal" id="icon-specs"><a class="fox-evidence" href="./assets/fox/icon-creation-specs.png" aria-label="Open icon creation specs at full size"><img src="./assets/fox/icon-creation-specs.png" width="1730" height="768" loading="lazy" decoding="async" alt="FOX icon specs showing color guidance, multicolor icons, modifier colors, layers, and high contrast examples."></a><figcaption>Icon specs I created to guide consistent color, layers, and high contrast execution.</figcaption></figure>
          ${foxSystemInfographic()}
        </section>
        <section id="team" class="fox-section">
          <span id="role" class="fox-anchor" aria-hidden="true"></span>
          <h2>Lead the craft.<br><em>Scale it across apps.</em></h2>
          <figure class="fox-leadership-graph fox-reveal"><div class="fox-direction"><span class="eyebrow">MY ROLE / CROSS APP OWNERSHIP</span><strong>Lead production. Drive quality. Expand FOX.</strong></div><div class="fox-production-pair"><div><strong>Design production</strong><span>Icons · Review · Export</span></div><div><strong>Engineering partners</strong><span>PRs · Integration · Fixes</span></div></div><div class="fox-handoff"><span>Shared review</span><b aria-hidden="true">→</b><span>Engineering</span><b aria-hidden="true">→</b><span>Validation</span></div></figure>
          <p>I set icon specifications and reviewed designs across Excel, Word, PowerPoint, and OneNote. The wider program involved three design vendor partners.</p>
          <ul class="fox-operating-loop" aria-label="Program feedback loop"><li class="fox-reveal"><strong>Office hours</strong><span>Weekly triage</span></li><li class="fox-reveal"><strong>Bug bashes</strong><span>Milestone checks</span></li><li class="fox-reveal"><strong>Monitoring</strong><span>Usage · Surveys · Performance</span></li></ul>
        </section>
        <section id="alignment" class="fox-section">
          <span id="stakeholders" class="fox-anchor" aria-hidden="true"></span>
          <h2>Make adoption<br><em>part of the system.</em></h2>
          <p id="guidance">I aligned with Fluent / OPG partners and engineering stakeholders to resolve inconsistencies.</p>
          ${foxAutomationStory()}
          ${foxAdoptionStory()}
          <figure class="fox-document fox-reveal" id="creation-guide"><a class="fox-evidence" href="./assets/fox/loop-creation-guide-hires.png" aria-label="Open Loop icon creation guide at full size"><img src="./assets/fox/loop-creation-guide-hires.png" width="2048" height="1152" loading="lazy" decoding="async" alt="Loop FOX icon creation guide showing existing icon checks, OFFUI naming guidance, metaphor searches, and an embedded FOX icon library."></a><figcaption>The Loop guide I created to help other teams create FOX icons independently.</figcaption></figure>
        </section>
        <section id="impact" class="fox-section fox-conclusion">
          <h2>Not just a visual refresh.<br><em>A measurable shift.</em></h2>
          ${foxMetricList(foxMetrics.slice(3), "fox-impact-metrics")}
          <p>Reported FY24 program results. HVS (high value scenarios) reached 79%; the gain reflects suite wide changes, not icons alone. These results do not establish whether people found commands faster.</p>
          <div id="learning" class="fox-closing fox-reveal">
            <h3 id="ownership">A faster, well received Office experience.<br><em>A shared system other teams could build on.</em></h3>
          </div>
        </section>
        </section>
      </div>
    </div>
  </article>
  <section class="fox-case-exit wrap" aria-labelledby="fox-exit-title">
    <p class="eyebrow">END OF PROJECT</p>
    <h2 id="fox-exit-title">Explore more work.</h2>
    <div class="fox-case-exit-links">
      <a class="button" href="${route("index.html")}">All work <span aria-hidden="true">↗</span></a>
      <a class="text-link" href="${route("project.html", `project=${next.slug}`)}">Next project: ${next.label} <span aria-hidden="true">↗</span></a>
    </div>
  </section>`;
}

function initFoxCaseStudy(root) {
  if (typeof IntersectionObserver !== "undefined") {
    const reveals = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-seen");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    root.querySelectorAll(".fox-reveal, .fox-icon-variant, .fox-section > h2, .fox-section > p, .fox-section > .fox-evidence")
      .forEach((element) => reveals.observe(element));
  }

  const chapterLinks = [...root.querySelectorAll(".fox-chapters a")];
  const chapters = [...root.querySelectorAll(".fox-chapter")];
  const siteHeader = document.querySelector("#site-header");
  function updateCurrentChapter() {
    let current = chapters[0];
    if (!current) return;
    const readingLine = Math.max(window.innerHeight * 0.25, (siteHeader?.getBoundingClientRect().bottom || 0) + 48);
    for (const chapter of chapters) {
      if (chapter.getBoundingClientRect().top > readingLine) break;
      current = chapter;
    }
    chapterLinks.forEach((link) => {
      if (link.hash === `#${current.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  let chapterUpdatePending = false;
  function scheduleChapterUpdate() {
    if (chapterUpdatePending) return;
    chapterUpdatePending = true;
    window.requestAnimationFrame(() => {
      chapterUpdatePending = false;
      updateCurrentChapter();
    });
  }
  window.addEventListener("scroll", scheduleChapterUpdate, { passive: true });
  window.addEventListener("resize", scheduleChapterUpdate);
  updateCurrentChapter();

  function revealHashTarget() {
    const target = [...root.querySelectorAll("[id]")].find((element) => element.id === location.hash?.slice(1));
    if (!target) return;
    target.scrollIntoView({ behavior: "instant", block: "start" });
    updateCurrentChapter();
  }
  window.addEventListener("hashchange", revealHashTarget);
  revealHashTarget();
}
