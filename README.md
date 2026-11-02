# Portfolio foundation

An original, responsive multi-page portfolio with FOX Icons, Making Icons
searchable, Template Validator and Bug Logger projects.
The reference informed only the broad information architecture; no reference-site
copy, imagery, source code, or branding is included.

## Run

Requires Node.js 18 or newer. No packages need to be installed.

```sh
npm run dev
```

Open http://127.0.0.1:5173. To use another port: `PORT=5174 npm run dev`.
You can also open `index.html` directly in a browser. Use the local server for
embedded demo playback; the integrated browser may block video from `file://`.

## Pages

- `index.html`: introduction, work grid, portrait with its heading and About and Life and all links below it, illustrated memories beside it on desktop and below it on mobile, shared contact buttons
- `project.html?project=fox-icons`: FOX Icons case study (the previous `everyday` URL also opens FOX)
- `project.html?project=making-icons-searchable`: Problem → Solution → Impact, with the supplied FOX library screenshot, native demo video, and requested impact figures (the previous `closer` URL opens this replacement)
- `project.html?project=template-validator`: six chapters covering the challenge, role, feedback model, resolution explorations, product evolution and learnings
- `project.html?project=bug-logger`: the problem, first widget exploration, second Cowork version and impact
- `about.html`: supplied biography, education, PowerPoint work, interests and Life and all link, with Instagram and email contact destinations
- `playground.html`: Life and all, with an interactive scrapbook photo collage
- `creative-practice.html`: Beyond product design, a short introduction to freelance brand strategy, visual identities, packaging and illustration, with a pink Behance button and no decorative corner flower

Beyond product design includes five images, initially supplied in `Desktop/Archive 2.zip`:
Phool festive gifting, rakhi packaging, essential oils, Nargis tea and Metta
skincare. Originals are retained in `assets/creative-practice/`; the page serves
WebP display copies up to 1600px, about 1MB combined, without cropping the artwork.
The gallery uses two columns with a full width essential oils image on desktop
and a single column on mobile. The Metta image was replaced with the subsequently
supplied packaging collage. Nargis and Metta use proportional column widths to
share the same desktop height without cropping, and stack naturally on mobile.
Images have descriptive alt text, explicit
dimensions and lazy loading.

Navigation uses Work, Beyond product design, Life and all and About, with no icon beside Life and all.
Life and all opens with "A little chaos. A lot of joy." without a decorative corner shape.
It uses 16 of the 17 still images from `Downloads/Archive 3.zip`, including
the two HEIC photos. The mural photo was removed and the bridge photo moved into
its second position, without duplication. The archive's MP4 is not included in the photo collage.
The swimming photo leads the collage so it stays in the top row at every screen size.
Originals stay unserved in `assets/life-and-all/originals/`; orientation corrected,
metadata free WebP copies are limited to 1200px and total about 2.9MB.
Display copies are individually color balanced from the originals, converting
embedded color profiles to sRGB, applying bounded exposure curves (gamma
0.78 to 1.12), and gently balancing saturation (0.88 to 1.08). Highlights and
the intentionally dark mirrored room remain distinct; no global CSS filter
alters the photos, product artwork or portraits elsewhere.
The overlapping collage has small paper frames, varied offsets, gentle tilts and
decorative tape, with four desktop columns, three tablet columns and two mobile
columns. Hover or keyboard focus lifts a photo; click, tap, Space or Enter toggles
it to the front. Only one photo stays selected at a time, with `aria-pressed`
reflecting the selection. Reduced motion disables lifts and transitions while
preserving front selection. This interaction does not animate page navigation.
Photos remain uncropped, use descriptive alt text and lazy loading, and reserve
their dimensions. The former typography, layout and creative prompt experiments
have been removed; the shared contact footer follows the collage.
Work links directly to the homepage work section.
Pages use standard browser navigation with a static active tab highlight.
There are no page fades, moving pills or cross document snapshot animations.
Links, history, keyboard access and page anchors are not intercepted.
Stable scrollbar space prevents navigation layout shifts between page lengths.
The existing page filenames and
page identifiers remain stable so older links continue to work. About uses the
supplied biography without invented experience. A yellow Resume link follows
the PowerPoint experience paragraph and opens the supplied, unchanged
`assets/about/tanuja-resume-2026.pdf` in a new tab. The PDF is served as
`application/pdf`; its hover and keyboard focus lift respects reduced motion.
About includes the supplied LinkedIn and Instagram links, plus a `mailto:` email
link that opens the visitor's configured email application.
About's inline links have persistent pink underlines and a pink highlight on
hover or keyboard focus. Their transitions and the Life and all button's gentle
lift respect reduced motion.
The shared footer provides orange Email, yellow LinkedIn and pink Instagram buttons, in that order, with
decorative icons and visible labels. Email uses `mailto:`; social profiles open
in a new tab. Hover and keyboard focus lift the buttons unless reduced motion
is enabled.
The note "Vibe coded. Designer approved. Made with <3" replaces the footer copyright placeholder.
About pairs the supplied yellow flower photo with the biography, stacking it
above the text on smaller screens. The original 13097 × 15456 PNG is preserved
in `assets/about/about.png`; the page now uses the separately supplied 768 × 907
replacement in `assets/about/about-display.png`, unchanged. Its larger desktop
column and 560px mobile maximum retain transparency and the full composition.
All About text, including the heading and opening statement, stays in the right
column beside the portrait on desktop. Mobile stacks the portrait above that
single text column.

Bug Logger uses the shared FOX intro, sticky chapters, reveals and closing
navigation. Its problem section explains why new apps needed human testing
and why bug bash findings needed clear, actionable reports.
The origin story starts with a documentation tool, then bug capture, then
the broader testing workflow. The second version credits a teammate with the
Cowork Bug Logger skill and describes the portfolio owner's refinements:
understanding issues without specific trigger words and trimming recordings to
the relevant evidence. The narrative describes natural capture, AI structuring,
human review and the later Cowork workflow used in product bug bashes.
The time improvement is explicitly attributed
to team feedback, not presented as a measured benchmark. Its homepage thumbnail
pairs the supplied skill and toolbar images on pink, without added text. The
larger toolbar runs diagonally across the clipped card, with the skill image
offset above it and gentle hover movement disabled for reduced motion. Supporting cards use
the shared white surface with no outlines, and the hero uses the shared yellow.
The yellow banner pairs its text with the two supplied transparent skill and
widget toolbar images, preserved at their original resolution. They float gently
beside the text on desktop and stack below it on narrow screens; reduced motion
keeps both still.
The supplied recordings live in `assets/bug-logger/`. The first MP4 is unchanged;
the second is trimmed to its first 59 seconds without re-encoding, retaining audio.
The original archive remains untouched. First
exploration shows the desktop widget, journal and mobile capture. It describes
logging reviewed bugs in one click, report history and the question of why a
separate app was needed, setting up the move into an existing workflow. Second version
shows the Cowork bug logging skill and ADO workflow. Both retain narration, use
native controls without autoplay and have representative 1280 × 720 posters,
rounded yellow/orange frames, explicit error/download fallbacks and byte range
support for seeking. The recordings are about 3 minutes 17 seconds and 59
seconds respectively.

Template Validator uses the shared FOX intro, sticky chapters, reveals and closing
navigation. Its opening cover uses the supplied 2820 × 1096 PNG in
`assets/template-validator/cover.png`. Its homepage thumbnail uses the separately
supplied 794 × 616 PNG in `assets/template-validator/thumbnail.png`. Both are
extracted unchanged from their original archives, without added text. The cover
keeps its full composition. The replacement thumbnail fills its rounded card
edge to edge horizontally with no padding, using `object-fit: cover` and a gentle
hover zoom. The artwork sits 24px lower within the clipped frame to balance the
orange space above and beside the review panel.
The detection/understanding/resolution
flow chart below the cover illustrates the supplied story with connected stages
and a shared goal: help people understand and resolve template issues without
overwhelming them or blocking their workflow. Its stages share the stats cards'
yellow, pink and orange backgrounds with dark text. It stacks vertically on mobile.
The chart has no outlined outer container; its goal and the story's supporting
cards use the shared white surface, 16px corners and soft shadows, without
grey/tinted fills or outlined boxes.
Feedback model includes the supplied 3418 × 1498 original validation data
screenshot in a rounded yellow frame, with a link to open it at full resolution. The narrative describes
testing multiple decks and marking redundant issues, framing the maximum of two
or three critical issues as a design goal rather than a measured release result.
It also describes background validation, gentle report prompts, continued
template usability and the user study preference for control over AI changes.
AI assisted fixing with user oversight is framed as the triad's north star
vision; the MVP focused on assessment and guidance to gather usage data.
Resolution workflow demonstrates the annotated PowerPoint exploration with a
looping GIF of “Export reviewed PPT”, a findings summary screenshot
and a slide comment screenshot. The 1920 × 1014 GIF has 35 frames at 10 fps,
loops automatically without buttons and uses a static image for reduced motion.
Loading failures offer the original MP4 recording. The original screenshots retain their
resolution in rounded yellow and orange frames with full resolution links.
The narrative still distinguishes this exploration from the initial release.
Resolution also explains the choice of step by step actions instead of long
paragraphs. Product evolution shows the supplied latest Template Assessment
recording as a 1920 × 1014 looping GIF, with 149 frames at 10 fps, a reduced
motion still and an original MP4 fallback, in the same rounded yellow frame.
The narrative
distinguishes annotated PowerPoint exploration from the initial release, excludes
automatic fixing from that scope, and acknowledges that the later Template
Assessment production UI differs from the original explorations. No measured
impact or product imagery is invented.

The Icon Organizer media lives in `assets/icon-organizer/`. The opening library
image uses the original 3428 × 1644 plugin screenshot from the supplied ZIP, preserved byte-for-byte
without resizing or recompression, with rounded image corners inside a yellow
frame. The Problem
chapter uses the supplied “star anim” search screenshot at no more than its
original 476px width.
The demo uses native playback controls, no autoplay, and no external sign-in. The local server supports
MP4 byte ranges for seeking. Playback failures display an explicit download link.
The 8,000 minutes saved figure is supplied by the project owner; no measurement
methodology is asserted.

Making Icons searchable reuses the FOX case-study architecture and styles:
intro, full-width hero and metric cards, sticky chapter sidebar, main story
column, and separate closing navigation. Its chapters remain Problem → Solution
→ Impact. Both case studies use the same reveal and active-chapter behavior,
including the stacked mobile navigation and reduced-motion support.
The plugin's Impact chapter pairs a closing statement with the after-tagging
recording; statistics appear
only in its hero cards, not repeated at the end.
Problem shows the failed search, Solution shows the plugin demo, and Impact
shows the search-results and generated-metadata recordings as automatically looping GIFs,
side by side at a maximum of 320px each and stacked on narrow screens. Both
retain their native 550 × 688 resolution. The GIFs have 82 and 156 frames at
10 fps without playback buttons. Reduced motion uses static
results PNGs instead. Image-loading failures
offer the original MP4 recording.
Impact also includes the two supplied IDC Tech Fair 2025 photos, captioned
“Presenting Icon Organizer to leadership at IDC Tech Fair 2025.” They are
2016 × 1512 WebP derivatives of the original 4032 × 3024 JPEGs, with no crop,
and display side by side on desktop and stacked on mobile. Click either to
open the larger image.
The photos have rounded yellow and orange frames and a large presentation
heading above them, using the shared case-study title scale.
The MOV is repackaged
as MP4 with native passthrough (no re-encoding). The full plugin demo retains
native video controls and an explicit error/download fallback. The VS Code implementation sentence
describes the demonstrated description-generation workflow, not an inferred
development history.
Its homepage thumbnail uses the supplied 957 × 642 plugin artwork unchanged,
without added text.
The rounded image is centered on pink and lifts gently on hover or keyboard
focus, using the FOX thumbnail's 650ms easing. Reduced motion keeps it static.
The homepage FOX card title uses two complete phrases: FOX Icons: / Built to scale.
Headings use balanced wrapping and paragraphs use pretty wrapping to reduce
single-word last lines where browser support permits.

## Personalize

Website copy uses spaces instead of hyphens in compound words and avoids sentence
dashes. Page titles use a middle dot separator. Technical identifiers, links,
asset filenames and original image content remain unchanged.

The homepage has an interactive thought cloud beside the introduction (below it
on smaller screens). Two aligned supplied pink-cloud drawings alternate gently
while idle; reduced-motion preferences also apply to this animation.
Click or keyboard-activate "Feed me code" to transform the thought into a blue
flower, then two pink flowers, a fish bowl, and a party worm on successive feeds.
The sequence wraps after all four. Each object uses the two supplied frames,
alternating every 450ms after a 4.2-second code-feeding reveal, with a gentle sway.
The cloud keeps its two-frame animation and stays fully visible for the first
2.5 seconds of every feed, showing it thinking before the object emerges.
Eighteen bold 24–32px code fragments stream into its center, staggered across
2.7 seconds so the feeding remains visible throughout the thinking phase.
Code is dark gray against the light page background.
The feed control has a fixed 220px width (capped by its container) and 48px height;
the message area reserves 72px so loading text and outcomes do not shift the canvas.
The original colored illustrations replace the earlier code-text silhouette.
There is no Pause button; motion automatically pauses offscreen and in hidden tabs.
The artwork scales around its center to align horizontally with the intro text.
All eight object PNGs (`assets/home/thought-{object}-{frame}.png`) share a
512px square crop that removes only transparent canvas, preserving alignment,
colors, texture, and every visible source pixel.
Reduced motion shows a static first frame immediately after activation.
Loading failures are reported visibly; controls wait for all ten images to load.
The thought cloud remains visible until activation.
One live message area starts with "Turning thoughts into something new with code."
During feeding it shows "Feeding a little code...", "Thinking it through...",
then "Making something new...", one at a time, before naming the final object.
The button uses plain text without decorative code syntax. Reduced motion skips
the loading messages, and pending messages are cleared on completion or failure.
No code is executed or sent to an AI service.

All pages share a minimal dot-grid background: 1px-radius dots spaced 28px apart
over the existing warm off-white. The dot color blends 22% of the current text
color into the light page background.
Cards and artwork retain their existing backgrounds.

All four pages use the supplied yellow-flower portrait as their favicon.
The complete PNG canvas retains its original colors and transparent background,
without cropping the flower, then is exported as `favicon.ico` (16/32/48px),
`assets/favicon-32.png`, and `assets/apple-touch-icon.png` (180px).
The original PNG is unchanged. Icon URLs use `?v=flower` to refresh cached icons.
The header uses the same portrait as a 48px icon-only home link, without the
placeholder wordmark, name, or role. The full header stays pinned while scrolling,
with an opaque, light background. Anchor links and the FOX chapter sidebar
account for its measured height, including when navigation wraps on mobile.
The homepage's "Curiosity is a useful habit" section uses the original 768px
flower portrait at `assets/home/flower-portrait.png`, shown in full without
cropping, recoloring, or a colored background panel.
Scrolling jostles the portrait with a springy wobble of up to 10 degrees.
Scroll direction and speed drive the shake, which settles when scrolling stops.
Motion runs only while visible, respects reduced-motion preferences, and has
extra space around the artwork so it remains uncropped.

The homepage opens with the supplied handwritten "Hi, I am Tanuja · Product
designer at Microsoft" artwork at `assets/home/intro-handwritten.png`.
The supplied 1849×268px transparent image is separated into aligned lettering
and pink-marker layers, without cropping, resampling, or recoloring.
Recompositing both layers preserves every visible source pixel exactly.
The handwritten intro and headline share a 720px maximum width, matching their
left and right box edges, and scale down together on smaller screens.
Paragraph widths are unchanged. The pink highlight sweeps left to right behind
"Product Designer". The animation lasts 1.2 seconds including its delay, runs
once on load, and never moves or hides the lettering.
Reduced motion shows the complete final highlight immediately.
The light page background keeps the black handwriting legible.
The lettering URL uses `?v=script` to refresh cached artwork.
The headline reads "Solving real problems with AI." followed on a new line by
"Crafting stories that connect." The headline uses a smaller, fluid 28–48px scale.
The intro is vertically centered in the viewport space below the sticky header.
The hero grows naturally when its content needs more height on smaller screens.
Greeting, headline, paragraph, and CTA form one left-hand text block, with the
flower beside it in the right column. Both share a 64px downward offset on
desktop. On mobile the flower stacks below the text, without the desktop offset.
The single introductory paragraph describes 3.5 years designing
experiences for Microsoft PowerPoint, using AI where it meaningfully simplifies
complex tasks. The former "Beyond screens" paragraph has been removed.
Paragraphs use the shared readable body scale (20px desktop / 18px mobile),
with a 720px maximum reading width.
The earlier handwritten greeting images remain in `assets/home/greeting-*.png`
but are no longer displayed in the intro.
"Explore my work" is the sole hero action and scrolls to selected work.
The Playground remains accessible from the navigation and creative exploration link.

The homepage keeps its Microsoft/AI-focused intro at the top. The illustration gallery
is parked at the bottom of the main content, after Work and the About teaser
and before the shared footer. Its existing artwork and controls remain intact.
This bottom gallery cycles through NYC Subway, Pho in Vietnam, and Filter kaapi in a
2.5-second loop, replaying each composition's staggered layer assembly.
The `homeIllustrations` list in `app.js` defines each composition's description,
dimensions, and layer order; add future illustrations there and allowlist their
assets in `server.cjs`.

The NYC Subway composition uses five supplied illustration layers in
`assets/home/`: frame, route map, train, title, and handwritten notes. Their
original 768 × 768 canvases are cropped together to 592 × 656 at x=64, y=32,
removing empty margins without dropping any visible artwork pixels. Relative
placement, texture, and colors are preserved. The hero uses up to 560 CSS px of
width so the illustration reads larger without resampling the source assets.
The updated supplied layers already have transparency, which is preserved
losslessly without background removal or resizing; white frame details remain unchanged. The composition
has no background fill and sits directly on the light page.
The Pho composition uses six supplied transparent 768 × 768 layers: stool, bowl,
chopsticks, spark, notes, and heart. All share a native 728 × 720 crop at x=24,
y=24; no resizing or visible-pixel removal is applied.
Filter kaapi uses seven supplied transparent 768 × 768 layers: the yellow
filter, pink steam, brown drips, orange accent, title/slow-drip notes, morning
note, and aroma note.
All share a native 704 × 696 crop at x=32, y=32. Every visible source pixel,
its color, transparency, and relative placement is retained without resizing.
All three compositions occupy
the same fixed-aspect stage to prevent layout shifts.
The elements assemble from different directions with short staggered entrances,
settling within 1.6 seconds. Only the Next illustration control sits below
the caption; there is no Pause/Play button. Hovering, keyboard focus, a hidden tab, or an offscreen gallery pauses
autoplay. Reduced motion disables autoplay and assembly motion while retaining
manual Next navigation. Each composition has one accessible description;
individual layers are decorative, and automatic changes do not trigger live
announcements. Manual changes announce the illustration name.
The visible caption, "Some experiences stay with you. I draw mine.", sits below
the composition in 22px italic type with full text contrast, connecting the artwork to the homepage intro.

The supplied flower-in-hand artwork is scaled proportionally from 277×447px
onto a transparent 64px cursor canvas without cropping.
The cursor and click dots use 1.18× brightness and 1.3× color saturation for
more vivid orange, pink, and yellow, with their original alpha channels intact.
Both image URLs use `?v=bright` to refresh cached artwork.
Its hotspot sits near the flower tip at (34,2).
The image preloads before the animated overlay replaces the native cursor.
It appears across pages on fine-pointer devices
with hover support. With motion enabled, a pointer-events-free overlay follows
the pointer without position easing, gently turns with horizontal movement,
blooms 15% over controls, and compresses on press. It hides when the pointer leaves,
the window loses focus, scrolling starts, or the keyboard is used. Reduced motion
keeps the static native flower cursor; unavailable JavaScript also keeps
the static flower cursor. Links and buttons retain
a pointer fallback, editable fields retain a text cursor, and evidence links retain
their zoom cursor. Touch devices keep native behavior.
Primary mouse clicks release the supplied orange and yellow dots from the flower.
The transparent 458×224px dots layer, with the same color enhancement, is stored in
`assets/home/flower-cursor-dots.png`. Each burst expands upward and fades over
650ms, without intercepting clicks or following the moving pointer. Bursts
clean themselves up, allow overlapping clicks (up to 12 active bursts), and
stay disabled for reduced motion, touch, keyboard activation, and text/zoom cursors.

Edit `profile` and `projects` in `app.js`, then replace the placeholder biography,
experience, and contact sections in the same file. Project slugs must be unique
URL-safe identifiers. Data is trusted local editorial content, not user input;
do not insert untrusted HTML into the templates.

FOX content, metric definitions, original illustrative SVGs, and page rendering
live in `fox.js`, loaded before `app.js`. Replace the illustrative icon wall
with approved actual FOX assets and complete the three icon decision stories
with real before/exploration/after visuals. The localization comparison also
needs actual assets. No real FOX icon designs are being represented by the grid.

The first craft comparison uses unmodified, locally downloaded SVGs in
`assets/fox/` from the supplied Figma libraries:

- Legacy OFFUI `addnoteboardnote`, node `741:51811`, 16 px.
- Fluent `Note Add`, node `13374:336`, 16 px Regular component. Its SVG is
  the 14 px shape from node `13374:169`, centered with the original 1 px inset.
- FOX `AddNoteboardNote`, node `1253:1852`, 16 px.

The comparison shows one enlarged icon per system in an unboxed, side-by-side
row, with only the system names below. Native-size duplicates and scale captions
are omitted. Source dimensions and colors remain unchanged; a shared, borderless
light viewing surface keeps the original assets legible.
The row stays side-by-side on mobile. Fluent is a reference, not a purported
intermediate exploration.
Two further command studies, exploration assets, and the per-icon rationale
are still pending. The hero wall is illustrative, not actual FOX assets;
this source context stays in the documentation, not in the page layout.
No temporary asset URLs are used at runtime. The Fluent Code Connect reference
is a React icon; this dependency-free static site uses its exact Figma SVG
instead of adding a React runtime for one asset.

The craft chapter also includes "The most fun part": animation and transition
icons that simplify the shapes while keeping their effects literal.
Six complete 48 px components were exported as SVGs from the supplied
[FOX library](https://www.figma.com/design/ii2y21jGdYdqGAs85qsbjr/FOX-Icons-Fluent-Office-Crossover),
without changing their colors, paths, or canvases:

| Asset in `assets/fox/` | Source node |
| --- | --- |
| `animation-fade-48.svg` | `3604:1533` |
| `animation-fly-in-48.svg` | `3604:1535` |
| `animation-spin-48.svg` | `3608:989` |
| `transition-push-48.svg` | `3396:738` |
| `transition-wipe-48.svg` | `3397:804` |
| `transition-split-48.svg` | `3397:874` |

Each FOX icon is paired with its actual original from the supplied
[OFFUI library](https://www.figma.com/design/ei7GjxWqOUg0ilOIYAcayz).
The original 32 px SVGs also preserve all source colors, paths, and canvases:

| Asset in `assets/fox/` | Source node |
| --- | --- |
| `offui-animation-fade-32.svg` | `741:120369` |
| `offui-animation-fly-in-32.svg` | `741:122380` |
| `offui-animation-spin-32.svg` | `741:122430` |
| `offui-transition-push-32.svg` | `741:122190` |
| `offui-transition-wipe-32.svg` | `741:120856` |
| `offui-transition-split-32.svg` | `741:122443` |

Pairs always show Original on the left and FOX on the right, with a single
shared key per category rather than repeated captions or a switch.
Both canvases display at 80 px without changing the source SVG dimensions.
The original stays static; only the FOX icon receives the illustrative effect.
The grid becomes two columns up to 1200 px and one column up to 640 px,
keeping each comparison together on mobile.
These are actual library assets, not reconstructed explorations. The supplied
PowerPoint gallery screenshots informed the selection; they are not published
as document screenshots. Each FOX icon has a short, illustrative CSS effect on
scroll entry, not a recording of PowerPoint playback. Effects run once, finish
in under two seconds, and leave the full icon visible. No controls are needed.
Reduced-motion and no-observer visitors see all twelve static icons immediately.

FOX text and program metrics come from the supplied narrative, not independently
verified source documents. Private Loop, Outlook, Teams, people-search, and
SharePoint URLs are intentionally not embedded or fetched. Before publishing,
confirm permission for the narrative, metrics, research excerpts, and visuals.
The newsletter identifies HVS as high-value scenarios and reports 79% by FY24
year-end (+24 points). Rating sample size and the TTVR comparison baseline were
not supplied; results are labeled as reported program figures rather than
independently verified icon-only effects. The supplied +44% session
growth is broader product context, not attributable to FOX alone; it is omitted
from the main story to keep the portfolio focused.

Two full-width, horizontal quote cards preserve the first two supplied verbatims
(Excel and PowerPoint) rather than shortened excerpts, with no added ellipsis.
The other two text cards are removed. Highlighted source phrases emphasize
command overload, clutter, split attention, and unclear hierarchy.
Ellipses within the source quotes remain.
`research-overview.png` (1306 × 768) follows the quote cards. It is the complete
supplied `Research.png`, copied byte-for-byte without cropping or resampling.
The image scales proportionally and links to the full-resolution original.
The solution also includes a stakeholder decision about 20px icons: moving square
shapes from 3px to 2px padding, matching other shapes, and thickening details
such as the magnifying glass. The owner's account describes comparing iterations
to gain stakeholder agreement, prioritizing legibility over optical balance.
The narrative attributes helping compare iterations and build agreement to the
owner without implying sole ownership of the team decision.
`pixel-padding-comparison.png` (1650 × 722) is the supplied screenshot copied
unchanged, displayed uncropped, and linked at full size. The suggested 50%
legibility improvement is not published as a metric because no measurement
method or baseline was supplied.
The research slide includes the original participant portraits and study identifiers; confirm
publication permission before sharing the portfolio. The impact chapter no
longer repeats `updated-office-ribbons.png`; the high-resolution ribbon comparisons
remain in the craft chapter.

The solution's visual-language section pairs six application views from the supplied
[Figma source page](https://www.figma.com/design/bkksQJbJyiuzCv4nO1IEvP/personal-scribbles?node-id=1633-1529):
`powerpoint-before.png` / `powerpoint-after.png`, `word-before.png` /
`word-after.png`, and `excel-before.png` / `excel-after.png`.
These replace the initial low-resolution supplied screenshots with direct 3x
Figma exports, not upscaled copies. All six full images are 4482 × 2949 pixels
in `assets/fox/`, available by clicking the ribbon previews.

| App | Original frame | FOX frame |
| --- | --- | --- |
| PowerPoint | `1633:45612` | `1633:45213` |
| Word | `1633:45354` | `1633:42893` |
| Excel | `1633:43461` | `1633:40600` |

The comparison is a linear scroll story: Original ribbons, followed by FOX
ribbons, with no switch or hidden version. The matching `*-ribbon.png` crops
are 4050 × 408 pixels, providing at least 3x pixel density for 1000 px previews.
They cover the same 1350 × 136 design region, retaining every ribbon row.
The crop is x=216, y=501 in the full 3x exports, excluding browser chrome and
document content without resampling or retouching.
PowerPoint's FOX preview instead uses source instance `1633:45214`, exported
at 3x (4098 × 2565) and cropped at x=24, y=405 to the same 4050 × 408 region.
This isolates the actual ribbon from the floating context-menu sibling layer
without editing the Figma file or reconstructing obscured icons.
Desktop previews use the full content width. At widths up to 760 px, each ribbon
is shown as three vertically stacked, overlapping strips from the same image:
1500 source pixels wide, starting at x=0, 1275, and 2550. This covers all 4050
pixels without shrinking the entire ribbon or requiring horizontal swipes.
The strips are CSS crops, not new or resampled assets; decorative duplicates are
hidden from assistive technology while the original descriptive image remains
accessible. Full-size links are optional, not needed to unfold the story.
Only app names and Original / FOX section labels are added. These show the wider
Office UI update, not changes attributable solely to icons.

The experience entries are illustrative. The Form & feeling sample project is
currently removed; its former URL shows the project not found screen.
Contact links and a resume should only be added once real destinations exist.
Update page titles and descriptions in the four HTML files before publishing.

Styles live in `styles.css`. All pages use light mode, regardless of the system
setting or legacy `scoutTheme` URL parameters. Internal navigation does not carry
theme parameters. Reduced-motion preferences are respected.

## FOX visual storytelling

The supplied `fox-ribbon-banner.png` (2440 × 544) shows Excel and Word ribbons
in the case-study hero. It keeps its original colors and full aspect ratio at
every viewport, loads with high fetch priority, and has no text overlay.
The opening metrics remain directly below it.

The craft chapter distinguishes icons created from scratch, refinements of
older designs, and review/approval of existing icons, including the complexity
of Excel features. The supplied `brush-exploration.png` (1767 × 768) and
`paint-bucket-exploration.png` (1820 × 768) show exploration and ribbon context.
The brush caption identifies the experimental/Fluent comparison for Format as
Table; the paint-bucket caption records the user's confirmation that the proposed
variant was approved, in response to the image's legibility and color-emphasis
feedback. This does not claim measured improvement or shipment.
`reapply-filter-accessibility.png` (1867 × 768) adds the accessibility-test
flag and pixel-level modifier comparisons. It does not claim that a variant
passed testing or shipped. The expanded story stays below 775 words.
They retain their original pixels and link to full-size images. Approval of the
paint-bucket proposal comes from the user's clarification, not the image alone.
The brush and Reapply Filter captions do not infer an approved variant.

Two supplied screenshots document the owner's actual work:
`icon-creation-specs.png` (1730 × 768) in the scale chapter shows color, layers,
modifier, and high-contrast guidance; `loop-creation-guide-hires.png` (2048 × 1152)
in the adoption chapter is a 16:9 pixel crop at x=1008, y=210 from the original
3424 × 1652 screenshot supplied in a ZIP. Unlike the 768 px-high chat snapshots,
the archive preserved the original resolution. The crop retains the title,
creation instructions, and embedded library, omitting unrelated app UI and avatars.
The earlier Loop screenshots are not shipped or served. Both displayed artifacts
preserve source pixels, include short ownership captions, and link only to the
displayed images. The Loop screenshot fills the content column up to 1024 CSS px,
providing at least 2 source pixels per CSS pixel for 2× displays, without resampling
or upscaling.
Confirm publication permission for the remaining document content.

The user confirmed that the 5,000+ total includes new and redesigned icons.
The opening metrics preview shows 5,000+ icons created and redesigned, ~60% rated FOX at
least four stars, and 20 ms faster visual readiness, on yellow, pink, and orange
surfaces respectively with navy text. The 30+ icons/day production
rate sits in the scale chapter; four-app scope remains in the intro.
The +24-point suite HVS benchmark stays in the detailed impact chapter with its
suite-wide attribution caveat, rather than appearing as an icon-only headline.

The FOX page has three primary chapters: Problem, Insight, and Solution.
Problem establishes command overload with two complete, highlighted anonymous
quotes and the uncropped research slide. It distinguishes the owner's icon-layer
scope (hierarchy, recognition, consistency) from changes to command architecture.
Insight connects that evidence to a
design direction: reduce noise without losing familiar Office color cues.
The owner's context frames Office's dated appearance as a problem and the
core rebuild of its web apps as an opportunity to test a new icon language.
Solution groups icon craft, production systems, team ownership, adoption,
and impact under one tracked chapter, retaining their original deep links.
Its opening includes two anonymous
research quote cards; the section title communicates the design goal without
a repeated takeaway. The complete, uncropped research slide appears below
the cards, including its original quotes, participant portraits, and identifiers.
The quote cards retain anonymous, accessible, full-length text.
The excerpts retain their product context and come from prior qualitative
research about the wider command UI, not icon-only findings or FOX outcome data.
Research context is kept in this README, separate from participant quotations.

Spacing uses shared `--cp-space-copy`, `--cp-space-content`, and
`--cp-space-section` tokens. FOX chapters own the gaps between their direct
children, rather than combining individual component margins. Content gaps are
32px on desktop and 24px on mobile within grouped content. Direct chapter blocks
use section spacing (48px desktop / 32px mobile), including the transition from
exploration captions to the motion study. Motion headings and examples, program
stories, and ribbon comparisons share these tokens instead of fixed 24/40/64px
gaps; heading-to-copy and image captions use 16px. Chapter dividers have 48px of space on each
side on desktop and 32px on mobile. Zero-height legacy anchors do not add gaps.
The three primary chapter introductions group their title and lead copy with a
16px gap, rather than section-sized spacing. Chapter labels sit 12px above titles.
Work and experience headings use the same content spacing before their lists.
The opening cards show only quotes;
screen-reader captions retain anonymous product context.

There are no dropdowns or expandable sections. Essential contribution and
ownership text stays inline; the process visual covers localization and handoff.
Additional research excerpts are preserved below rather than expanding the page.
Collaborators are identified by role rather than name throughout the case study,
including the production diagram and implementation guidance.
Previous chapter anchors still resolve; `#localization` scrolls directly to the
localization card, while `#research` links to the starting-point evidence.

The eight-stage process is a numbered, linear visual story.
Each stage shows a different work artifact: metaphor, shared naming, the actual
16 px asset on a grid, review checks, export needs, engineering handoff, a naming
error schematic, and directional layout schematics with the 229-icon tracker count.
These illustrate the supplied process, not historical review records, actual
export packages, reconstructed failures, or localized icon variants. The original
final Add Note SVG is reused without alteration.
Engineering shows the icon handoff, raising PRs, and swapping old OFFUI icons
with the new FOX icons, rather than a platform-rules table.

The supplied FY24 newsletter adds three compact visual stories:

- `#rollout`: Excel's Home and Review pilot, HVS/task-time validation, then
  expansion into Word, PowerPoint, and OneNote. The 6–7-month period is program
  context from the newsletter, not a measured personal delivery rate.
- `#automation`: the RTL-flip plugin, localized-variant merge tool, Figma icon
  swapping, and Icons PR Bot. These are explicitly team-built with shared
  engineering and partner teams; no sole authorship is attributed to the
  portfolio owner. The diagrams are illustrations, not tool screenshots,
  actual bot results, or functioning controls. Existing SVGs remain unchanged.
- `#adoption`: keyword/metadata discovery, Wiki/tutorial guidance, and independent
  creation and shipping, including the newsletter's OneNote example.

Rollout and adoption cards stack at widths up to 1200 px to keep labels intact.
Automation remains two columns until 760 px, then stacks in reading order.
The portfolio owner's clarified role spans all four Office web apps: leading
icon-making efforts, driving quality, and expanding FOX across Excel, Word,
PowerPoint, and OneNote, not only the PowerPoint workflow. This scope appears
in the project summary, homepage description, and solution's team section.
The final "Impact & learning" section within Solution combines the reported impact metrics with
a closing statement connecting faster rendering, positive reception, and a shared
system other teams could build on. The standalone takeaway and proposed future
testing paragraph are omitted; the closing statement remains.
The results explicitly do not establish faster command discovery.
"Well-received" reflects the supplied rating result without inventing a comparative
preference baseline. There are no flow chips or repeated role summary. The metrics retain `#impact`;
`#learning` and `#ownership` still link to the closing statement, while scroll
tracking highlights Solution throughout, including when opening a legacy deep link.
After that statement, a separate more-work region sits outside the case-study
article, with five section-spacing units of breathing room (240 px on desktop,
160 px on mobile) before a divider. An end-of-case-study label and explicit links
to all work and the next project separate the story from the wider site.
Normal scrolling remains unrestricted; there is no click gate or scroll trap.
Role labels use "cross-app ownership," not "leadership."
The wider program involved three design vendor partners. The two collaboration
boxes represent functions, not a count of people or vendors. Office hours, bug
bashes, and monitoring describe the program's feedback loop, not an assertion
that the portfolio owner personally led every activity.
Earlier iPad feedback explains why familiar color was retained; it does not
expand the rollout claim beyond Office web. The naming-error schematic describes
the newsletter's close-button/trashcan incident and week-long fix without
reconstructing screenshots or implying a specific review tool prevented it.
The public HVS label and accompanying sentence distinguish the suite benchmark
from an icon-only causal result. Broader growth, MAU, and NPS figures remain
omitted. Low-level sprite/build implementation details are not presented as the
designer's individual work.

All eight steps and both ribbon versions are present and readable immediately.
There are no switches, play/pause buttons, next/previous controls, hidden panels,
or playback timers. Each visual enters once as scrolling brings it into view.
Reduced-motion mode keeps the same linear content without entrance effects.
All content also remains visible without IntersectionObserver support.
The chapter navigation highlights the section at the upper quarter of the viewport
with a yellow background and navy text. Chapter labels stay
on one line, including the bold active "Impact & learning"
label; the desktop sidebar is 224 px wide, while mobile navigation wraps between
links rather than within them. Scroll and resize updates
are coalesced into one animation-frame callback; tracking handles long sections,
reverse scrolling, and direct or legacy hash links without relying on reveal
observers. Scrolling does not modify the URL or browser history.
Source caveats stay in this
README; the public case study has no project-notes block or replacement caption.
The collaboration graphic is not an org chart. Rating dots represent the
approximate 60% share, not actual survey participants. No new metrics are inferred.

Scroll-triggered entrances play once. Chapter headings, direct body copy, evidence,
and existing visual cards ease up by 6 px with a light opacity change over 420 ms.
Metric and research groups use short 60 ms stagger steps; navigation highlight
colors transition over 180 ms. No parallax, image scaling, blur, or looping motion
is added. Content is visible
without animation support, and reduced-motion mode disables animations and
transitions. No pointer, keyboard activation, or horizontal scrolling is required
to reveal any part of the narrative.
The original source SVGs are unchanged.

## Visual language and typography

Every page uses navy, pink, orange, and yellow, with ivory/white neutral surfaces.
Teal and electric blue are omitted from the UI and original studio illustrations.
The legacy `--cp-blue` and `--cp-coral` roles alias navy and orange respectively.
Surfaces are borderless with restrained `--cp-shadow-soft` shadows;
project previews have open text underneath rather than an enclosing card.
Repeated nested outlines are removed from the process and rollout illustrations.
Fine dividers, diagram connectors, the construction grid, and keyboard focus
indicators remain where they communicate structure or interaction.
Research quotes share the same neutral surface and visual weight, with
"From user interviews" once below the card group; anonymous product context remains
available to screen readers. Mustard
highlights the lead scale metric and FOX crossover; mustard,
pink, and orange distinguish the impact tiles, all with fixed navy text for
contrast. Most other cards stay neutral. Palette and shared-element rules apply to
`body[data-page]`, including FOX, sample case studies, About, and Playground.
Actions use navy with contrasting white text.
Historical Office icon assets and screenshots retain their original colors.
Body copy keeps the system font; headings across the portfolio use locally
hosted Sora, distributed under the license in `assets/fonts/OFL.txt`.

The type scale follows measurements from the reference portfolio at a 1440 px
viewport: 61 px main titles, 40 px section/project headings, 18 px navigation and
hero copy, 20 px reading copy, and a 128 px contact headline. Metadata stays at
least 16 px. At narrow widths,
titles adapt to 36 px, section headings to 32 px, and reading copy to 18 px.
These sizes use shared `--cp-font-*` tokens. Existing layout rules live in the
`foundation` cascade layer; the shared typography rules follow outside that layer
so mobile and component-specific legacy rules cannot shrink reading copy.

Decorative captions, project-card discipline lists, repeated draft notices, and
placeholder editing instructions are removed from the main presentation. FOX keeps
two complete research quotes and its Problem → Insight → Solution flow. Provenance, methodology,
and attribution caveats stay in this README rather than in the page layout.
Original icon SVG colors and dimensions remain unchanged.

The flower, spark, planet, loop, landscape, arches, and architectural studies are
original SVG artwork with procedural grain, not copied reference imagery or FOX
assets. The supplied Subway, Pho, and coffee artwork replaces the generated homepage hero;
the compositions alternate every 2.5 seconds with a personal caption and
pause/next controls. Reduced-motion preferences disable autoplay and motion.

FOX leads the work grid with two high-resolution ribbon strips,
`thumbnail-excel-ribbon.png` and `thumbnail-word-ribbon.png`, on palette yellow.
Excel is cropped losslessly from the top of the supplied 5480 × 768 composite
to 3444 × 374, retaining all visible Excel pixels. Word uses the unchanged
4206 × 456 source. Neither image is resampled or recolored.
The thumbnail viewport crops their horizontal
placement to show Excel's Styles/Cells tools above Word's Clipboard/Font tools.
Both strips display at 1402 CSS pixels wide with their original aspect ratios,
providing extra pixel density without changing the composition.
The visible ribbon faces are vertically centered with equal yellow space above
and below, accounting for the transparent padding in the source images.
Hover or keyboard focus shifts the rows
gently in opposite directions (650ms, with an 80ms stagger); reduced motion keeps
them static. The project banner still uses the full 2440 × 544 image without cropping.
The four portfolio entries are labeled “Project”, not “Case study”.
A simple “Work” heading introduces
all four projects, without practice cards, a tagline, counts, or category filters.
Project, about, and playground
links use standard URLs without theme parameters.

## Research source context

Additional research excerpts retained from the former expandable sections:

- **Fluent icons slide:** "There are two different sizes that I have to get
  through, it's a little harder to skim through than a uniform list." Anonymous
  PowerPoint feedback. The source connects overload with command count, color,
  size, and labels.
- **Research slide:** "[Sheets] does stress me out a lot less than Excel does.
  It's a lot easier to focus." / "The Google interface feels smooth, easy."
  Anonymous Sheets / Excel and Docs / Word feedback.
- **Research contd. slide:** "you don't want to use it unless you're really
  motivated." / "I can actually focus on what I'm doing rather than finding
  my next action." Anonymous cross-product feedback. The synthesis also identifies
  hidden controls, duplicated commands, and opportunities for contextual UI.
- **User Verbatim slide:** "I prefer keynote because the interface is more
  intuitive" / "complicated for nothing". Anonymous open comments. Source themes:
  Capable, Familiar, Complex, Complicated, Outdated, Frazzled, Features, Reliable.
  These labels are not frequency counts.

These are prior qualitative findings about the wider command UI, not FOX outcome
measurements. Design implications were easier command discovery, clearer visual
hierarchy, and simplicity without losing capability. Text cards remain anonymous;
the complete research image retains the source's participant portraits and IDs.

## Validate

```sh
npm run check
npm test
```

The tests cover page/asset delivery, basic accessible page shells, HTTP methods,
private-file exclusion, FOX rendering, chapter links, and project navigation.
They also check the source icon assets, dimensions, and comparison markup.
Interactive behavior should also be checked in a browser.

## Publish

Upload the four HTML files, `styles.css`, `fox.js`, and `app.js` to a static host.
Include the `assets/fox/` directory with its SVG and PNG assets.
Include `assets/fonts/` with the Sora font and its license; there are no runtime
font CDN requests.
No build step or backend is required. `server.cjs` is a local preview helper,
not a production server. The playground uses no AI API or external service.
