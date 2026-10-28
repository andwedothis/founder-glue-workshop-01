# The Founder Glue Workshop: landing page

Static landing page for The Founder Glue Workshop (Wed 2 December 2026, The Dickson Room, The Cross Keys Hotel, Kelso). Brand: The Savvy Marketing Guy. No build step, no dependencies.

## Files

- `index.html` the page (copy lives here)
- `styles.css` the look
- `script.js` booking links, cookie banner, tracking (Meta Pixel, GA4, Clarity)
- `config.js` **the only file you need to edit to go live**
- `assets/` logo, favicon and self-hosted Plus Jakarta Sans fonts

## Before it goes live (checklist)

1. `BOOKING_URL` in `config.js` is set to the GHL event page. Book buttons open it in a new tab.
2. In `config.js`, set `PRIVACY_URL` to your privacy and cookie policy page.
3. In `config.js`, add `META_PIXEL_ID`, `GA4_ID` and `CLARITY_ID`. Anything left empty simply does not load.
4. In `index.html`, delete the `<meta name="robots" content="noindex, nofollow">` line when you want Google to list the page.
5. If the booking page is on a different domain, in GA4 add that domain under Admin > Data streams > Configure tag settings > Configure your domains, so one visitor stays one visitor.

## How tracking works

The cookie banner and privacy links are removed for now, so Meta Pixel, GA4 and Clarity do NOT load. To switch tracking on, restore the banner (see the git history) first. "No thanks" loads nothing. Their choice is remembered in the browser, and "Cookie settings" in the footer reopens the banner.

The "Book your seat" buttons pass any `utm_` or `fbclid` parameters on to the booking page, so a booking can be matched to its source link (LinkedIn DM, LinkedIn post, ally, Meta).

Events sent after consent: Meta `PageView`, `ViewContent` and a custom `BookClick`; GA4 `book_click`.

## Deploy on Cloudflare Pages

1. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git, and pick this repository.
2. Framework preset: None. Build command: leave empty. Build output directory: `/` (the repository root).
3. Save and deploy. Every push to `main` redeploys in about a minute.
4. Later: Custom domains > add your chosen subdomain.
