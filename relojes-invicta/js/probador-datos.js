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

// Los 30 relojes del catálogo con su foto oficial real, sin fondo.
// 6 tienen foto frontal (ajuste 1.15); el resto usa la foto principal en ángulo 3/4 (ajuste 1.22).
// ajuste = ancho de la foto respecto al diámetro de la caja.
export const RELOJES_PROBADOR = [
 {
  "id": "pro-diver-44716",
  "foto": "img/probador/pro-diver-44716.webp",
  "ajuste": 1.22
 },
 {
  "id": "pro-diver-44715",
  "foto": "img/probador/pro-diver-44715.webp",
  "ajuste": 1.22
 },
 {
  "id": "pro-diver-44713",
  "foto": "img/probador/pro-diver-44713.webp",
  "ajuste": 1.22
 },
 {
  "id": "pro-diver-26972",
  "foto": "img/probador/pro-diver-26972.webp",
  "ajuste": 1.22
 },
 {
  "id": "pro-diver-30026",
  "foto": "img/probador/pro-diver-30026.webp",
  "ajuste": 1.22
 },
 {
  "id": "pro-diver-51147",
  "foto": "img/probador/pro-diver-51147.webp",
  "ajuste": 1.22
 },
 {
  "id": "pro-diver-51146",
  "foto": "img/probador/pro-diver-51146.webp",
  "ajuste": 1.22
 },
 {
  "id": "pro-diver-33944",
  "foto": "img/probador/pro-diver-33944.webp",
  "ajuste": 1.22
 },
 {
  "id": "pro-diver-8929",
  "foto": "img/hero/pro-diver-8929-16.webp",
  "ajuste": 1.15
 },
 {
  "id": "pro-diver-8930obxl",
  "foto": "img/probador/pro-diver-8930obxl.webp",
  "ajuste": 1.22
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
  "id": "bolt-25528",
  "foto": "img/probador/bolt-25528.webp",
  "ajuste": 1.22
 },
 {
  "id": "speedway-46841",
  "foto": "img/probador/speedway-46841.webp",
  "ajuste": 1.22
 },
 {
  "id": "speedway-46856",
  "foto": "img/probador/speedway-46856.webp",
  "ajuste": 1.22
 },
 {
  "id": "speedway-48913",
  "foto": "img/probador/speedway-48913.webp",
  "ajuste": 1.22
 },
 {
  "id": "speedway-50883",
  "foto": "img/probador/speedway-50883.webp",
  "ajuste": 1.22
 },
 {
  "id": "speedway-20306",
  "foto": "img/hero/speedway-20306-30.webp",
  "ajuste": 1.15
 },
 {
  "id": "speedway-48079",
  "foto": "img/probador/speedway-48079.webp",
  "ajuste": 1.22
 },
 {
  "id": "racing-50755",
  "foto": "img/probador/racing-50755.webp",
  "ajuste": 1.22
 },
 {
  "id": "racing-50756",
  "foto": "img/probador/racing-50756.webp",
  "ajuste": 1.22
 },
 {
  "id": "racing-50754",
  "foto": "img/probador/racing-50754.webp",
  "ajuste": 1.22
 },
 {
  "id": "specialty-47405",
  "foto": "img/probador/specialty-47405.webp",
  "ajuste": 1.22
 },
 {
  "id": "specialty-47398",
  "foto": "img/probador/specialty-47398.webp",
  "ajuste": 1.22
 },
 {
  "id": "specialty-47406",
  "foto": "img/probador/specialty-47406.webp",
  "ajuste": 1.22
 },
 {
  "id": "specialty-48292",
  "foto": "img/probador/specialty-48292.webp",
  "ajuste": 1.22
 },
 {
  "id": "vintage-48011",
  "foto": "img/probador/vintage-48011.webp",
  "ajuste": 1.22
 },
 {
  "id": "vintage-48010",
  "foto": "img/probador/vintage-48010.webp",
  "ajuste": 1.22
 }
];
