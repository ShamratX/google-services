# Northline — Google Services Website

Static agency site for **Northline**: Google Reviews, Google Business Profile, Google Ads, and Website Building.

**Live site:** https://shamratx.github.io/google-services/

## Local preview

From the project root folder, start a local server:

### Python (recommended)

```bash
python -m http.server 5500
```

Then open:

- Homepage: http://localhost:5500/
- Services: http://localhost:5500/services/
- Privacy: http://localhost:5500/privacy.html
- Terms: http://localhost:5500/terms.html

Press `Ctrl + C` in the terminal to stop the server.

### Python 3 on Windows (PowerShell)

```powershell
cd "D:\Dextop\Important files\Google services"
python -m http.server 5500
```

### Node.js (optional)

If you have `npx` installed:

```bash
npx serve -l 5500
```

## Project structure

```
├── index.html              # Homepage
├── privacy.html            # Privacy Policy
├── terms.html              # Terms of Service
├── assets/
│   ├── site.css            # Shared styles
│   ├── site.js             # Shared scripts
│   └── images/             # WebP banners and photos
└── services/
    ├── index.html          # Services hub
    ├── google-maps-review-management.html
    ├── google-business-profile-setup.html
    ├── google-ads-campaigns.html
    ├── web-development.html
    └── gmb.html            # Redirect to Google My Business page
```

## Stack

- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- No build step required

## Deploy

Push to the `main` branch on GitHub. GitHub Pages serves the site from the repository root.

```bash
git add .
git commit -m "Your message"
git push origin main
```
