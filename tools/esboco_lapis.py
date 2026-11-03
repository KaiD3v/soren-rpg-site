"""Transforma uma arte em desenho a lápis sobre pergaminho (color dodge + textura)."""
import sys

import numpy as np
from PIL import Image, ImageFilter, ImageOps

src, paper_path, out = sys.argv[1], sys.argv[2], sys.argv[3]

img = Image.open(src).convert("L")
img = img.resize((img.width * 900 // img.height, 900), Image.LANCZOS)
# Suaviza antes do traço: o efeito realça blocos de compressão (JPEG/WebP) em áreas escuras e lisas.
img = img.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
gray = np.asarray(ImageOps.autocontrast(img, cutoff=1), dtype=np.float32)

# Traço: color dodge da imagem com o negativo desfocado. Raio pequeno = linha fina, raio grande = sombreado.
def dodge(radius):
    blur = np.asarray(Image.fromarray(255 - gray.astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32)
    # Piso no divisor: em áreas quase pretas a divisão por ~0 amplificaria ruído; assim viram sombra sólida.
    return np.clip(gray * 255.0 / np.maximum(255.0 - blur, 28.0), 0, 255)

lines = dodge(4)
shade = dodge(22)
sketch = lines * 0.7 + shade * 0.3
sketch = 255 - (255 - sketch) * 1.35  # grafite mais escuro
sketch = np.clip(sketch, 0, 255)

# Granulado de lápis: ruído leve só onde há traço.
rng = np.random.default_rng(7)
grain = rng.normal(0, 14, sketch.shape)
ink = 255 - sketch
sketch = 255 - np.clip(ink + grain * (ink / 255.0), 0, 255)

# Sobre o pergaminho: multiplica o traço pela textura, tingindo o grafite de sépia escuro.
paper = Image.open(paper_path).convert("RGB")
tiled = Image.new("RGB", (img.width, img.height))
for x in range(0, img.width, paper.width):
    for y in range(0, img.height, paper.height):
        tiled.paste(paper, (x, y))
paper_arr = np.asarray(tiled, dtype=np.float32) / 255.0
graphite = np.array([0.20, 0.15, 0.12])
k = (sketch / 255.0)[..., None]
rgb = paper_arr * (k + (1 - k) * graphite) * 255.0

# Bordas esmaecidas, como desenho que some no papel.
h, w = sketch.shape
yy, xx = np.mgrid[0:h, 0:w]
d = np.maximum(np.abs(xx - w / 2) / (w / 2), np.abs(yy - h / 2) / (h / 2))
fade = np.clip((d - 0.82) / 0.18, 0, 1)[..., None]
rgb = rgb * (1 - fade) + paper_arr * 255.0 * fade

Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(out, quality=84)
print(out, w, h)
