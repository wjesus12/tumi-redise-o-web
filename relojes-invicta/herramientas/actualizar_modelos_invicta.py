#!/usr/bin/env python3
"""
Genera js/modelos-invicta.json: índice liviano de TODOS los modelos Invicta para hombre
publicados en invicta.com.pe (línea, referencia, nombre y miniatura).
El buscador de la web lo usa para reconocer modelos que aún no están en el catálogo
y ofrecerlos "bajo pedido" por WhatsApp.

Uso:
    python3 herramientas/actualizar_modelos_invicta.py            # descarga el catálogo completo
    python3 herramientas/actualizar_modelos_invicta.py feed.json  # usa un archivo ya descargado
"""
import json, re, sys, time, urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
TIENDA = 'https://invicta.com.pe'
COLORES = {'blue': 'Azul', 'green': 'Verde', 'steel': 'Acero', 'black': 'Negro', 'white': 'Blanco', 'red': 'Rojo',
           'gold': 'Oro', 'silver': 'Plateado', 'grey': 'Gris', 'gray': 'Gris', 'brown': 'Marrón', 'orange': 'Naranja',
           'yellow': 'Amarillo', 'rose gold': 'Oro rosa', 'purple': 'Morado', 'pink': 'Rosado', 'multicolor': 'Multicolor'}


def descargar():
    productos, pagina = [], 1
    while True:
        url = f'{TIENDA}/products.json?limit=250&page={pagina}'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 catalogo-aurum'})
        lote = json.load(urllib.request.urlopen(req, timeout=60))['products']
        if not lote:
            return productos
        productos += lote
        print(f'  página {pagina}: {len(lote)}')
        pagina += 1
        time.sleep(.5)


def titulo_limpio(t):
    m = re.search(r'INVICTA\s+(.+)$', t.upper())
    s = m.group(1) if m else t.upper()
    s = re.sub(r'^INVICTA\s+', '', s)               # "INVICTA RACING" duplicado
    s = re.sub(r'\s*-\s*', ' ', s).strip().title()
    for en, es in COLORES.items():
        s = re.sub(rf'\b{en}\b', es, s, flags=re.I)
    return re.sub(r'\s+', ' ', s).replace(',', ' /')


def main():
    if len(sys.argv) > 1:
        productos = json.load(open(sys.argv[1]))
    else:
        print('Descargando catálogo de invicta.com.pe…')
        productos = descargar()
    vistos, modelos = set(), []
    for p in productos:
        t = p['title'].upper()
        if 'HOMBRE' not in t or not p.get('images'):
            continue
        m = re.search(r'INVICTA\s+(?:INVICTA\s+)?(.+?)\s+(\d{3,6}[A-Z]*)\b', t)
        if not m:
            continue
        linea, ref = m.group(1).title(), m.group(2)
        if ref in vistos:
            continue
        vistos.add(ref)
        img = p['images'][0]['src']
        img += ('&' if '?' in img else '?') + 'width=160'
        modelos.append({'r': ref, 'l': linea, 'n': titulo_limpio(p['title']), 'i': img,
                        'd': any(v.get('available') for v in p.get('variants', []))})
    modelos.sort(key=lambda x: (not x['d'], x['l'], x['r']))
    destino = RAIZ / 'js' / 'modelos-invicta.json'
    destino.write_text(json.dumps(modelos, ensure_ascii=False, separators=(',', ':')))
    print(f'OK: {len(modelos)} modelos → {destino.relative_to(RAIZ)} ({destino.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
