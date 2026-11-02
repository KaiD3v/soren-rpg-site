"""Gera os PNG/ICO do ícone a partir do mesmo desenho do public/favicon.svg (sinete de cera + sigilo)."""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public"
S = 16  # desenha em 64*16 px e reduz: bordas suaves sem depender de um renderizador de SVG


def draw(size):
    big = 64 * S
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Cera: círculos concêntricos do centro claro (canto superior esquerdo) para a borda escura
    cx, cy, r = 32 * S, 32 * S, 30 * S
    light, mid, dark = (212, 69, 47), (110, 18, 10), (58, 8, 5)
    steps = 60
    for i in range(steps, -1, -1):
        t = i / steps
        color = tuple(int(mid[k] + (light[k] - mid[k]) * (1 - t) ** 2) if t < 0.7 else int(dark[k] + (mid[k] - dark[k]) * (1 - t) / 0.3) for k in range(3))
        rr = r * t
        ox, oy = -6 * S * (1 - t), -6 * S * (1 - t)
        d.ellipse((cx + ox - rr, cy + oy - rr, cx + ox + rr, cy + oy + rr), fill=color + (255,))
    d.ellipse((cx - 24 * S, cy - 24 * S, cx + 24 * S, cy + 24 * S), outline=(70, 10, 6, 255), width=2 * S)

    # Sigilo em latão
    gold, w = (226, 189, 120, 255), int(3.6 * S)
    for x1, y1, x2, y2 in [(32, 12, 46, 33), (46, 33, 18, 33), (18, 33, 32, 12), (32, 33, 32, 53), (23, 41, 41, 41), (25, 48, 39, 48)]:
        d.line((x1 * S, y1 * S, x2 * S, y2 * S), fill=gold, width=w)
    for x, y in [(32, 12), (46, 33), (18, 33), (32, 53), (23, 41), (41, 41), (25, 48), (39, 48)]:  # pontas arredondadas
        d.ellipse((x * S - w / 2, y * S - w / 2, x * S + w / 2, y * S + w / 2), fill=gold)

    return img.resize((size, size), Image.LANCZOS)


draw(180).save(OUT / "apple-touch-icon.png")
draw(64).save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("ok")
