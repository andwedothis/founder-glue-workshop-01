# The Founder Glue Workshop: landing page

Static landing page for The Founder Glue Workshop (Wed 2 December 2026, The Dickson Room, The Cross Keys Hotel, Kelso). Brand: The Savvy Marketing Guy. No build step, no dependencies.

## Files and things

- `index.html` the page (copy lives here)
- `styles.css` the look
- `script.js` booking links and the back-to-top button
- `config.js` the booking page address
- `assets/` logo, favicon and self-hosted Plus Jakarta Sans fonts

## Before it goes live (checklist)

1. `BOOKING_URL` in `config.js` is set to the GHL event page. Book buttons open it in a new tab.
2. Policies and the cookie banner come from Termly (script in the head of `index.html`, links in the footer).
3. Tracking IDs (Meta Pixel, GA4, Clarity) sit in the three `type="text/plain"` script blocks near the top of `index.html`.
4. In `index.html`, delete the `<meta name="robots" content="noindex, nofollow">` line when you want Google to list the page.
5. If the booking page is on a different domain, in GA4 add that domain under Admin > Data streams > Configure tag settings > Configure your domains, so one visitor stays one visitor.

## How tracking works

Termly shows the cookie banner and blocks tracking until the visitor consents. Meta Pixel (advertising), Google tag and Clarity (analytics) are written as `<script type="text/plain" data-categories="...">` in `index.html`, so they stay off until Termly switches them on. "Consent Preferences" in the footer reopens the Termly panel.

The "Book your seat" buttons pass any `utm_` or `fbclid` parameters on to the booking page, so a booking can be matched to its source link (LinkedIn DM, LinkedIn post, ally, Meta).

Events sent after consent: Meta `PageView`, `ViewContent` and a custom `BookClick`; GA4 `book_click`.

## Deploy on Cloudflare Pages

1. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git, and pick this repository.
2. Framework preset: None. Build command: leave empty. Build output directory: `/` (the repository root).
3. Save and deploy. Every push to `main` redeploys in about a minute.
4. Later: Custom domains > add your chosen subdomain.
