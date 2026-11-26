// Genera supabase/02-semilla.sql a partir de js/catalogo.js
// Uso: node herramientas/generar-semilla.mjs
import { writeFileSync } from 'node:fs';
import { PRODUCTOS, CUPONES } from '../js/catalogo.js';

const q = (v) => v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
const arr = (a) => `array[${(a || []).map(q).join(',')}]::text[]`;
const js = (o) => `${q(JSON.stringify(o))}::jsonb`;

let sql = '-- Generado por herramientas/generar-semilla.mjs — no editar a mano\n';
sql += 'insert into productos (id, nombre, linea, categoria, movimiento, ref, precio, bf, stock, etiquetas, outfits, descripcion, imagen, imagenes, specs, visual, orden) values\n';
sql += PRODUCTOS.map((p, i) => `(${[q(p.id), q(p.nombre), q(p.linea), q(p.categoria), q(p.movimiento), q(p.ref), p.precio, p.bf || 0, p.stock ?? 5,
  arr(p.etiquetas), arr(p.outfits), q(p.descripcion), q(p.imagen), arr(p.imagenes), js(p.specs), js(p.visual), i].join(', ')})`).join(',\n');
sql += `\non conflict (id) do update set nombre = excluded.nombre, linea = excluded.linea, categoria = excluded.categoria,
  movimiento = excluded.movimiento, ref = excluded.ref, precio = excluded.precio, bf = excluded.bf, etiquetas = excluded.etiquetas,
  outfits = excluded.outfits, descripcion = excluded.descripcion, imagen = excluded.imagen, imagenes = excluded.imagenes,
  specs = excluded.specs, visual = excluded.visual, orden = excluded.orden;\n\n`;
sql += 'insert into cupones (codigo, porcentaje, minimo, descripcion) values\n';
sql += CUPONES.map(c => `(${q(c.codigo)}, ${c.porcentaje}, ${c.minimo}, ${q(c.descripcion)})`).join(',\n');
sql += '\non conflict (codigo) do nothing;\n';
writeFileSync(new URL('../supabase/02-semilla.sql', import.meta.url), sql);
console.log(`OK: ${PRODUCTOS.length} productos y ${CUPONES.length} cupones → supabase/02-semilla.sql`);
