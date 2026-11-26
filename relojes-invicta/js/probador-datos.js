// Probador real: fotos de muñecas (mismo encuadre, 10 tonos de piel ordenados de claro a oscuro)
// y fotos frontales reales de los relojes, sin fondo.
// MUNECA: geometría medida sobre las fotos (en px de la imagen de 1200×800).
export const MUNECA = {
  ancho: 1200, alto: 800,
  x: 432,              // centro del reloj (eje horizontal)
  y: 390,              // centro del reloj (eje vertical)
  grosor: 320,        // grosor visible del antebrazo en esa zona
  angulo: -9.93,     // inclinación del brazo (grados)
  cmReferencia: 17.5,  // contorno de muñeca que corresponde a la foto
  silueta: 'img/munecas/silueta.png',
};

export const TONOS = [
 {
  "id": "tono-01",
  "nombre": "Muy claro",
  "foto": "img/munecas/tono-01.jpg",
  "color": "#edbca6"
 },
 {
  "id": "tono-02",
  "nombre": "Claro",
  "foto": "img/munecas/tono-02.jpg",
  "color": "#e1a884"
 },
 {
  "id": "tono-03",
  "nombre": "Claro rosado",
  "foto": "img/munecas/tono-03.jpg",
  "color": "#e2a680"
 },
 {
  "id": "tono-04",
  "nombre": "Claro medio",
  "foto": "img/munecas/tono-04.jpg",
  "color": "#cb8b63"
 },
 {
  "id": "tono-05",
  "nombre": "Medio",
  "foto": "img/munecas/tono-05.jpg",
  "color": "#b9794e"
 },
 {
  "id": "tono-06",
  "nombre": "Trigueño claro",
  "foto": "img/munecas/tono-06.jpg",
  "color": "#b16e4a"
 },
 {
  "id": "tono-07",
  "nombre": "Trigueño",
  "foto": "img/munecas/tono-07.jpg",
  "color": "#af6b48"
 },
 {
  "id": "tono-08",
  "nombre": "Canela",
  "foto": "img/munecas/tono-08.jpg",
  "color": "#aa6644"
 },
 {
  "id": "tono-09",
  "nombre": "Moreno",
  "foto": "img/munecas/tono-09.jpg",
  "color": "#8d5337"
 },
 {
  "id": "tono-10",
  "nombre": "Moreno oscuro",
  "foto": "img/munecas/tono-10.jpg",
  "color": "#70402f"
 }
];

// Relojes con foto frontal real (los únicos que se pueden probar sobre la muñeca)
// ajuste: ancho de la foto respecto al diámetro de la caja (incluye corona y protectores)
export const RELOJES_PROBADOR = [
 {
  "id": "pro-diver-8929",
  "foto": "img/hero/pro-diver-8929-16.webp",
  "ajuste": 1.15
 },
 {
  "id": "bolt-24215",
  "foto": "img/hero/bolt-24215-18.webp",
  "ajuste": 1.15
 },
 {
  "id": "bolt-25518",
  "foto": "img/hero/bolt-25518-20.webp",
  "ajuste": 1.15
 },
 {
  "id": "bolt-25517",
  "foto": "img/hero/bolt-25517-23.webp",
  "ajuste": 1.15
 },
 {
  "id": "bolt-25532",
  "foto": "img/hero/bolt-25532-25.webp",
  "ajuste": 1.15
 },
 {
  "id": "speedway-20306",
  "foto": "img/hero/speedway-20306-30.webp",
  "ajuste": 1.15
 }
];
