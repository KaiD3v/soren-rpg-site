"""Reduz imagens para o tamanho em que aparecem no site e salva em WebP.

Uso: python tools/otimizar_imagens.py <lado-maximo> <qualidade> arquivo [arquivo ...]

Ex.: python tools/otimizar_imagens.py 960 78 public/assets/soren.jpg
Cada arquivo vira <nome>.webp (o lado maior fica com no máximo <lado-maximo> px). Um original que
não era WebP é apagado, então troque as referências no código de .jpg/.png para .webp.
Imagens novas do Gemini costumam vir com 1-2 MB: passe-as por aqui antes de colocar no site.
"""
import pathlib
import sys

from PIL import Image

lado, qualidade, arquivos = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3:]

for nome in arquivos:
    src = pathlib.Path(nome)
    antes = src.stat().st_size
    im = Image.open(src)
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    im.thumbnail((lado, lado), Image.LANCZOS)
    out = src.with_suffix(".webp")
    im.save(out, "WEBP", quality=qualidade, method=6)
    if out != src:
        src.unlink()
    print(f"{out}: {antes // 1024} KB -> {out.stat().st_size // 1024} KB ({im.width}x{im.height})")
