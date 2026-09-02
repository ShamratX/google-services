# Northline — Homepage Final Plan

Implementation reference for `index.html`. Matches the final homepage plan (sections 1–21).

## Live section order

1. **Header** — Services · Industries · Work · Reviews · FAQ · Get Started  
2. **Hero** — Get Found on Google… + assessment CTA  
3. **Trust strip** — Why Businesses Choose Northline (4 benefit cards)  
4. **Problem** `#problem` — Your Customers Are Already Searching (4 problems + visual)  
5. **Services** `#services` — Four service cards with updated copy/CTAs  
6. **Journey** `#journey` — They stack + one customer journey flow  
7. **Industries** `#industries` — Who we help + pills + link to `/industries/`  
8. **Deliverables** `#deliverables` — What you actually get (4 columns)  
9. **Process** `#process` — How it works (4 steps)  
10. **Work** `#work` — Selected builds & demonstrations (not fake client names)  
11. **Trust** `#trust` — Built around trust (replaces sample testimonials)  
12. **FAQ** `#faq` — 10 questions, no side image  
13. **Assessment CTA** `#assessment` — Not Sure What Your Business Needs?  
14. **Contact** `#contact` — Assessment form with business type + need-help fields  
15. **Footer** — Updated guarantee line + Get Started CTA  

## Key naming changes

| Old | New |
|-----|-----|
| Contract / Start a contract | Get Started |
| Google My Business (homepage) | Google Business Profile |
| Sample client reviews | Built Around Trust |
| Fake portfolio names | Demonstration case cards |

## Not yet built (SEO strategy — sections 16–18)

- Individual industry pages (`/industries/plumber/`, etc.) — stub hub at `industries/index.html` only  
- Industry + service combo pages for Reviews SEO  
- Service URL restructure to `/services/google-business-profile/` (current filenames unchanged)  

## Homepage image plan (live)

| Section | Visual |
|---------|--------|
| Hero | `assets/images/home/hero-local-owner.jpg` — local owner + phone |
| Trust strip | Icons only (no photos) |
| Problem | `assets/images/home/problem-owner-search.jpg` |
| 4 Services | `service-reviews.jpg`, `service-gbp.jpg`, `service-ads.jpg`, `service-website.webp` |
| They stack | Journey diagram with icons (no photo) |
| Who we help | 8-industry image grid + pill lists |
| Deliverables | UI mockup strips + bullet lists |
| How it works | Step icons only |
| Portfolio | Demonstration screenshots per card |
| Trust | Principle cards (no fake client photos) |
| FAQ | Text only |
| Final CTA | `assets/images/home/cta-business-customer.jpg` |
| Contact | Form only |

Replace `assets/images/home/*` with final brand photography when ready. Service pages still use `service-*.webp` banners.

## Before launch

- Replace `hello@northline.example` with real business email  
- Swap hero/problem images for final brand photography if needed  
- Add real client reviews to `#trust` section when available  
- Replace demonstration work cards with real case studies when available  

## Local preview

```bash
python -m http.server 5500
```

Open `http://localhost:5500/`
