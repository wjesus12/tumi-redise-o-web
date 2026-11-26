#!/usr/bin/env python3
"""
Agrega (o quita) un modelo Invicta del catálogo de AURUM TEMPO con solo su referencia.

Hace todo el proceso automáticamente:
  1. Busca el modelo en invicta.com.pe (foto oficial, precio, especificaciones).
  2. Busca la foto FRONTAL oficial en invictawatch.com (si no existe, usa la principal
     y le quita la parte trasera del brazalete).
  3. Recorta el fondo y calcula el centro y tamaño de la caja para el probador.
  4. Actualiza js/productos.js, js/probador-datos.js y supabase/02-semilla.sql.

Uso:
  python3 herramientas/agregar_modelo.py 47182
  python3 herramientas/agregar_modelo.py 47182 --precio 899 --bf 20 --etiquetas mas-vendido
  python3 herramientas/agregar_modelo.py 47182 --simular        # muestra el resultado sin guardar
  python3 herramientas/agregar_modelo.py --quitar 47182         # retira el modelo del catálogo

Requisitos: Python 3 con Pillow, numpy y scipy  (pip install pillow numpy scipy)
"""
import argparse, html, io, json, re, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

RAIZ = Path(__file__).resolve().parent.parent
PERU = 'https://invicta.com.pe'
GLOBAL = 'https://www.invictawatch.com/storage/products'
UA = {'User-Agent': 'Mozilla/5.0 catalogo-aurum'}

DESC = {
    'Pro Diver': 'El buceador que hizo legendaria a Invicta: bisel giratorio, lectura nítida y presencia absoluta en la muñeca.',
    'Bolt': 'El icónico cable trenzado de la línea Bolt: una escultura de acero para quien no pasa desapercibido.',
    'Speedway': 'Inspirado en las pistas: taquímetro, subesferas y espíritu de alta velocidad.',
    'Racing': 'Diseño de competición con colores de pista: deportivo, liviano y con actitud.',
    'Specialty': 'Elegancia clásica para el traje y las grandes ocasiones, sin perder carácter.',
    'Vintage': 'Inspiración retro con proporciones elegantes: el reloj del hombre que ya no tiene nada que demostrar.',
}
DESC_GENERICA = 'Diseño audaz con el sello Invicta: construcción robusta y presencia que se nota en la muñeca.'
OUTFITS = {'Pro Diver': ['casual', 'deportivo', 'aventura'], 'Bolt': ['elegante', 'semiformal', 'casual'],
           'Speedway': ['deportivo', 'casual', 'semiformal'], 'Racing': ['deportivo', 'casual', 'aventura'],
           'Specialty': ['formal', 'elegante', 'semiformal'], 'Vintage': ['formal', 'elegante', 'semiformal']}
FORMALES = {'Specialty', 'Vintage', 'Objet D Art', 'Lupah', 'Angel', 'Wildflower'}
COLORES = {'blue': 'Azul', 'green': 'Verde', 'steel': 'Acero', 'black': 'Negro', 'white': 'Blanco', 'red': 'Rojo',
           'gold': 'Oro', 'silver': 'Plateado', 'grey': 'Gris', 'gray': 'Gris', 'brown': 'Marrón', 'yellow': 'Amarillo',
           'orange': 'Naranja', 'rose': 'Rosa', 'purple': 'Morado'}
HEX = {'black': '#0d0d10', 'negro': '#0d0d10', 'blue': '#123a7a', 'azul': '#123a7a', 'green': '#2f4a2a', 'verde': '#2f4a2a',
       'red': '#8b1520', 'rojo': '#8b1520', 'white': '#eeeae2', 'blanco': '#eeeae2', 'silver': '#d9dde2', 'gold': '#d9c48f',
       'oro': '#d9c48f', 'dorado': '#d9c48f', 'grey': '#3a3d42', 'gray': '#3a3d42', 'gris': '#3a3d42', 'yellow': '#d9b21a'}


# ─────────────── utilidades ───────────────
def leer_url(url, binario=False):
    req = urllib.request.Request(url, headers=UA)
    datos = urllib.request.urlopen(req, timeout=40).read()
    return datos if binario else datos.decode('utf-8', 'replace')


def leer_js(ruta, marcador):
    s = ruta.read_text()
    i = s.index(marcador) + len(marcador)
    j = s.rindex(']') + 1
    return s, i, j, json.loads(s[i:j])


def escribir_js(ruta, s, i, j, datos):
    ruta.write_text(s[:i] + json.dumps(datos, ensure_ascii=False, indent=1) + s[j:])


def traducir(t):
    for en, es in COLORES.items():
        t = re.sub(rf'\b{en}\b', es, t, flags=re.I)
    return t


# ─────────────── 1. datos de invicta.com.pe ───────────────
def buscar_en_peru(ref):
    q = urllib.parse.urlencode({'q': ref, 'resources[type]': 'product', 'resources[limit]': 10})
    res = json.loads(leer_url(f'{PERU}/search/suggest.json?{q}'))['resources']['results']['products']
    for r in res:
        if re.search(rf'\b{re.escape(ref)}\b', r['title'], re.I) and 'HOMBRE' in r['title'].upper():
            return json.loads(leer_url(f"{PERU}/products/{r['handle']}.json"))['product']
    for r in res:
        if re.search(rf'\b{re.escape(ref)}\b', r['title'], re.I):
            return json.loads(leer_url(f"{PERU}/products/{r['handle']}.json"))['product']
    return None


def especificaciones(body):
    t = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' | ', body or '')))
    d = {}
    for m in re.finditer(r'\|\s*([A-Za-zÁÉÍÓÚáéíóúñ ()]+?)\s*:\s*\|\s*([^|]+?)\s*\|', t):
        d.setdefault(m.group(1).strip(), m.group(2).strip())
    return d


def armar_producto(p, ref, args):
    titulo = p['title']
    m = re.search(r'INVICTA\s+(?:INVICTA\s+)?(.+?)\s+' + re.escape(ref.upper()), titulo.upper())
    linea = m.group(1).title() if m else 'Invicta'
    color = titulo.split(' - ')[-1].strip().title() if ' - ' in titulo else ''
    s = especificaciones(p.get('body_html'))
    tags = [t.upper() for t in p.get('tags', [])]
    tono = (s.get('Tono de la Caja') or '').lower()
    caja = 'oro' if any(k in tono for k in ('gold', 'oro', 'dorad')) and 'rose' not in tono else 'rosa' if ('rose' in tono or 'rosa' in tono) else 'negro' if any(k in tono for k in ('black', 'negro', 'gun')) else 'acero'
    correa_m = (s.get('Material del la Correa') or s.get('Material de la Correa') or '').lower()
    correa = 'cuero' if ('leather' in correa_m or 'cuero' in correa_m) else 'silicona' if any(k in correa_m for k in ('silicon', 'polyurethane', 'rubber', 'caucho')) else 'brazalete'
    try:
        tam = int(float(re.sub(r'[^\d.]', '', s.get('Tamaño Caja (mm)', '44')) or 44))
    except ValueError:
        tam = 44
    mov = (s.get('Tipo de Movimiento') or '').lower()
    crono = any(k in (s.get('Cronógrafo') or '').lower() for k in ('segundo', 'hora', 'minuto'))
    esfera_txt = s.get('Color del Tablero') or ''
    agua = s.get('Resistencia al Agua (metros)')
    precio = args.precio or round(float(p['variants'][0]['price']))
    pid = f"{linea.lower().replace(' ', '-')}-{ref.lower()}"
    nombre = traducir(f'{linea} {ref}' + (f' {color}' if color else '')).replace(', ', ' / ')
    return {
        'id': pid, 'nombre': nombre, 'linea': linea, 'ref': ref.upper(),
        'categoria': args.categoria or ('formal' if linea in FORMALES else 'deportivo'),
        'movimiento': 'Automático' if ('auto' in mov or 'AUTOMATIC' in tags) else 'Cuarzo',
        'precio': precio, 'bf': args.bf, 'etiquetas': args.etiquetas,
        'descripcion': DESC.get(linea, DESC_GENERICA) + (f' Esfera {traducir(esfera_txt).lower()}, caja de {tam} mm' if esfera_txt else f' Caja de {tam} mm') + (f' y resistencia al agua de {agua} m.' if agua else '.'),
        'outfits': OUTFITS.get(linea, ['casual', 'deportivo']) + (['elegante'] if caja == 'oro' else []),
        'imagen': p['images'][0]['src'] if p.get('images') else '',
        'imagenes': [i['src'] for i in p.get('images', [])[:4]],
        'urlOficial': f"{PERU}/products/{p['handle']}",
        'cristal': s.get('Tipo de Cristal'), 'agua': f'{agua} m' if agua else None,
        'specsExtra': {k: v for k, v in {'Esfera': traducir(esfera_txt), 'Referencia': ref.upper()}.items() if v},
        'visual': {'caja': caja, 'esfera': next((v for k, v in HEX.items() if k in esfera_txt.lower()), '#111316'),
                   'bisel': {'Pro Diver': 'buceo', 'Bolt': 'cable', 'Speedway': 'taquimetro', 'Racing': 'taquimetro'}.get(linea, 'liso'),
                   'biselColor': '#0b0b0d', 'indices': 'oro' if caja == 'oro' else 'acero', 'correa': correa,
                   'correaColor': '#3a2416' if correa == 'cuero' else '#141414', 'crono': crono, 'tam': max(36, min(52, tam))},
    }


# ─────────────── 2-3. foto frontal y recorte ───────────────
def foto_frontal(ref):
    for nombre in ('front_1_l', 'front_l', 'front_2_l'):
        try:
            b = leer_url(f'{GLOBAL}/{ref}/{nombre}.webp', binario=True)
            if len(b) > 2000:
                return Image.open(io.BytesIO(b)), f'invictawatch.com ({nombre})'
        except Exception:
            pass
    return None, None


def quitar_fondo(im):
    im = im.convert('RGBA')
    a = np.array(im)
    if a[..., 3].min() == 255:  # sin transparencia: el fondo blanco que toca los bordes se elimina
        rgb = a[..., :3].astype(int)
        claro = (rgb.min(axis=2) > 232) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 18)
        lab, _ = ndimage.label(claro)
        bordes = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
        a[..., 3] = np.where(np.isin(lab, list(bordes)), 0, 255)
        alfa = Image.fromarray(a[..., 3]).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
        a[..., 3] = np.array(alfa)
    m = a[..., 3] > 40
    lab, n = ndimage.label(m)
    if n > 1:  # quedarse solo con el reloj (descarta accesorios sueltos)
        tam = ndimage.sum(m, lab, range(1, n + 1))
        a[..., 3] = np.where(lab == (np.argmax(tam) + 1), a[..., 3], 0)
    return Image.fromarray(a)


def solo_frente(im):
    """Para fotos en ángulo: conserva la caja y la franja de correa frontal (sin brazalete trasero)."""
    a = np.array(im)
    m = ndimage.binary_fill_holes(a[..., 3] > 128)
    d = ndimage.distance_transform_edt(m)
    cy, cx = np.unravel_index(np.argmax(d), d.shape); r = d[cy, cx]
    yy, xx = np.mgrid[0:m.shape[0], 0:m.shape[1]]
    keep = (((yy - cy) ** 2 + (xx - cx) ** 2 <= (r * 1.24) ** 2) | (np.abs(xx - cx) <= r * 0.8)) & (a[..., 3] > 0)
    lab, _ = ndimage.label(keep)
    keep = lab == lab[cy, cx]
    alfa = Image.fromarray((keep * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
    a[..., 3] = np.minimum(a[..., 3], np.array(alfa))
    return Image.fromarray(a)


def datos_caja(im):
    bb = im.split()[3].point(lambda v: 255 if v > 40 else 0).getbbox()
    im = im.crop(bb)
    m = ndimage.binary_fill_holes(np.array(im)[..., 3] > 128)
    d = ndimage.distance_transform_edt(m)
    cy, cx = np.unravel_index(np.argmax(d), d.shape); r = d[cy, cx]
    h, w = m.shape
    return im, {'cx': round(float(cx / w), 3), 'cy': round(float(cy / h), 3), 'ajuste': round(float(w / (2 * r)), 3)}


# ─────────────── 4. guardar ───────────────
def quitar(ref):
    ref = ref.upper()
    rp = RAIZ / 'js' / 'productos.js'
    s, i, j, prods = leer_js(rp, 'export const PRODUCTOS_OFICIALES = ')
    fuera = [p for p in prods if p['ref'].upper() == ref]
    if not fuera:
        sys.exit(f'No hay ningún modelo con referencia {ref} en el catálogo.')
    escribir_js(rp, s, i, j, [p for p in prods if p['ref'].upper() != ref])
    rd = RAIZ / 'js' / 'probador-datos.js'
    s, i, j, rel = leer_js(rd, 'export const RELOJES_PROBADOR = ')
    escribir_js(rd, s, i, j, [r for r in rel if r['id'] != fuera[0]['id']])
    foto = RAIZ / 'img' / 'probador' / f"{fuera[0]['id']}.webp"
    if foto.exists():
        foto.unlink()
    subprocess.run(['node', str(RAIZ / 'herramientas' / 'generar-semilla.mjs')], check=False)
    print(f"✓ {fuera[0]['nombre']} retirado del catálogo y del probador.")


def main():
    ap = argparse.ArgumentParser(description='Agrega un modelo Invicta al catálogo y al probador.')
    ap.add_argument('ref', nargs='?', help='Referencia del reloj, por ejemplo 47182')
    ap.add_argument('--precio', type=float, help='Precio regular en soles (por defecto, el de invicta.com.pe)')
    ap.add_argument('--bf', type=int, default=0, help='%% de descuento de Black Friday (por defecto 0)')
    ap.add_argument('--etiquetas', nargs='*', default=[], help='mas-vendido, ultimas')
    ap.add_argument('--categoria', choices=['deportivo', 'formal'])
    ap.add_argument('--simular', action='store_true', help='Muestra el resultado sin guardar nada')
    ap.add_argument('--quitar', metavar='REF', help='Retira un modelo del catálogo')
    args = ap.parse_args()
    if args.quitar:
        return quitar(args.quitar)
    if not args.ref:
        ap.error('indica la referencia del reloj')
    ref = args.ref.strip().upper()

    print(f'1/4 Buscando {ref} en invicta.com.pe…')
    p = buscar_en_peru(ref)
    if not p:
        sys.exit(f'No encontré la referencia {ref} en invicta.com.pe.')
    prod = armar_producto(p, ref, args)
    print(f"    {prod['nombre']} · {prod['visual']['tam']} mm · {prod['movimiento']} · S/ {prod['precio']}")

    print('2/4 Buscando foto frontal en invictawatch.com…')
    im, origen = foto_frontal(ref)
    if im is not None:
        recorte = quitar_fondo(im)
    else:
        origen = 'foto principal de invicta.com.pe (sin brazalete trasero)'
        recorte = solo_frente(quitar_fondo(Image.open(io.BytesIO(leer_url(prod['imagen'] + ('&' if '?' in prod['imagen'] else '?') + 'width=900', binario=True)))))
    print(f'    Foto: {origen}')

    print('3/4 Recortando y midiendo la caja…')
    recorte, caja = datos_caja(recorte)
    print(f"    Centro de la caja: ({caja['cx']}, {caja['cy']}) · ajuste {caja['ajuste']}")

    if args.simular:
        destino = Path('/tmp') / f"simulacion-{prod['id']}.webp"
        recorte.save(destino, 'WEBP', quality=88)
        print(json.dumps(prod, ensure_ascii=False, indent=1))
        print(f'(simulación) Recorte guardado en {destino}. No se modificó el catálogo.')
        return

    print('4/4 Actualizando catálogo, probador y semilla de Supabase…')
    recorte.save(RAIZ / 'img' / 'probador' / f"{prod['id']}.webp", 'WEBP', quality=88)
    rp = RAIZ / 'js' / 'productos.js'
    s, i, j, prods = leer_js(rp, 'export const PRODUCTOS_OFICIALES = ')
    prods = [x for x in prods if x['ref'].upper() != ref] + [prod]
    escribir_js(rp, s, i, j, prods)
    rd = RAIZ / 'js' / 'probador-datos.js'
    s, i, j, rel = leer_js(rd, 'export const RELOJES_PROBADOR = ')
    rel = [r for r in rel if r['id'] != prod['id']] + [{'id': prod['id'], 'foto': f"img/probador/{prod['id']}.webp", **caja}]
    escribir_js(rd, s, i, j, rel)
    subprocess.run(['node', str(RAIZ / 'herramientas' / 'generar-semilla.mjs')], check=False)
    print(f"✓ {prod['nombre']} agregado. Ya aparece en el catálogo, el buscador y el probador.")
    print('  Recuerda guardar los cambios: git add -A && git commit -m "Nuevo modelo" && git push')


if __name__ == '__main__':
    main()
