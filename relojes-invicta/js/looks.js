// Looks del probador con prendas y tatuaje REALES (fotos generadas sobre la misma muñeca).
// Cada prenda es una capa PNG/WebP del mismo encuadre que las fotos de muñeca (1200 × 800).
// puno = x del borde del puño en la foto; la prenda se desplaza para quedar justo junto al reloj.
// colores: [nombre, color de muestra, imagen]
export const LOOKS = [
 {
  "id": "estandar",
  "nombre": "Estándar",
  "estilo": "deportivo"
 },
 {
  "id": "camisa",
  "nombre": "Formal · camisa",
  "estilo": "formal",
  "puno": 301,
  "colores": [
   [
    "Blanco",
    "#dbd9e0",
    "img/looks/camisa-1.webp"
   ],
   [
    "Celeste",
    "#b9cfe6",
    "img/looks/camisa-2.webp"
   ],
   [
    "Rosa palo",
    "#e6c4c0",
    "img/looks/camisa-3.webp"
   ],
   [
    "Gris perla",
    "#b9bcc2",
    "img/looks/camisa-4.webp"
   ],
   [
    "Azul marino",
    "#2a3a5c",
    "img/looks/camisa-5.webp"
   ],
   [
    "Negro",
    "#232427",
    "img/looks/camisa-6.webp"
   ]
  ]
 },
 {
  "id": "terno",
  "nombre": "Formal · terno",
  "estilo": "formal",
  "puno": 354,
  "colores": [
   [
    "Gris medio",
    "#454446",
    "img/looks/terno-1.webp"
   ],
   [
    "Negro",
    "#1f1f22",
    "img/looks/terno-2.webp"
   ],
   [
    "Azul marino",
    "#22304f",
    "img/looks/terno-3.webp"
   ],
   [
    "Gris carbón",
    "#3a3c41",
    "img/looks/terno-4.webp"
   ],
   [
    "Marrón",
    "#5b4331",
    "img/looks/terno-5.webp"
   ],
   [
    "Beige",
    "#b49f82",
    "img/looks/terno-6.webp"
   ]
  ]
 },
 {
  "id": "polo",
  "nombre": "Casual · manga larga",
  "estilo": "casual",
  "puno": 305,
  "colores": [
   [
    "Gris claro",
    "#9b9a9e",
    "img/looks/polo-1.webp"
   ],
   [
    "Negro",
    "#1e1f22",
    "img/looks/polo-2.webp"
   ],
   [
    "Blanco",
    "#ecebe8",
    "img/looks/polo-3.webp"
   ],
   [
    "Azul navy",
    "#26355a",
    "img/looks/polo-4.webp"
   ],
   [
    "Verde oliva",
    "#5f6440",
    "img/looks/polo-5.webp"
   ],
   [
    "Burdeos",
    "#6a2432",
    "img/looks/polo-6.webp"
   ]
  ]
 },
 {
  "id": "chompa",
  "nombre": "Invierno · chompa",
  "estilo": "casual",
  "puno": 410,
  "colores": [
   [
    "Beige",
    "#b4a28e",
    "img/looks/chompa-1.webp"
   ],
   [
    "Camel",
    "#a9845a",
    "img/looks/chompa-2.webp"
   ],
   [
    "Gris",
    "#7d8085",
    "img/looks/chompa-3.webp"
   ],
   [
    "Negro",
    "#232325",
    "img/looks/chompa-4.webp"
   ],
   [
    "Azul navy",
    "#2a3756",
    "img/looks/chompa-5.webp"
   ],
   [
    "Verde botella",
    "#2c4a36",
    "img/looks/chompa-6.webp"
   ]
  ]
 },
 {
  "id": "tattoo",
  "nombre": "Tattoo",
  "estilo": "deportivo",
  "tinta": "img/looks/tattoo.webp"
 }
];
