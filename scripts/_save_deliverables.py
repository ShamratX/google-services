from PIL import Image
from pathlib import Path

src = Path(r"C:\Users\Shamrat\.cursor\projects\d-Dextop-Important-files-Google-services\assets")
dst = Path(r"d:\Dextop\Important files\Google services\assets\images\home\deliverables")
dst.mkdir(parents=True, exist_ok=True)

mapping = {
    "deliverable-gbp.jpg": "gbp.jpg",
    "deliverable-reviews.jpg": "reviews.jpg",
    "deliverable-ads.jpg": "ads.jpg",
    "deliverable-website.jpg": "website.jpg",
}

for sname, dname in mapping.items():
    im = Image.open(src / sname).convert("RGB")
    im.thumbnail((1600, 1000), Image.Resampling.LANCZOS)
    out = dst / dname
    im.save(out, "JPEG", quality=92, optimize=True)
    print(dname, im.size, out.stat().st_size)

preview = Path(r"d:\Dextop\Important files\Google services\assets\images\home\_preview-website.jpg")
if preview.exists():
    preview.unlink()
    print("removed preview")
