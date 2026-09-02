from PIL import Image
from pathlib import Path

src = Path(r"C:\Users\Shamrat\.cursor\projects\d-Dextop-Important-files-Google-services\assets")
dst = Path(r"d:\Dextop\Important files\Google services\assets\images\home\deliverables")
dst.mkdir(parents=True, exist_ok=True)

mapping = {
    "deliverable-gbp-169.jpg": "gbp.jpg",
    "deliverable-reviews-169.jpg": "reviews.jpg",
    "deliverable-ads-169.jpg": "ads.jpg",
    "deliverable-website-169.jpg": "website.jpg",
}

for sname, dname in mapping.items():
    im = Image.open(src / sname).convert("RGB")
    # Force exact 16:9
    target_w, target_h = 1600, 900
    tw, th = im.size
    target_ratio = target_w / target_h
    current = tw / th
    if current > target_ratio:
        new_w = int(th * target_ratio)
        left = (tw - new_w) // 2
        im = im.crop((left, 0, left + new_w, th))
    elif current < target_ratio:
        new_h = int(tw / target_ratio)
        top = (th - new_h) // 2
        im = im.crop((0, top, tw, top + new_h))
    im = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    out = dst / dname
    im.save(out, "JPEG", quality=92, optimize=True)
    print(dname, im.size, round(im.size[0] / im.size[1], 5), out.stat().st_size)
