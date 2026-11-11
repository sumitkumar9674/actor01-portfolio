# Prototype 03

Run `npm run dev` in this project. Routes are `/`, `/about`, `/gallery`,
`/motion`, and `/contact`. Vite serves direct visits and refreshes; any future
static host must rewrite unknown routes to index.html.

## Editing the experience

- `src/coverConfig.ts`: Home order, copy, seven-second dwell time, transition
  duration, movement and gesture settings. Cover controls derive their count.
- `src/imageManifest.ts`: original photograph URLs and accessible descriptions.
- `src/portfolioContent.ts`: biography, gallery order, real contact details
  and future video entries. Empty contact/video fields are intentional.
- `src/App.css`: photographic treatment variables and cover-specific desktop,
  portrait tablet, phone, short-screen and ultrawide compositions.
- `src/useCinematicCover.ts`: image decoding, a single transition timeline,
  timer lifecycle, wheel gesture boundaries, swipes and keyboard input.
- `src/components/Destinations.tsx`: scrolling destinations and modal viewer.

Home settles on the last completed cover when returning from a destination.
Resizing changes only CSS composition. Reduced motion disables automatic
rotation and makes manual changes immediate. Short viewports use natural
scrolling with buttons for cover changes so essential content stays reachable.

## Transition diagnosis

Prototype 02 exposed the incoming panel before setting its entrance transform,
created transition timelines outside its cleanup context, and never awaited
image decoding. Its global wheel observer could accept momentum after a lock
expired, and it prevented scrolling throughout the whole application.

Prototype 03 prepares hidden layers before entry, decodes images, owns/kills its
timeline, ignores a consumed wheel gesture until an idle boundary, and scopes
gesture handling to Home. CSS controls layout; GSAP controls only temporary
transform/opacity on nested layers. Filters are static, not animated.

## Validation and remaining review

Production build and source asset/configuration/HTTP checks pass. Source PNGs
are unchanged. Browser control was unavailable during implementation, including
native Chrome access, so visual inspection, back/forward interaction, timer
behavior, swipes, and transition frame pacing still need browser verification.
Review all four covers at 320×568, 390×844, 768×1024, 1366×768, 1920×1080 and
2560×1080, plus short landscape and 4K. Check pause/play, burst wheel input,
reverse navigation, resizing mid-transition, hidden-tab pause, reduced motion,
the mobile menu, and gallery keyboard/focus restoration.

Static CSS moderates highlights but cannot precisely repair the source PNGs'
red/cyan edge remnants or selectively retouch skin. Those need source-mask work.
