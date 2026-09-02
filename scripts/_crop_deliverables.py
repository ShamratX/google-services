from PIL import Image
from pathlib import Path

folder = Path(r"d:\Dextop\Important files\Google services\assets\images\home\deliverables")
target_ratio = 16 / 9
out_w, out_h = 1600, 900

for path in sorted(folder.glob("*.jpg")):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    current = w / h
    if current > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    elif current < target_ratio:
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        im = im.crop((0, top, w, top + new_h))
    im = im.resize((out_w, out_h), Image.Resampling.LANCZOS)
    im.save(path, "JPEG", quality=92, optimize=True)
    print(path.name, im.size, round(im.size[0] / im.size[1], 3))
