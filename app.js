const profile = {
  name: "Your Name",
  role: "Product & experience designer",
  introduction: "For the past 3.5 years, I've been designing experiences for Microsoft PowerPoint, helping people turn ideas into compelling stories. I focus on using AI where it truly matters, making complex tasks simpler, more intuitive, and meaningful.",
};

// Projects use supplied narratives.
const projects = [
  foxProject,
  {
    slug: "making-icons-searchable",
    name: "Making Icons searchable",
    label: "Making Icons searchable",
    description: "An AI powered Figma plugin that makes 5,000+ icons searchable.",
    category: "AI tooling",
    discipline: "AI · Figma plugin · Creative coding",
    number: "02",
    visual: "icon-organizer",
    isCaseStudy: true,
  },
  {
    slug: "template-validator",
    name: "Template Validator",
    label: "Template Validator",
    description: "Helping people build PowerPoint templates that work better with Copilot.",
    category: "UX design",
    discipline: "UX design · Content design · AI explainability",
    number: "03",
    visual: "template-validator",
    isCaseStudy: true,
  },
  {
    slug: "bug-logger",
    name: "Bug Logger",
    label: "Bug Logger",
    description: "Turning bug bashes into structured bugs with AI, without breaking the testing flow.",
    category: "AI tooling",
    discipline: "UX design · AI workflows · Bug bashing",
    number: "04",
    visual: "bug-logger",
    isCaseStudy: true,
  },
];

const page = document.body.dataset.page;
function route(path, query = "") {
  return `./${path}${query ? `?${query}` : ""}`;
}

function artwork(project) {
  if (project.visual === "fox") return foxArtwork();
  if (project.visual === "bug-logger") {
    return `<div class="art bug-card-art" aria-hidden="true"><img class="bug-card-skill" src="./assets/bug-logger/banner-skill.png" width="426" height="451" alt="" loading="lazy" decoding="async"><img class="bug-card-toolbar" src="./assets/bug-logger/banner-toolbar.png" width="1083" height="168" alt="" loading="lazy" decoding="async"></div>`;
  }
  if (project.visual === "template-validator") {
    return `<div class="art validator-card-art" aria-hidden="true"><img src="./assets/template-validator/thumbnail.png" width="794" height="616" alt="" loading="lazy" decoding="async"></div>`;
  }
  if (project.visual === "icon-organizer") {
    return `<div class="art organizer-card-art" aria-hidden="true"><img src="./assets/icon-organizer/thumbnail.png" width="957" height="642" alt="" loading="lazy" decoding="async"></div>`;
  }
  if (project.visual === "dashboard") {
    return `<div class="art art-dashboard" aria-hidden="true">
      <div class="dashboard-window">
        <aside class="mock-sidebar"><span class="mock-brand">e.</span><span class="mock-nav active">Overview</span><span class="mock-nav">My tasks</span><span class="mock-nav">Projects</span><span class="mock-nav">Notes</span><span class="mock-avatar">Y</span></aside>
        <div class="mock-content"><div class="mock-toolbar"><span>My workspace</span><span>↗</span></div><p class="mock-eyebrow">MONDAY, A FRESH START</p><h3>Make room for<br>what matters.</h3><div class="mock-summary"><span><strong>04</strong> tasks for today</span><span class="mock-pill">You've got this ↗</span></div><div class="mock-task"><i></i><span>Give that idea a little space</span><small>Design</small></div><div class="mock-task"><i></i><span>Find a fresh perspective</span><small>Explore</small></div><div class="mock-task"><i></i><span>Make something meaningful</span><small>Create</small></div></div>
      </div><span class="art-caption">LESS NOISE. MORE FOCUS.</span></div>`;
  }
  if (project.visual === "mobile") {
    return `<div class="art studio-place-art" aria-hidden="true">${studioMotif("place")}<span class="studio-study-mark">Closer.</span></div>`;
  }
  return `<div class="art studio-orbit-art" aria-hidden="true"><span class="studio-study-mark">What if?</span>${studioMotif("planet")}<span class="studio-orbit-spark">${studioMotif("spark")}</span></div>`;
}

const studioMotifs = {
  flower: `<path d="M130 228C154 174 104 134 117 96" fill="none" stroke="var(--cp-text)" stroke-width="11" stroke-linecap="round"/><path d="M135 178C94 178 65 150 66 132C103 129 138 147 135 178ZM134 150C130 115 161 93 192 93C187 122 163 145 134 150ZM139 202C153 170 183 161 200 164C188 189 162 202 139 202Z" fill="var(--cp-accent)"/><path d="M117 100C81 106 48 78 54 52C60 28 91 40 104 66C94 35 108 11 126 16C149 23 132 55 130 69C154 43 185 50 177 72C171 93 141 108 117 100Z" fill="var(--cp-coral)"/>`,
  spark: `<path d="M120 32V208M32 120H208M58 58L182 182M58 182L182 58" fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round"/>`,
  planet: `<circle cx="120" cy="120" r="66" fill="var(--cp-orange)"/><path d="M164 77C113 68 72 102 66 145C87 120 124 105 170 108Z" fill="var(--cp-midnight)" opacity=".16"/><ellipse cx="120" cy="120" rx="104" ry="25" transform="rotate(-26 120 120)" fill="none" stroke="var(--cp-pink)" stroke-width="9"/><circle cx="98" cy="83" r="5" fill="var(--cp-ivory)" opacity=".6"/>`,
  loop: `<path d="M46 111C75 30 166 4 175 45C188 97 55 119 48 158C38 213 172 109 173 146C174 172 134 209 199 184" fill="none" stroke="var(--cp-pink)" stroke-width="14" stroke-linecap="round"/>`,
  landscape: `<path d="M2 229C20 185 42 152 67 178C85 132 119 86 143 115C164 139 132 184 163 190C182 192 192 160 209 170C230 181 235 214 240 233Z" fill="var(--cp-blue)"/><path d="M1 239C33 215 54 164 83 180C110 198 88 227 131 231C170 228 186 203 207 216L240 240Z" fill="var(--cp-midnight)" opacity=".3"/>`,
  arches: `<path d="M37 200C37 50 135 23 140 175" fill="none" stroke="var(--cp-mustard)" stroke-width="23" stroke-linecap="round"/><path d="M95 200C95 83 183 65 182 200Z" fill="var(--cp-pink)"/><path d="M142 201C142 115 210 66 214 118V201Z" fill="var(--cp-accent)"/>`,
  place: `<path d="M0 0H240V240H0Z" fill="var(--cp-blue)"/><circle cx="53" cy="51" r="23" fill="var(--cp-mustard)"/><path d="M0 119L113 78V240H0Z" fill="var(--cp-pink)"/><path d="M113 78L240 122V240H113Z" fill="var(--cp-coral)"/><path d="M147 240V169C147 143 187 143 187 169V240ZM34 147H60V180H34ZM76 132H96V164H76" fill="var(--cp-midnight)"/><path d="M206 240V167M207 197L184 181M207 185L229 164M206 172L198 151" fill="none" stroke="var(--cp-accent)" stroke-width="7" stroke-linecap="round"/>`,
};
let studioMotifCount = 0;
function studioMotif(type) {
  if (!Object.hasOwn(studioMotifs, type)) throw new Error(`Unknown studio motif: ${type}`);
  const grainId = `studio-grain-${++studioMotifCount}`;
  return `<svg class="studio-motif" data-motif="${type}" viewBox="0 0 240 240" preserveAspectRatio="${type === "place" ? "xMidYMid slice" : type === "flower" ? "none" : "xMidYMid meet"}" aria-hidden="true" focusable="false"><defs><filter id="${grainId}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" seed="12" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer result="grain"><feFuncA type="linear" slope=".28"/></feComponentTransfer><feBlend in="SourceGraphic" in2="grain" mode="soft-light"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs><g filter="url(#${grainId})">${studioMotifs[type]}</g></svg>`;
}

function projectCard(project) {
  const label = "Project";
  const title = project.visual === "fox" ? "FOX Icons:<br>Built to scale" : project.name;
  const visual = project.visual === "fox"
    ? `<div class="art studio-fox-art" role="img" aria-label="Two cropped Office ribbons on yellow: Excel's styles and cell commands above Word's clipboard and font tools."><img class="studio-fox-ribbon studio-fox-ribbon-excel" src="./assets/fox/thumbnail-excel-ribbon.png" width="3444" height="374" alt="" loading="lazy" decoding="async"><img class="studio-fox-ribbon studio-fox-ribbon-word" src="./assets/fox/thumbnail-word-ribbon.png" width="4206" height="456" alt="" loading="lazy" decoding="async"></div>`
    : artwork(project);
  return `<article class="project-card${project.visual === "fox" ? " studio-featured" : ""}" data-category="${project.category}"><a class="project-link" href="${route("project.html", `project=${project.slug}`)}" aria-label="View ${label.toLowerCase()}: ${project.name}"><div class="project-art">${visual}<span class="project-open">↗</span></div><div class="project-copy"><div class="project-meta"><span>${label}</span><span>${project.number}</span></div><h3>${title}</h3><p>${project.description}</p></div></a></article>`;
}

function renderBugLogger(next) {
  const chapters = [
    ["bug-problem", "The problem"],
    ["bug-workflow", "First exploration"],
    ["bug-evolution", "Second version"],
    ["bug-impact", "Impact"],
  ];
  return `<article class="fox-case fox-visual-case bug-case">
    <header class="fox-intro wrap">
      <a class="text-link back-link" href="${route("index.html")}">← All work</a>
      <p class="eyebrow">AI TOOLING · WORKFLOW DESIGN</p>
      <h1>Bug<br><em>Logger</em></h1>
      <p class="fox-summary">Turning bug bashes into structured bugs with AI, without breaking the testing flow.</p>
    </header>
    <section class="bug-hero wrap fox-reveal" aria-labelledby="bug-hero-title"><div class="bug-hero-copy"><p class="eyebrow">THE CORE IDEA</p><h2 id="bug-hero-title">Capture naturally.<br><em>Let AI structure the report.</em></h2><p>Less time documenting each issue. More room to keep testing.</p></div><div class="bug-hero-images"><img class="bug-banner-skill" src="./assets/bug-logger/banner-skill.png" width="426" height="451" alt="Bug Logger skill document" decoding="async"><img class="bug-banner-toolbar" src="./assets/bug-logger/banner-toolbar.png" width="1083" height="168" alt="Bug Logger widget toolbar with screenshot, recording and microphone controls" decoding="async"></div></section>
    <div class="fox-story-layout wrap">
      <nav class="fox-chapters" aria-label="Project chapters"><p class="eyebrow">THE STORY</p>${chapters.map(([id, label], index) => `<a href="#${id}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`).join("")}</nav>
      <div class="fox-story">
        <section class="fox-section fox-chapter" id="bug-problem" aria-labelledby="bug-problem-title">
          <header class="fox-chapter-intro fox-reveal"><h2 id="bug-problem-title"><span class="fox-chapter-label">01 / THE PROBLEM</span>Finding a bug shouldn't<br><em>break the testing flow.</em></h2><p>As we built new apps, we needed human eyes to catch bugs and understand what had gone wrong. Bug bashes helped us find those issues, but each finding still needed to become a clear, actionable report.</p></header>
          <p>An issue might only take a few seconds to spot. Logging it meant capturing evidence, writing a clear description and reproduction steps, and creating a structured work item.</p>
          <p>During a bug bash, repeating that process could become a significant interruption. Every issue pulled people away from testing and into documentation.</p>
          <blockquote class="fox-pullquote fox-reveal">I wanted to reduce the gap between finding a bug and filing a useful bug.</blockquote>
        </section>
        <section class="fox-section fox-chapter" id="bug-workflow" aria-labelledby="bug-workflow-title">
          <header class="fox-chapter-intro fox-reveal"><h2 id="bug-workflow-title"><span class="fox-chapter-label">02 / FIRST EXPLORATION</span>My first exploration.<br><em>A widget for bug capture.</em></h2><p>The idea began as a documentation tool before evolving into Bug Logger. My first exploration focused on a simpler idea: capture naturally, and let AI structure the report.</p></header>
          <p>My first exploration was a widget that sat alongside the app being tested. A compact capture control let people record an issue, while a journal brought saved findings together for review before logging them in a batch.</p>
          <figure class="fox-document bug-demo bug-version-one fox-reveal"><div class="bug-demo-frame"><video controls playsinline preload="metadata" poster="./assets/bug-logger/version-one-poster.png" aria-label="First Bug Logger version, a narrated walkthrough of desktop widget and mobile bug capture" aria-describedby="bug-version-one-caption"><source src="./assets/bug-logger/version-one.mp4" type="video/mp4">Your browser cannot play this recording. <a href="./assets/bug-logger/version-one.mp4">Download the first version recording</a>.</video></div><figcaption id="bug-version-one-caption">Version one: the desktop widget, saved findings in the journal, and mobile bug capture. Play the recording to hear the walkthrough.</figcaption></figure>
          <p id="bug-version-one-error" class="organizer-video-error" role="alert" hidden>The first version recording could not be played. <a href="./assets/bug-logger/version-one.mp4">Open or download the recording</a>.</p>
          <p>Instead of stopping to manually document every issue, people could use screenshots, screen recordings and spoken descriptions as input.</p>
          <div class="bug-inputs fox-reveal"><div><h3>Screenshots</h3><p>Capture what went wrong.</p></div><div><h3>Screen recordings</h3><p>Keep the sequence of events.</p></div><div><h3>Spoken descriptions</h3><p>Explain the issue while testing.</p></div></div>
          <p>AI could turn that context into structured bug information:</p>
          <ul class="bug-outputs fox-reveal"><li>A concise bug description</li><li>Reproduction steps</li><li>Screenshot context</li><li>Supporting information for investigation</li><li>A structured format suitable for Azure DevOps (ADO)</li></ul>
          <p>The workflow also allowed bugs to be captured while testing continued, reviewed afterwards, and then logged together rather than interrupting the session for every individual issue. The first version could log all the reviewed bugs in one click and kept a history so people could revisit earlier reports.</p>
          <blockquote class="fox-pullquote fox-reveal">But then we asked: why do we need another app?</blockquote>
          <p>The widget made documentation easier, but it was still a separate app to manage. That question shifted our focus from building another destination to bringing bug logging into the workflow people were already using.</p>
        </section>
        <section class="fox-section fox-chapter" id="bug-evolution" aria-labelledby="bug-evolution-title">
          <header class="fox-chapter-intro fox-reveal"><h2 id="bug-evolution-title"><span class="fox-chapter-label">03 / SECOND VERSION</span>From a widget<br><em>to a Cowork skill.</em></h2><p>What started as a documentation tool evolved into bug capture, and then into a broader workflow supporting the testing session.</p></header>
          <p>A teammate came up with the skill version of Bug Logger in Cowork. I built on top of it to make bug identification and supporting evidence more precise. Rather than waiting for people to use specific words or explicitly announce a bug, the skill could understand the issue from the conversation and screen recording, then trim the video to the relevant moments.</p>
          <p>The later Cowork workflow could work from meeting recordings and chat, identify candidate bugs, check for duplicates, structure the findings and create a reviewed list before anything was filed.</p>
          <figure class="fox-document bug-demo bug-version-two fox-reveal"><div class="bug-demo-frame"><video controls playsinline preload="metadata" poster="./assets/bug-logger/version-two-poster.png" aria-label="Second Bug Logger version, a narrated walkthrough of the Cowork bug logging skill and Azure DevOps workflow" aria-describedby="bug-version-two-caption"><source src="./assets/bug-logger/version-two.mp4" type="video/mp4">Your browser cannot play this recording. <a href="./assets/bug-logger/version-two.mp4">Download the second version recording</a>.</video></div><figcaption id="bug-version-two-caption">Version two: a Cowork skill working from a bug bash recording and chat to prepare structured bugs for ADO, with human review before filing. Play the recording to hear the walkthrough.</figcaption></figure>
          <p id="bug-version-two-error" class="organizer-video-error" role="alert" hidden>The second version recording could not be played. <a href="./assets/bug-logger/version-two.mp4">Open or download the recording</a>.</p>
          <p>I continued tweaking this evolved version as we used it in product bug bashes.</p>
          <figure class="bug-flow fox-reveal" aria-labelledby="bug-flow-caption"><figcaption id="bug-flow-caption">From manual documentation after every issue to a workflow that keeps testing moving.</figcaption><ol><li><span class="eyebrow">01</span><h3>Capture testing naturally</h3><p>Keep evidence and context while the session continues.</p></li><li><span class="eyebrow">02</span><h3>AI structures the evidence</h3><p>Turn the captured context into candidate bug reports.</p></li><li><span class="eyebrow">03</span><h3>Human reviews</h3><p>Review the findings before anything is filed.</p></li><li><span class="eyebrow">04</span><h3>Bug is ready for triage</h3><p>Log the reviewed bugs together in a structured format.</p></li></ol></figure>
        </section>
        <section class="fox-section fox-chapter fox-conclusion" id="bug-impact" aria-labelledby="bug-impact-title">
          <header class="fox-chapter-intro fox-reveal"><h2 id="bug-impact-title"><span class="fox-chapter-label">04 / IMPACT</span>From an experiment<br><em>to a team habit.</em></h2><p>Bug Logger became actively used in product bug bashes.</p></header>
          <p>Team feedback described bug work that could previously take around half an hour being reflected in the system within a few minutes. This was a team reported improvement, not a measured benchmark.</p>
          <p>More importantly, when Bug Logger was unavailable, people started asking when it would be restored. For me, that was the strongest signal of impact.</p>
          <div class="fox-closing fox-reveal"><h3>The experiment had become part<br><em>of the team's working process.</em></h3></div>
        </section>
      </div>
    </div>
  </article>
  <section class="fox-case-exit wrap" aria-labelledby="bug-exit-title"><p class="eyebrow">END OF PROJECT</p><h2 id="bug-exit-title">Explore more work.</h2><div class="fox-case-exit-links"><a class="button" href="${route("index.html")}">All work <span aria-hidden="true">↗</span></a><a class="text-link" href="${route("project.html", `project=${next.slug}`)}">Next project: ${next.label} <span aria-hidden="true">↗</span></a></div></section>`;
}

function renderTemplateValidator(next) {
  const chapters = [
    ["validator-challenge", "The challenge"],
    ["validator-role", "My role"],
    ["validator-feedback", "Feedback model"],
    ["validator-workflow", "Resolution workflow"],
    ["validator-evolution", "Product evolution"],
    ["validator-learning", "What I learnt"],
  ];
  return `<article class="fox-case fox-visual-case validator-case">
    <header class="fox-intro wrap">
      <a class="text-link back-link" href="${route("index.html")}">← All work</a>
      <p class="eyebrow">UX DESIGN · AI EXPLAINABILITY</p>
      <h1>Template<br><em>Validator</em></h1>
      <p class="fox-summary">Helping people build PowerPoint templates that work better with Copilot.</p>
    </header>
    <div class="validator-hero wrap">
      <img class="validator-cover fox-reveal" src="./assets/template-validator/cover.png" width="2820" height="1096" fetchpriority="high" decoding="async" alt="Template Validator cover showing Brand Kit templates beside a Template review panel, with prioritised findings, their impact, location and guidance on how to fix them.">
      <figure class="validator-bridge fox-reveal" aria-labelledby="validator-chart-caption">
        <p class="eyebrow">DESIGNING THE BRIDGE</p>
        <ol class="validator-chart"><li><span class="validator-chart-number">01</span><strong>Detection</strong><p>Identify template issues.</p><span class="validator-chart-arrow" aria-hidden="true">→</span></li><li><span class="validator-chart-number">02</span><strong>Understanding</strong><p>Explain what matters and why.</p><span class="validator-chart-arrow" aria-hidden="true">→</span></li><li><span class="validator-chart-number">03</span><strong>Resolution</strong><p>Make the next step clear.</p></li></ol>
        <figcaption class="validator-chart-goal" id="validator-chart-caption"><span class="eyebrow">THE GOAL</span><strong>Help people understand and resolve template issues without overwhelming them or blocking their workflow.</strong></figcaption>
      </figure>
    </div>
    <div class="fox-story-layout wrap">
      <nav class="fox-chapters" aria-label="Project chapters"><p class="eyebrow">THE STORY</p>${chapters.map(([id, label], index) => `<a href="#${id}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`).join("")}</nav>
      <div class="fox-story">
        <section class="fox-section fox-chapter" id="validator-challenge" aria-labelledby="validator-challenge-title">
          <header class="fox-chapter-intro fox-reveal"><h2 id="validator-challenge-title"><span class="fox-chapter-label">01 / THE CHALLENGE</span>A template can look fine.<br><em>And still not work well.</em></h2><p>A template can look perfectly fine to a person and still contain structural problems that affect the quality of presentations generated from it.</p></header>
          <p>When we started working on Template Validator, the challenge wasn't simply detecting those problems. It was figuring out how to communicate them in a way that people could actually understand and act on.</p>
          <div class="fox-two-up validator-panels fox-reveal"><div><h3>What the validation system knows</h3><p>Technical issues across the template.</p></div><div><h3>What the user needs to know</h3><p>What is wrong, why it matters, and what to do next.</p></div></div>
          <p>The product needed to bridge these two very different worlds. That became the core design problem I worked on.</p>
        </section>
        <section class="fox-section fox-chapter" id="validator-role" aria-labelledby="validator-role-title">
          <header class="fox-chapter-intro fox-reveal"><h2 id="validator-role-title"><span class="fox-chapter-label">02 / MY ROLE</span>Make a complex system<br><em>understandable.</em></h2><p>I designed the Template Validator experience, from the early UX explorations through content design, engineering handoff, evaluation and bug bashing.</p></header>
          <div class="validator-principles fox-reveal"><div><span class="eyebrow">01</span><h3>Prioritise</h3><p>Help people understand what needs their attention first.</p></div><div><span class="eyebrow">02</span><h3>Explain</h3><p>Translate technical findings into language that explains their effect on the presentation.</p></div><div><span class="eyebrow">03</span><h3>Make it actionable</h3><p>Give people clear guidance for resolving an issue instead of simply reporting that something is wrong.</p></div></div>
          <p>Template validation can surface many different types of findings. Treating every finding equally would create another problem: a technically comprehensive report that was difficult for someone to use.</p>
          <p>I explored a hierarchy that separated findings by importance and allowed people to progressively reveal more detail. Rather than exposing every technical signal immediately, the experience could help someone start with the most important problems and then work through lower priority recommendations.</p>
        </section>
        <section class="fox-section fox-chapter" id="validator-feedback" aria-labelledby="validator-feedback-title">
          <header class="fox-chapter-intro fox-reveal"><h2 id="validator-feedback-title"><span class="fox-chapter-label">03 / FEEDBACK MODEL</span>Not just a finding.<br><em>Guidance.</em></h2><p>This is how the validation data started: a dense list of technical checks and findings. We needed to simplify it for users and make the priorities clear.</p></header>
          <figure class="fox-document validator-data fox-reveal"><a class="fox-evidence" href="./assets/template-validator/validation-data.png" target="_blank" rel="noopener" aria-label="Open the original validation data screenshot"><img src="./assets/template-validator/validation-data.png" width="3418" height="1498" loading="lazy" decoding="async" alt="Original validation spreadsheet showing fix levels, categories, technical checks and proposed feedback, with some entries marked in red."></a><figcaption>The original validation data, before simplifying and prioritising the findings.</figcaption></figure>
          <p>We tested multiple decks and marked redundant issues to reduce the noise. Our goal was to surface a maximum of two or three critical issues, so users could focus on what mattered most without feeling overwhelmed.</p>
          <p>What information does someone actually need to fix a problem? I structured the feedback around three questions.</p>
          <ol class="validator-feedback-model fox-reveal"><li><h3>01. What happened?</h3><p>Describe the finding in understandable language.</p></li><li><h3>02. Why does it matter?</h3><p>Explain how this issue can influence the resulting presentation.</p></li><li><h3>03. How do I fix it?</h3><p>Give the user concrete guidance for resolving the issue.</p></li></ol>
          <p>This moved the experience away from presenting validation as a technical report and towards presenting it as guidance.</p>
          <div class="fox-principles"><span>Non blocking</span><span>Prioritised</span><span>Actionable</span></div>
          <p>We deliberately avoided colour coding findings. With so much information already on screen, more visual signals could overwhelm users. We wanted people to focus on what mattered and what to do next, without feeling blocked.</p>
          <div class="fox-two-up validator-panels fox-reveal">
            <div><h3>Check quality in the background</h3><p>Validation starts as soon as a user uploads a template, without interrupting their workflow.</p></div>
            <div><h3>Invite, rather than interrupt</h3><p>We gently prompt users to view the report. The template remains usable, with findings presented as suggestions rather than a barrier to adding it.</p></div>
          </div>
          <div class="validator-copy fox-reveal"><h3>Keep users in control</h3><p>In the user study, people told us they wanted to stay in control and see exactly what changes AI made for them. We chose to guide users rather than make those changes on their behalf. Automatic fixing remained outside the initial scope, and the MVP did not let users open the PowerPoint directly from the tool.</p><p>As a triad, we treated AI assisted fixing with user oversight as a north star vision. We built an MVP focused on assessment and guidance to get started and gather usage data before investing in that broader experience.</p></div>
        </section>
        <section class="fox-section fox-chapter" id="validator-workflow" aria-labelledby="validator-workflow-title">
          <header class="fox-chapter-intro fox-reveal"><h2 id="validator-workflow-title"><span class="fox-chapter-label">04 / RESOLUTION WORKFLOW</span>A list wasn't enough.<br><em>Bring feedback into the deck.</em></h2><p>A user could understand a finding in Brand Kit, but still had to locate the issue again in PowerPoint before making a correction.</p></header>
          <ol class="validator-workflow fox-reveal"><li>See the problem in Brand Kit</li><li>Find it again in PowerPoint</li><li>Fix it</li><li>Re upload</li></ol>
          <p>So we started exploring how validation feedback could travel back with the presentation itself.</p>
          <div class="validator-copy"><h3>From a list to an annotated PowerPoint</h3><p>We built an annotated PowerPoint exploration so the feedback could travel with the template. Selecting <strong>“Export reviewed PPT”</strong> downloads a reviewed copy with a findings summary and comments on the relevant slides, bringing the guidance closer to where users make changes.</p></div>
          <p>Instead of long paragraphs, we broke the guidance into clear, step by step actions users could perform in PowerPoint. Each suggested fix made it easier to understand what to change and how to do it.</p>
          <figure class="fox-document validator-export fox-reveal"><div class="validator-export-frame"><picture><source media="(prefers-reduced-motion: reduce)" srcset="./assets/template-validator/export-reviewed-static.png"><img src="./assets/template-validator/export-reviewed.gif" width="1920" height="1014" loading="lazy" decoding="async" alt="Annotated PowerPoint exploration showing the Export reviewed PPT action." aria-describedby="validator-export-caption"></picture></div><figcaption id="validator-export-caption">Select “Export reviewed PPT” to take the feedback into PowerPoint.</figcaption></figure>
          <p id="validator-export-error" class="organizer-video-error" role="alert" hidden>The export animation could not be loaded. <a href="./assets/template-validator/export-reviewed.mp4">Open or download the recording</a>.</p>
          <dl class="validator-annotation fox-reveal"><div><dt>Issue</dt><dd>What did the validator detect?</dd></div><div><dt>Location</dt><dd>Where does the problem occur?</dd></div><div><dt>Impact</dt><dd>Why does the issue matter?</dd></div><div><dt>Resolution</dt><dd>What should I change?</dd></div></dl>
          <figure class="fox-document validator-review-image fox-reveal"><a class="fox-evidence" href="./assets/template-validator/annotated-overview.png" target="_blank" rel="noopener" aria-label="Open the reviewed PowerPoint findings summary"><img src="./assets/template-validator/annotated-overview.png" width="3448" height="1804" loading="lazy" decoding="async" alt="A Template Review Findings slide in PowerPoint summarising issues, severity, location and how to fix them."></a><figcaption>A findings summary travels with the reviewed PowerPoint.</figcaption></figure>
          <figure class="fox-document validator-review-image validator-review-detail fox-reveal"><a class="fox-evidence" href="./assets/template-validator/annotated-detail.png" target="_blank" rel="noopener" aria-label="Open the annotated slide with its review comment"><img src="./assets/template-validator/annotated-detail.png" width="3446" height="1858" loading="lazy" decoding="async" alt="A PowerPoint slide with a Designer Bot comment explaining missing alt text and how to resolve it."></a><figcaption>Comments on the relevant slides explain the issue and the suggested fix.</figcaption></figure>
          <blockquote class="fox-reveal">From exporting validation data to bringing the guidance closer to where the correction happens.</blockquote>
          <p>We explored annotated PowerPoint alongside simpler report formats. <strong>An annotated deck did not become part of the initial release</strong>, but the exploration helped us think beyond the results surface and consider the entire resolution workflow.</p>
        </section>
        <section class="fox-section fox-chapter" id="validator-evolution" aria-labelledby="validator-evolution-title">
          <header class="fox-chapter-intro fox-reveal"><h2 id="validator-evolution-title"><span class="fox-chapter-label">05 / PRODUCT EVOLUTION</span>The interface evolved.<br><em>The principles continued.</em></h2><p>Template Validator eventually evolved into the Template Assessment experience available in Brand Kit today.</p></header>
          <p>The current production UI is visually different from my original explorations. The product now presents recommendations through a dedicated assessment surface with categories, expandable findings, passed items and the ability to copy results.</p>
          <figure class="fox-document validator-assessment fox-reveal"><div class="validator-export-frame"><picture><source media="(prefers-reduced-motion: reduce)" srcset="./assets/template-validator/assessment-latest-static.png"><img src="./assets/template-validator/assessment-latest.gif" width="1920" height="1014" loading="lazy" decoding="async" alt="The latest Template Assessment experience in Brand Kit, showing expandable findings with Why it matters, How to improve and Copy results." aria-describedby="validator-assessment-caption"></picture></div><figcaption id="validator-assessment-caption">The latest Template Assessment experience: explaining why an issue matters and how to improve it.</figcaption></figure>
          <p id="validator-assessment-error" class="organizer-video-error" role="alert" hidden>The assessment animation could not be loaded. <a href="./assets/template-validator/assessment-latest.mp4">Open or download the recording</a>.</p>
          <p>I don't see that evolution as the original design being replaced. For me, the more meaningful continuity is in the underlying product principles: <strong>prioritise what matters, explain why it matters, and make the next step clear.</strong></p>
          <p>The interface evolved as the wider Brand Kit experience evolved, while the fundamental user problem remained relevant.</p>
        </section>
        <section class="fox-section fox-chapter fox-conclusion" id="validator-learning" aria-labelledby="validator-learning-title">
          <header class="fox-chapter-intro fox-reveal"><h2 id="validator-learning-title"><span class="fox-chapter-label">06 / WHAT I LEARNT</span>The validator knew<br><em>what was wrong.</em></h2><p>Template Validator changed my perspective on explainability in AI products. A system can be extremely sophisticated at detecting problems, but that capability has limited value if a person doesn't understand what the system is telling them.</p></header>
          <p>The design challenge sits in the space between detection, understanding and resolution. My role was designing that bridge.</p>
          <div class="fox-closing fox-reveal"><h3>I focused on helping people<br><em>understand what to do next.</em></h3></div>
        </section>
      </div>
    </div>
  </article>
  <section class="fox-case-exit wrap" aria-labelledby="validator-exit-title"><p class="eyebrow">END OF PROJECT</p><h2 id="validator-exit-title">Explore more work.</h2><div class="fox-case-exit-links"><a class="button" href="${route("index.html")}">All work <span aria-hidden="true">↗</span></a><a class="text-link" href="${route("project.html", `project=${next.slug}`)}">Next project: ${next.label} <span aria-hidden="true">↗</span></a></div></section>`;
}

function renderAfterTagging(name, caption, label = "AFTER TAGGING") {
  return `<figure class="fox-document organizer-after fox-reveal" id="${name}">
    <p class="eyebrow">${label}</p>
    <picture>
      <source media="(prefers-reduced-motion: reduce)" srcset="./assets/icon-organizer/${name}-static.png">
      <img src="./assets/icon-organizer/${name}.gif" width="550" height="688" loading="lazy" decoding="async" alt="${caption}" aria-describedby="${name}-caption">
    </picture>
    <figcaption id="${name}-caption">${caption}</figcaption>
    <p class="organizer-image-error" role="alert" hidden>The search animation could not be loaded. <a href="./assets/icon-organizer/${name}.mp4">Open the original recording</a>.</p>
  </figure>`;
}

function renderIconOrganizer(next) {
  const metrics = [
    ["5,000+", "icons organised"],
    ["8,000", "minutes of manual tagging saved"],
    ["1 click", "to auto tag selected icons"],
  ];
  const chapters = [["organizer-problem", "Problem"], ["organizer-solution", "Solution"], ["organizer-impact", "Impact"]];
  return `<article class="fox-case fox-visual-case organizer-case">
    <header class="fox-intro wrap">
      <a class="text-link back-link" href="${route("index.html")}">← All work</a>
      <div class="fox-title-row"><p class="eyebrow">AI TOOLING · FIGMA PLUGIN</p></div>
      <h1>Making Icons<br><em>searchable</em></h1>
      <p class="fox-summary">I built an AI powered Figma plugin to make the FOX icon library searchable.</p>
    </header>
    <figure class="fox-hero-art wrap" aria-label="FOX icon library and plugin impact">
      <div class="fox-hero-visual fox-reveal"><img src="./assets/icon-organizer/plugin-library-hires.png" width="3428" height="1644" fetchpriority="high" decoding="async" alt="The Icon Organizer plugin open over the FOX Icons Figma library, with an Auto Tag with Descriptions button."></div>
      ${foxMetricList(metrics, "fox-hero-metrics")}
    </figure>
    <div class="fox-story-layout wrap">
      <nav class="fox-chapters" aria-label="Project chapters"><p class="eyebrow">THE STORY</p>${chapters.map(([id, label], index) => `<a href="#${id}"><span>${String(index + 1).padStart(2, "0")}</span>${label}</a>`).join("")}</nav>
      <div class="fox-story">
        <section class="fox-section fox-chapter" id="organizer-problem" aria-labelledby="organizer-problem-title">
          <header class="fox-chapter-intro fox-reveal">
            <h2 id="organizer-problem-title"><span class="fox-chapter-label">01 / PROBLEM</span>5,000+ icons.<br><em>Almost no useful metadata.</em></h2>
          </header>
          <figure class="fox-document organizer-search-evidence fox-reveal">
            <a class="fox-evidence" href="./assets/icon-organizer/search-no-results.png" target="_blank" rel="noopener" aria-label="Open the unsuccessful icon search screenshot"><img src="./assets/icon-organizer/search-no-results.png" width="476" height="348" alt="Searching the FOX Icons Figma library for star anim shows No results on this page." loading="lazy" decoding="async"></a>
            <figcaption>Searching “star anim” returned no results.</figcaption>
          </figure>
        </section>
        <section class="fox-section fox-chapter" id="organizer-solution" aria-labelledby="organizer-solution-title">
          <header class="fox-chapter-intro fox-reveal">
            <h2 id="organizer-solution-title"><span class="fox-chapter-label">02 / SOLUTION</span>I built an AI powered Figma plugin to <em>make the library searchable.</em></h2>
            <p>Using VS Code, I built a Figma plugin that generates AI descriptions for selected icons, turning missing metadata into searchable terms.</p>
          </header>
          <figure class="fox-document organizer-demo fox-reveal">
            <video controls playsinline preload="metadata" aria-label="The Icon Organizer: AI powered Figma plugin demo" aria-describedby="organizer-demo-caption"><source src="./assets/icon-organizer/demo.mp4" type="video/mp4">Your browser does not support embedded video. <a href="./assets/icon-organizer/demo.mp4">Open the demo video</a>.</video>
            <figcaption id="organizer-demo-caption">The Icon Organizer · Watch the plugin in action</figcaption>
          </figure>
          <p class="organizer-video-error" role="alert" hidden>The demo could not be played. <a href="./assets/icon-organizer/demo.mp4">Open or download the video</a>.</p>
        </section>
        <section class="fox-section fox-chapter fox-conclusion" id="organizer-impact" aria-labelledby="organizer-impact-title">
          <header class="fox-chapter-intro fox-reveal">
            <h2 id="organizer-impact-title"><span class="fox-chapter-label">03 / IMPACT</span>Less time tagging icons.<br><em>More time designing.</em></h2>
          </header>
          <div class="organizer-after-grid">
            ${renderAfterTagging("search-after", "After tagging: searching star anim finds matching animation icons in the FOX library.")}
            ${renderAfterTagging("search-after-second", "AI generated tags added to each icon's description.", "TAGS ADDED TO ICONS")}
          </div>
          <figure class="fox-document organizer-event fox-reveal">
            <h3>Presenting Icon Organizer<br><em>to leadership at IDC Tech Fair 2025.</em></h3>
            <div class="organizer-event-photos">
              <a class="fox-evidence" href="./assets/icon-organizer/idc-tech-fair-2025-1.webp" target="_blank" rel="noopener" aria-label="Open the first IDC Tech Fair 2025 presentation photo"><img src="./assets/icon-organizer/idc-tech-fair-2025-1.webp" width="2016" height="1512" loading="lazy" decoding="async" alt="Icon Organizer presentation at IDC Tech Fair 2025, first event photo."></a>
              <a class="fox-evidence" href="./assets/icon-organizer/idc-tech-fair-2025-2.webp" target="_blank" rel="noopener" aria-label="Open the second IDC Tech Fair 2025 presentation photo"><img src="./assets/icon-organizer/idc-tech-fair-2025-2.webp" width="2016" height="1512" loading="lazy" decoding="async" alt="Icon Organizer presentation at IDC Tech Fair 2025, second event photo."></a>
            </div>
            <figcaption>Presenting Icon Organizer to leadership at IDC Tech Fair 2025.</figcaption>
          </figure>
        </section>
      </div>
    </div>
  </article>
  <section class="fox-case-exit wrap" aria-labelledby="organizer-exit-title"><p class="eyebrow">END OF PROJECT</p><h2 id="organizer-exit-title">Explore more work.</h2><div class="fox-case-exit-links"><a class="button" href="${route("index.html")}">All work <span aria-hidden="true">↗</span></a><a class="text-link" href="${route("project.html", `project=${next.slug}`)}">Next project: ${next.label} <span aria-hidden="true">↗</span></a></div></section>`;
}

const homeIllustrations = [
  {
    name: "NYC Subway",
    slug: "subway",
    width: 592,
    height: 656,
    layers: ["frame", "map", "train", "title", "notes"],
    description: "Hand drawn NYC Subway composition: a colorful route map in a blue edged frame, a yellow train, and handwritten notes about a maze of lines coming together.",
  },
  {
    name: "Pho in Vietnam",
    slug: "pho",
    width: 728,
    height: 720,
    layers: ["stool", "bowl", "chopsticks", "spark", "notes", "heart"],
    description: "Hand drawn Pho in Vietnam composition: a pink bowl of pho, chopsticks, a tiny orange street stool, a heart, and handwritten memories of fresh herbs and a warm hug of a bowl.",
  },
  {
    name: "Filter kaapi",
    slug: "coffee",
    width: 704,
    height: 696,
    layers: ["base", "steam", "drips", "spark", "notes", "morning-note", "aroma-note"],
    description: "Hand drawn filter kaapi composition: a yellow coffee filter, brown drips, pink steam, orange accents, a Filter Kaapi title, and handwritten notes about slow drips, mornings, and the rich aroma.",
  },
];

function renderCodeFlower() {
  const objects = [
    { slug: "blue-flower", label: "a blue flower with a pink heart" },
    { slug: "pink-flowers", label: "two pink flowers with a yellow star" },
    { slug: "fish-bowl", label: "a fish bowl with two yellow fish" },
    { slug: "party-worm", label: "a pink worm wearing a party hat" },
  ];
  return `<div class="code-flower" role="region" aria-label="Feed a thought code" data-state="idle">
    <div class="flower-stage" role="img" aria-label="A pink hand drawn thought cloud waiting for code">
      <div class="flower-growth" aria-hidden="true">
        <div class="flower-seed thought-cloud"><img src="./assets/home/thought-cloud-1.png" width="512" height="408" alt=""><img src="./assets/home/thought-cloud-2.png" width="512" height="408" alt=""></div>
        <div class="flower-bloom">${objects.map((object) => `<div class="thought-object" data-object="${object.slug}" data-label="${object.label}" hidden>${[1, 2].map((frame) => `<img src="./assets/home/thought-${object.slug}-${frame}.png" width="512" height="512" alt="">`).join("")}</div>`).join("")}</div>
      </div>
      <div class="flower-food" aria-hidden="true">${["{ }", "&lt;/&gt;", "( )", "if", "=>", "[ ]", "+", "let", "{ }", "01", "&lt;/&gt;", "++", "( )", "if", "[ ]", "=>", "{ }", "01"].map((token, index) => `<span style="--food-x:${(index % 2 ? 1 : -1) * (55 + index % 3 * 20)}px;--food-delay:${index * 100}ms">${token}</span>`).join("")}</div>
    </div>
    <button class="flower-feed" type="button" hidden>Feed me code</button>
    <p class="flower-status" role="status">Turning thoughts into something new with code.</p>
  </div>`;
}

function renderHome() {
  return `<section class="studio-hero wrap" aria-labelledby="home-heading">
    <div class="studio-hero-grid">
      <div class="studio-intro"><div class="studio-intro-copy"><div class="studio-kicker"><span class="intro-highlight" aria-hidden="true"><img src="./assets/home/intro-highlight.png" width="1849" height="268" alt=""></span><img class="intro-lettering" src="./assets/home/intro-handwritten.png?v=script" width="1849" height="268" alt="Hi, I am Tanuja · Product designer at Microsoft"></div><h1 id="home-heading">Solving real problems with AI.<br>Crafting stories that connect.</h1><p>${profile.introduction}</p><div class="studio-hero-links"><a class="studio-work-link" href="#work">Explore my work</a></div></div>${renderCodeFlower()}</div>
    </div>
  </section>
  <section class="work-section wrap studio-work" id="work" aria-labelledby="work-heading">
    <div class="section-heading"><h2 id="work-heading">Work</h2></div>
    <div class="project-grid">${projects.map(projectCard).join("")}</div>
  </section>
  <section class="studio-about wrap" aria-labelledby="studio-about-heading"><div class="studio-about-profile"><div class="studio-about-art"><img class="studio-about-portrait" src="./assets/home/flower-portrait.png" width="768" height="768" alt="Hand drawn portrait framed by a yellow flower" loading="lazy"></div><div class="studio-about-copy"><h2 id="studio-about-heading">Curiosity is<br>a useful <em>habit.</em></h2><div class="studio-about-links"><a class="text-link" href="${route("about.html")}">A little about me ↗</a><a class="text-link" href="${route("playground.html")}">Life and all ↗</a></div></div></div>
  <div class="home-artwork">
    <div class="studio-toy home-illustrations" role="region" aria-label="Illustrated memories"><figure class="studio-canvas"><div class="subway-composition">${homeIllustrations.map((illustration, index) => `<div class="home-illustration" role="img" aria-label="${illustration.description}" data-name="${illustration.name}"${index ? " hidden" : ""}>${illustration.layers.map((layer) => `<img class="illustration-layer ${illustration.slug}-${layer}" src="./assets/home/${illustration.slug}-${layer}.png" width="${illustration.width}" height="${illustration.height}" alt="" decoding="async">`).join("")}</div>`).join("")}</div><figcaption class="subway-caption">Some experiences stay with you. I draw mine.</figcaption></figure><div class="illustration-controls" hidden><button type="button" class="illustration-next">Next illustration <span aria-hidden="true">→</span></button></div><p class="illustration-status sr-only" aria-live="polite"></p></div>
  </div></section>`;
}

document.querySelector("#site-header").innerHTML = `<div class="nav-shell"><a class="brand" href="${route("index.html")}" aria-label="Home"><img src="./assets/apple-touch-icon.png?v=flower" width="48" height="48" alt=""></a><nav aria-label="Main navigation"><a href="${route("index.html")}#work" ${page === "work" || page === "project" ? 'aria-current="page"' : ""}>Work</a><a href="${route("creative-practice.html")}" ${page === "creative-practice" ? 'aria-current="page"' : ""}>Beyond product design</a><a href="${route("playground.html")}" ${page === "playground" ? 'aria-current="page"' : ""}>Life and all</a><a href="${route("about.html")}" ${page === "about" ? 'aria-current="page"' : ""}>About</a></nav><a class="contact-nav" href="#contact">Let's talk <span aria-hidden="true">↗</span></a></div>`;

initStickyHeader();

function initStickyHeader() {
  const header = document.querySelector("#site-header");
  const updateHeight = () => {
    document.documentElement.style.setProperty("--cp-header-height", `${header.getBoundingClientRect().height}px`);
  };
  updateHeight();
  if ("ResizeObserver" in window) {
    new window.ResizeObserver(updateHeight).observe(header);
  } else {
    window.addEventListener("resize", updateHeight, { passive: true });
  }
}

document.querySelector("#site-footer").innerHTML = `<section class="contact-section wrap" id="contact" aria-labelledby="contact-heading"><div><h2 id="contact-heading">Let's make<br>something <em>matter.</em></h2></div><div class="contact-socials" aria-label="Contact and social links">
  <a class="button contact-social-button" href="mailto:tanujamathur97@gmail.com"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/></svg>Email</a>
  <a class="button contact-social-button" href="https://www.linkedin.com/in/tanuja-5b11091a0/" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><circle cx="5" cy="5" r="2"/><path d="M3 9h4v12H3zm7 0h4v1.5c1-1.3 2.1-1.8 3.5-1.8 3 0 3.5 2 3.5 4.6V21h-4v-6.7c0-1.5-.2-2.6-1.5-2.6S14 12.9 14 14.3V21h-4z"/></svg>LinkedIn</a>
  <a class="button contact-social-button" href="https://www.instagram.com/tanuja_draws/" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>Instagram</a>
  </div></section><div class="footer-bottom wrap"><span>Vibe coded. Designer approved. Made with &lt;3</span><a href="#main">Back to top ↑</a></div>`;

function initLifeCollage() {
  const photos = document.querySelectorAll(".life-photo");
  photos.forEach((photo) => photo.addEventListener("click", () => {
    const wasSelected = photo.getAttribute("aria-pressed") === "true";
    photos.forEach((item) => item.setAttribute("aria-pressed", "false"));
    photo.setAttribute("aria-pressed", String(!wasSelected));
  }));
}

const main = document.querySelector("#main");
if (page === "work") {
  main.innerHTML = renderHome();
  initCodeFlower();
  initHomeIllustrations();
  initHomePortrait();
} else if (page === "about") {
  document.title = "About · Tanuja";
  main.innerHTML = `<article class="about-story wrap" aria-label="About Tanuja">
      <div class="about-photo"><img src="./assets/about/about-display.png" width="768" height="907" alt="Tanuja taking a mirror selfie, framed by a yellow flower shape." decoding="async"></div>
      <div class="about-story-copy">
        <header class="about-story-intro"><p class="eyebrow">ABOUT</p><h1>A little<br><em>about me.</em></h1><p>I have a soft spot for complicated problems, and making them feel simple.</p></header>
        <p>I'm Tanuja, a <strong>Product Designer at Microsoft</strong>, with a background spanning Applied Art, Graphic Design, Illustration, and Storytelling. My journey through the College of Art, New Delhi, and NID Ahmedabad has shaped how I see, think, and create.</p>
        <p>For the past 3.5 years, I've been designing experiences for <strong>Microsoft PowerPoint</strong>, simplifying complex challenges and exploring how AI can solve real problems in meaningful ways.</p>
        <div class="about-resume"><a class="button about-resume-button" href="./assets/about/tanuja-resume-2026.pdf" target="_blank" rel="noopener">Resume</a></div>
        <p>I'm also a storyteller at heart. Through my illustrations, I've built a creative community of around <strong>25K people on <a href="https://www.instagram.com/tanuja_draws/" target="_blank" rel="noopener">Instagram</a></strong>, sharing my love for art, culture, and everyday observations.</p>
        <p>I believe inspiration exists far beyond screens, and I'm always finding new ways to bring those experiences into what I create.</p>
        <section class="about-beyond" aria-labelledby="about-beyond-title"><h2 id="about-beyond-title">Beyond the screen.</h2><a class="button about-quests-button" href="${route("playground.html")}">Explore life and all <span aria-hidden="true">↗</span></a>
          <p>When I'm not designing, I'm usually following another curiosity. You might find me:</p>
          <ul><li>Getting lost in Indian art, textiles, architecture, and all their little details.</li><li>Exploring new places and cultures, sometimes just for a really good plate of food.</li><li>Cooking elaborate meals and experimenting with recipes.</li><li>Crocheting, embroidering, and picking up new crafts.</li><li>Rearranging and decorating my home.</li><li>Illustrating the little things that catch my eye.</li><li>Learning something new just for fun. Most recently, swimming!</li></ul>
          <p><strong>Eat. Create. Explore. Craft. Chill. Sleep. Repeat.</strong></p>
        </section>
        <p>Find my professional work on <a href="https://www.linkedin.com/in/tanuja-5b11091a0/" target="_blank" rel="noopener">LinkedIn</a>, explore my illustrations on <a href="https://www.instagram.com/tanuja_draws/" target="_blank" rel="noopener">Instagram</a>, or say hello at <a href="mailto:tanujamathur97@gmail.com">tanujamathur97@gmail.com</a>.</p>
      </div>
    </article>`;
} else if (page === "creative-practice") {
  document.title = "Beyond product design · Tanuja";
  main.innerHTML = `<section class="page-intro creative-intro wrap" aria-labelledby="creative-title"><p class="eyebrow">BEYOND PRODUCT DESIGN</p><h1 id="creative-title">A little beyond<br><em>the screen.</em></h1><p class="intro-description">I've also spent years helping startups bring their ideas to life through brand strategy, visual identities, packaging, and illustration.</p><a class="button creative-work-button" href="https://www.behance.net/tanujamath97" target="_blank" rel="noopener">Explore my creative work <span aria-hidden="true">↗</span></a></section>
    <section class="creative-gallery wrap" aria-label="Freelance packaging and illustration work">
      <figure><img src="./assets/creative-practice/project-01.webp" width="1600" height="1169" alt="Colorful illustrated Phool Diwali gift packaging with candles, flowers and festive details." loading="lazy" decoding="async"></figure>
      <figure><img src="./assets/creative-practice/project-02.webp" width="1600" height="1223" alt="Illustrated Phool Rakhi That Grows packaging, surrounded by sweets, flowers and a rakhi." loading="lazy" decoding="async"></figure>
      <figure class="creative-gallery-wide"><img src="./assets/creative-practice/project-03.webp" width="1600" height="905" alt="Phool essential oil bottles and illustrated cylindrical packaging arranged with natural ingredients." loading="lazy" decoding="async"></figure>
      <div class="creative-gallery-pair">
        <figure><img src="./assets/creative-practice/project-04.webp" width="1600" height="1039" alt="Nargis tea tins and boxes with colorful illustrations of people and everyday moments." loading="lazy" decoding="async"></figure>
        <figure><img src="./assets/creative-practice/metta-packaging.webp" width="1600" height="676" alt="Metta skincare packaging with pink serum boxes, a blue cleanser tube and carton, and stacked green boxes." loading="lazy" decoding="async"></figure>
      </div>
    </section>`;
} else if (page === "playground") {
  document.title = "Life and all · Your Name";
  const lifePhotos = [
    [10, "An outdoor swimming pool surrounded by buildings and greenery."],
    [17, "A walk on the Brooklyn Bridge beneath a cloudy sky."],
    [1, "Holding a colorful illustration of a family celebrating together."],
    [3, "A handmade crocheted duck resting in a palm."],
    [4, "A tiny crocheted panda with a green hood, held above an illustrated textile."],
    [5, "A small handmade face with glasses on a wooden surface."],
    [6, "An embroidery hoop filled with a swirling blue night sky."],
    [7, "Flowers in a glass vase beside a panda shaped ornament."],
    [8, "An ornate red decorative face hanging by a doorway."],
    [9, "A brass bowl and lamp beside a leafy potted plant."],
    [11, "A bowl of rice topped with vegetables and an egg."],
    [12, "Homemade round snacks and dips on a floral serving platter."],
    [13, "Exploring a mirrored room filled with reflective hanging spheres."],
    [14, "A mirror selfie in a pink checked dress."],
    [15, "Enjoying a moment outdoors beside a yellow stone wall."],
    [16, "Spending time with a white dog along a misty woodland path."],
  ];
  const lifeCollage = `<section class="life-collage wrap" aria-label="Life and all photo collage">${lifePhotos.map(([number, alt]) => `<button class="life-photo" type="button" aria-pressed="false" aria-label="Bring photo to front: ${alt}"><img src="./assets/life-and-all/photo-${String(number).padStart(2, "0")}.webp" width="900" height="1200" alt="${alt}" loading="lazy" decoding="async"></button>`).join("")}</section>`;
  main.innerHTML = `<section class="page-intro wrap"><h1>A little chaos.<br><em>A lot of joy.</em></h1></section>${lifeCollage}`;
  initLifeCollage();
} else if (page === "project") {
  const requestedSlug = new URLSearchParams(location.search).get("project");
  const slug = requestedSlug === "everyday" ? "fox-icons" : requestedSlug === "closer" ? "making-icons-searchable" : requestedSlug;
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    document.title = "Project not found · Your Name";
    main.innerHTML = `<section class="page-intro wrap"><p class="eyebrow">PROJECT NOT FOUND</p><h1>A little<br><em>off track.</em></h1><p class="intro-description">That project isn't part of this portfolio. Head back to explore the work.</p><a class="button" href="${route("index.html")}">Back to work ↗</a></section>`;
  } else if (projects[index].visual === "icon-organizer") {
    document.title = "Making Icons searchable · Your Name";
    document.querySelector('meta[name="description"]').setAttribute("content", projects[index].description);
    main.innerHTML = renderIconOrganizer(projects[(index + 1) % projects.length]);
    initFoxCaseStudy(main);
    const video = main.querySelector(".organizer-demo video");
    const reportVideoError = () => {
      main.querySelector("#organizer-solution > .organizer-video-error").hidden = false;
      console.error("Unable to play the Icon Organizer demo:", video.error);
    };
    video.addEventListener("error", reportVideoError);
    video.querySelector("source").addEventListener("error", reportVideoError);
    for (const name of ["search-after", "search-after-second"]) {
      const animation = main.querySelector(`#${name} img`);
      animation.addEventListener("error", () => {
        main.querySelector(`#${name} .organizer-image-error`).hidden = false;
        console.error("Unable to load the after-tagging search animation:", animation.src);
      });
    }
  } else if (projects[index].visual === "bug-logger") {
    document.title = "Bug Logger · Your Name";
    document.querySelector('meta[name="description"]').setAttribute("content", projects[index].description);
    main.innerHTML = renderBugLogger(projects[(index + 1) % projects.length]);
    initFoxCaseStudy(main);
    for (const name of ["one", "two"]) {
      const video = main.querySelector(`.bug-version-${name} video`);
      const reportVideoError = () => {
        main.querySelector(`#bug-version-${name}-error`).hidden = false;
        console.error(`Unable to play Bug Logger version ${name}:`, video.error);
      };
      video.addEventListener("error", reportVideoError);
      video.querySelector("source").addEventListener("error", reportVideoError);
    }
  } else if (projects[index].visual === "template-validator") {
    document.title = "Template Validator · Your Name";
    document.querySelector('meta[name="description"]').setAttribute("content", projects[index].description);
    main.innerHTML = renderTemplateValidator(projects[(index + 1) % projects.length]);
    initFoxCaseStudy(main);
    for (const name of ["export", "assessment"]) {
      const animation = main.querySelector(`.validator-${name} img`);
      animation.addEventListener("error", () => {
        main.querySelector(`#validator-${name}-error`).hidden = false;
        console.error(`Unable to load the Template Validator ${name} animation:`, animation.src);
      });
    }
  } else if (projects[index].visual === "fox") {
    document.title = "FOX Icons · Office icon system · Your Name";
    document.querySelector('meta[name="description"]').setAttribute("content", foxProject.description);
    main.innerHTML = renderFoxCaseStudy(projects[(index + 1) % projects.length]);
    initFoxCaseStudy(main);
  } else {
    const project = projects[index];
    const next = projects[(index + 1) % projects.length];
    document.title = `${project.label} · Sample project · Your Name`;
    main.innerHTML = `<section class="page-intro project-intro wrap"><a class="text-link back-link" href="${route("index.html")}">← All work</a><p class="eyebrow">${project.category.toUpperCase()} / SAMPLE CASE STUDY</p><h1>${project.name}</h1><p class="intro-description">${project.description}</p><div class="project-facts"><div><span>PROJECT</span><p>Illustrative concept</p></div><div><span>DISCIPLINES</span><p>${project.discipline}</p></div><div><span>STATUS</span><p>Placeholder content</p></div></div></section><div class="case-art wrap">${artwork(project)}</div><div class="case-content wrap"><aside><p class="eyebrow">IN THIS STORY</p><a href="#challenge">01 / The question</a><a href="#approach">02 / The process</a><a href="#outcome">03 / The reflection</a></aside><div><p class="placeholder-note">This case study demonstrates the structure only. It does not represent a real client, completed work, or measured results.</p><section id="challenge"><p class="eyebrow">01 / THE QUESTION</p><h2>Start with the right problem.</h2><p>${project.challenge}</p></section><section id="approach"><p class="eyebrow">02 / THE PROCESS</p><h2>Make the thinking visible.</h2><p>${project.approach}</p><div class="process-steps"><span>Understand</span><span>Explore</span><span>Refine</span></div></section><section id="outcome"><p class="eyebrow">03 / THE REFLECTION</p><h2>What changed. What comes next.</h2><p>${project.outcome}</p></section></div></div><div class="next-project wrap"><span class="eyebrow">${next.isCaseStudy ? "NEXT CASE STUDY" : "NEXT SAMPLE PROJECT"}</span><a href="${route("project.html", `project=${next.slug}`)}">${next.name}<span aria-hidden="true">↗</span></a></div>`;
  }
}

function initCodeFlower() {
  document.querySelectorAll(".code-flower").forEach((root) => {
    const button = root.querySelector(".flower-feed");
    const status = root.querySelector(".flower-status");
    const stage = root.querySelector(".flower-stage");
    const growth = root.querySelector(".flower-growth");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const objects = [...root.querySelectorAll(".thought-object")];
    let objectIndex = -1;
    let failed = false, inView = true;
    let messageTimers = [];
    const clearMessages = () => {
      messageTimers.forEach((timer) => window.clearTimeout(timer));
      messageTimers = [];
    };
    const updateMotion = () => {
      root.dataset.paused = String(failed || motion.matches || document.hidden || !inView);
    };
    const finish = () => {
      if (root.dataset.state !== "feeding" || failed) return;
      clearMessages();
      root.dataset.state = "bloomed";
      button.disabled = false;
      button.textContent = "Feed me more code";
      stage.setAttribute("aria-label", `A hand drawn illustration of ${objects[objectIndex].dataset.label}`);
      status.textContent = `Your thought became ${objects[objectIndex].dataset.label}.`;
      updateMotion();
    };
    const fail = (image) => {
      if (failed) return;
      failed = true;
      clearMessages();
      root.dataset.state = "error";
      button.hidden = true;
      updateMotion();
      status.textContent = "The thought artwork couldn't load. Please reload to try again.";
      console.error("Could not load thought artwork:", image.src);
    };
    const images = [...root.querySelectorAll("img")];
    images.forEach((image) => {
      image.addEventListener("error", () => fail(image));
      image.addEventListener("load", () => {
        if (!failed && images.every((item) => item.complete && item.naturalWidth > 0)) button.hidden = false;
      });
    });
    images.forEach((image) => {
      if (image.complete && !image.naturalWidth) fail(image);
    });
    if (!failed && images.every((image) => image.complete && image.naturalWidth > 0)) button.hidden = false;
    button.addEventListener("click", () => {
      if (failed || root.dataset.state === "feeding") return;
      objectIndex = (objectIndex + 1) % objects.length;
      objects.forEach((object, index) => { object.hidden = index !== objectIndex; });
      root.dataset.object = objects[objectIndex].dataset.object;
      root.dataset.state = "feeding";
      updateMotion();
      button.disabled = true;
      button.textContent = "Creating...";
      stage.setAttribute("aria-label", `Code is turning the thought cloud into ${objects[objectIndex].dataset.label}`);
      status.textContent = "Feeding a little code...";
      if (motion.matches) {
        finish();
      } else {
        messageTimers = [
          window.setTimeout(() => { status.textContent = "Thinking it through..."; }, 800),
          window.setTimeout(() => { status.textContent = "Making something new..."; }, 2800),
        ];
      }
    });
    growth.addEventListener("animationend", (event) => {
      if (event.target === growth && event.animationName === "code-flower-grow") finish();
    });
    motion.addEventListener("change", () => {
      if (motion.matches) finish();
      updateMotion();
    });
    window.addEventListener("pagehide", finish);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) finish();
      updateMotion();
    });
    if ("IntersectionObserver" in window) {
      new window.IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        updateMotion();
      }).observe(root);
    }
    updateMotion();
  });
}

function initHomePortrait() {
  const portrait = document.querySelector(".studio-about-portrait");
  if (!portrait) return;
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  let inView = !("IntersectionObserver" in window);
  let lastScroll = window.scrollY;
  let frame = 0, lastTime = 0, angle = 0, velocity = 0;
  const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
  const reset = () => {
    window.cancelAnimationFrame(frame);
    frame = lastTime = angle = velocity = 0;
    lastScroll = window.scrollY;
    portrait.classList.remove("is-shaking");
    portrait.style.removeProperty("--portrait-tilt");
    portrait.style.removeProperty("--portrait-lift");
  };
  const tick = (time) => {
    const step = lastTime ? Math.min((time - lastTime) / (1000 / 60), 3) : 1;
    lastTime = time;
    velocity = (velocity - angle * 0.12 * step) * Math.pow(0.82, step);
    angle = clamp(angle + velocity * step, 10);
    if (Math.abs(angle) < 0.03 && Math.abs(velocity) < 0.03) {
      reset();
      return;
    }
    portrait.style.setProperty("--portrait-tilt", `${angle}deg`);
    portrait.style.setProperty("--portrait-lift", `${-Math.abs(angle) * 0.7}px`);
    frame = window.requestAnimationFrame(tick);
  };
  window.addEventListener("scroll", () => {
    const delta = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    if (!motion.matches || !inView || delta === 0) return;
    velocity = clamp(velocity + clamp(delta * 0.12, 4), 6);
    if (!frame) {
      portrait.classList.add("is-shaking");
      frame = window.requestAnimationFrame(tick);
    }
  }, { passive: true });
  motion.addEventListener("change", reset);
  window.addEventListener("pagehide", reset);
  if ("IntersectionObserver" in window) {
    const observer = new window.IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) reset();
    });
    observer.observe(portrait.parentElement);
  }
}

function initHomeIllustrations() {
  const gallery = document.querySelector(".home-illustrations");
  if (!gallery) return;
  const slides = [...gallery.querySelectorAll(".home-illustration")];
  if (slides.length < 2) return;
  const controls = gallery.querySelector(".illustration-controls");
  const next = gallery.querySelector(".illustration-next");
  const status = gallery.querySelector(".illustration-status");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = 0;
  let hovered = false;
  let focused = false;
  let inView = !("IntersectionObserver" in window);
  let timer = 0;
  const schedule = () => {
    window.clearTimeout(timer);
    if (hovered || focused || !inView || reduced.matches || document.visibilityState === "hidden") return;
    timer = window.setTimeout(() => show((active + 1) % slides.length), 2500);
  };
  const show = (index, manual = false) => {
    active = index;
    slides.forEach((slide, slideIndex) => { slide.hidden = slideIndex !== active; });
    if (manual) status.textContent = `Illustration ${active + 1} of ${slides.length}: ${slides[active].dataset.name}`;
    schedule();
  };
  controls.hidden = false;
  next.addEventListener("click", () => show((active + 1) % slides.length, true));
  gallery.addEventListener("pointerenter", () => { hovered = true; schedule(); });
  gallery.addEventListener("pointerleave", () => { hovered = false; schedule(); });
  gallery.addEventListener("focusin", () => { focused = true; schedule(); });
  gallery.addEventListener("focusout", (event) => { focused = gallery.contains(event.relatedTarget); schedule(); });
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", schedule);
  if ("IntersectionObserver" in window) {
    const observer = new window.IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      schedule();
    });
    observer.observe(gallery);
  }
  schedule();
}

function initDoodleCursor() {
  const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  let cursor;
  let ready = false;
  let frame = 0;
  let position;
  let previousX;
  const bursts = new Set();
  const removeBurst = (burst) => {
    burst.remove();
    bursts.delete(burst);
  };
  const clearBursts = () => bursts.forEach(removeBurst);
  const isFlowerTarget = (target) => {
    if (!(target instanceof Element)) return false;
    const nativeCursor = window.getComputedStyle(target).cursor;
    return nativeCursor.includes("flower-hand-cursor.png") || nativeCursor === "none";
  };
  const hide = () => {
    if (!cursor) return;
    window.cancelAnimationFrame(frame);
    frame = 0;
    previousX = undefined;
    document.body.classList.remove("doodle-cursor-active");
    cursor.hidden = true;
    cursor.classList.remove("is-pressed");
  };
  const move = (event) => {
    if (!pointer.matches || !motion.matches || !ready || event.pointerType !== "mouse" || !isFlowerTarget(event.target)) {
      hide();
      return;
    }
    const turn = previousX === undefined ? 0 : Math.max(-14, Math.min(14, (event.clientX - previousX) * 0.8));
    previousX = event.clientX;
    const hovering = Boolean(event.target.closest('a[href], button, select, summary, label[for], input'));
    position = { x: event.clientX, y: event.clientY, turn, hovering };
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      if (!motion.matches) {
        hide();
        return;
      }
      cursor.classList.toggle("is-hovering", position.hovering);
      cursor.style.transform = `translate3d(${position.x - 34}px, ${position.y - 2}px, 0)`;
      cursor.style.setProperty("--doodle-turn", `${position.turn}deg`);
      cursor.hidden = false;
      document.body.classList.add("doodle-cursor-active");
    });
  };
  const enable = () => {
    if (!pointer.matches) {
      hide();
      clearBursts();
      return;
    }
    if (cursor) return;
    cursor = document.createElement("div");
    cursor.className = "doodle-cursor";
    cursor.hidden = true;
    cursor.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.alt = "";
    image.width = 64;
    image.height = 64;
    image.addEventListener("load", () => { ready = true; });
    image.addEventListener("error", () => {
      ready = false;
      hide();
      console.error("Unable to load flower-in-hand cursor; using the native cursor fallback.");
    });
    image.src = "./assets/home/flower-hand-cursor.png?v=bright";
    cursor.append(image);
    document.body.append(cursor);
    let dotsReady = false;
    const dots = document.createElement("img");
    dots.alt = "";
    dots.width = 458;
    dots.height = 224;
    dots.setAttribute("aria-hidden", "true");
    dots.addEventListener("load", () => { dotsReady = true; });
    dots.addEventListener("error", () => {
      dotsReady = false;
      clearBursts();
      console.error("Unable to load flower cursor dots; click bursts are disabled.");
    });
    dots.src = "./assets/home/flower-cursor-dots.png?v=bright";
    window.addEventListener("click", (event) => {
      if (!pointer.matches || !motion.matches || !ready || !dotsReady || event.button !== 0 || event.detail === 0 ||
          (event.pointerType && event.pointerType !== "mouse") || !isFlowerTarget(event.target)) return;
      if (bursts.size >= 12) removeBurst(bursts.values().next().value);
      const burst = dots.cloneNode();
      burst.className = "cursor-burst";
      burst.style.left = `${event.clientX - 48}px`;
      burst.style.top = `${event.clientY - 30}px`;
      burst.addEventListener("animationend", () => removeBurst(burst), { once: true });
      burst.addEventListener("animationcancel", () => removeBurst(burst), { once: true });
      bursts.add(burst);
      document.body.append(burst);
    });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", (event) => {
      move(event);
      if (ready && motion.matches && frame) cursor.classList.add("is-pressed");
    });
    window.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"));
    window.addEventListener("pointercancel", hide);
    window.addEventListener("pointerout", (event) => { if (!event.relatedTarget) hide(); });
    window.addEventListener("blur", () => { hide(); clearBursts(); });
    window.addEventListener("pagehide", clearBursts);
    window.addEventListener("keydown", hide);
    window.addEventListener("scroll", hide, { passive: true, capture: true });
  };
  pointer.addEventListener("change", enable);
  motion.addEventListener("change", () => { hide(); clearBursts(); });
  enable();
}

initDoodleCursor();
