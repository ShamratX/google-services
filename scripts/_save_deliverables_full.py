from PIL import Image
from pathlib import Path

src = Path(r"C:\Users\Shamrat\.cursor\projects\d-Dextop-Important-files-Google-services\assets")
dst = Path(r"d:\Dextop\Important files\Google services\assets\images\home\deliverables")
dst.mkdir(parents=True, exist_ok=True)

mapping = {
    "deliverable-gbp-full.jpg": "gbp.jpg",
    "deliverable-reviews-full.jpg": "reviews.jpg",
    "deliverable-ads-full.jpg": "ads.jpg",
    "deliverable-website-full.jpg": "website.jpg",
}

for sname, dname in mapping.items():
    im = Image.open(src / sname).convert("RGB")
    im.thumbnail((1600, 900), Image.Resampling.LANCZOS)
    out = dst / dname
    im.save(out, "JPEG", quality=92, optimize=True)
    print(dname, im.size, round(im.size[0] / im.size[1], 3))
