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
  // contorno del brazo cada 20 px: [x, borde superior, borde inferior]
  perfil: [[0, 255, 665], [20, 255, 661], [40, 256, 655], [60, 255, 650], [80, 256, 644], [100, 256, 638], [120, 255, 633], [140, 255, 629], [160, 255, 622], [180, 253, 617], [200, 254, 613], [220, 252, 608], [240, 252, 604], [260, 251, 598], [280, 249, 594], [300, 247, 590], [320, 246, 585], [340, 244, 580], [360, 242, 575], [380, 239, 571], [400, 235, 567], [420, 234, 563], [440, 231, 560], [460, 226, 556], [480, 224, 553], [500, 223, 549], [520, 224, 547], [540, 224, 545], [560, 223, 544], [580, 221, 544], [600, 217, 548], [620, 213, 557], [640, 207, 570], [660, 202, 585], [680, 197, 601], [700, 192, 617], [720, 187, 631], [740, 183, 645], [760, 180, 658], [780, 177, 671], [800, 175, 683], [820, 173, 694], [840, 170, 702], [860, 167, 708], [880, 163, 716], [900, 160, 725], [920, 158, 734], [940, 156, 743], [960, 159, 750], [980, 169, 759], [1000, 185, 762], [1020, 205, 760], [1040, 232, 750], [1060, 260, 719], [1080, 275, 696], [1100, 296, 682], [1120, 363, 671], [1140, 377, 656], [1160, 420, 575], [1180, 501, 548], [1200, null, null]],
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

// Los 30 relojes del catálogo con su foto oficial real, sin fondo y sin la parte trasera del brazalete.
// ajuste = ancho de la foto / diámetro de la caja · cx, cy = centro de la caja dentro de la foto (0–1)
export const RELOJES_PROBADOR = [
 {
  "id": "pro-diver-44716",
  "foto": "img/probador/pro-diver-44716.webp",
  "ajuste": 1.085,
  "cx": 0.459,
  "cy": 0.5
 },
 {
  "id": "pro-diver-44715",
  "foto": "img/probador/pro-diver-44715.webp",
  "ajuste": 1.087,
  "cx": 0.459,
  "cy": 0.499
 },
 {
  "id": "pro-diver-44713",
  "foto": "img/probador/pro-diver-44713.webp",
  "ajuste": 1.087,
  "cx": 0.459,
  "cy": 0.499
 },
 {
  "id": "pro-diver-26972",
  "foto": "img/probador/pro-diver-26972.webp",
  "ajuste": 1.104,
  "cx": 0.452,
  "cy": 0.494
 },
 {
  "id": "pro-diver-30026",
  "foto": "img/probador/pro-diver-30026.webp",
  "ajuste": 1.088,
  "cx": 0.458,
  "cy": 0.5
 },
 {
  "id": "pro-diver-51147",
  "foto": "img/probador/pro-diver-51147.webp",
  "ajuste": 1.1,
  "cx": 0.453,
  "cy": 0.5
 },
 {
  "id": "pro-diver-51146",
  "foto": "img/probador/pro-diver-51146.webp",
  "ajuste": 1.101,
  "cx": 0.453,
  "cy": 0.499
 },
 {
  "id": "pro-diver-33944",
  "foto": "img/probador/pro-diver-33944.webp",
  "ajuste": 1.087,
  "cx": 0.458,
  "cy": 0.5
 },
 {
  "id": "pro-diver-8929",
  "foto": "img/hero/pro-diver-8929-16.webp",
  "ajuste": 1.112,
  "cx": 0.46,
  "cy": 0.499
 },
 {
  "id": "pro-diver-8930obxl",
  "foto": "img/probador/pro-diver-8930obxl.webp",
  "ajuste": 1.095,
  "cx": 0.457,
  "cy": 0.499
 },
 {
  "id": "bolt-24215",
  "foto": "img/hero/bolt-24215-18.webp",
  "ajuste": 1.095,
  "cx": 0.463,
  "cy": 0.507
 },
 {
  "id": "bolt-25518",
  "foto": "img/hero/bolt-25518-20.webp",
  "ajuste": 1.073,
  "cx": 0.474,
  "cy": 0.5
 },
 {
  "id": "bolt-25517",
  "foto": "img/hero/bolt-25517-23.webp",
  "ajuste": 1.072,
  "cx": 0.474,
  "cy": 0.502
 },
 {
  "id": "bolt-25532",
  "foto": "img/hero/bolt-25532-25.webp",
  "ajuste": 1.07,
  "cx": 0.473,
  "cy": 0.514
 },
 {
  "id": "bolt-25528",
  "foto": "img/probador/bolt-25528.webp",
  "ajuste": 1.079,
  "cx": 0.473,
  "cy": 0.518
 },
 {
  "id": "speedway-46841",
  "foto": "img/probador/speedway-46841.webp",
  "ajuste": 1.059,
  "cx": 0.471,
  "cy": 0.499
 },
 {
  "id": "speedway-46856",
  "foto": "img/probador/speedway-46856.webp",
  "ajuste": 1.059,
  "cx": 0.473,
  "cy": 0.499
 },
 {
  "id": "speedway-48913",
  "foto": "img/probador/speedway-48913.webp",
  "ajuste": 1.06,
  "cx": 0.472,
  "cy": 0.5
 },
 {
  "id": "speedway-50883",
  "foto": "img/probador/speedway-50883.webp",
  "ajuste": 1.043,
  "cx": 0.497,
  "cy": 0.404
 },
 {
  "id": "speedway-20306",
  "foto": "img/hero/speedway-20306-30.webp",
  "ajuste": 1.123,
  "cx": 0.463,
  "cy": 0.495
 },
 {
  "id": "speedway-48079",
  "foto": "img/probador/speedway-48079.webp",
  "ajuste": 1.092,
  "cx": 0.46,
  "cy": 0.498
 },
 {
  "id": "racing-50755",
  "foto": "img/probador/racing-50755.webp",
  "ajuste": 1.069,
  "cx": 0.467,
  "cy": 0.499
 },
 {
  "id": "racing-50756",
  "foto": "img/probador/racing-50756.webp",
  "ajuste": 1.067,
  "cx": 0.467,
  "cy": 0.498
 },
 {
  "id": "racing-50754",
  "foto": "img/probador/racing-50754.webp",
  "ajuste": 1.069,
  "cx": 0.466,
  "cy": 0.499
 },
 {
  "id": "specialty-47405",
  "foto": "img/probador/specialty-47405.webp",
  "ajuste": 1.069,
  "cx": 0.468,
  "cy": 0.499
 },
 {
  "id": "specialty-47398",
  "foto": "img/probador/specialty-47398.webp",
  "ajuste": 1.067,
  "cx": 0.469,
  "cy": 0.499
 },
 {
  "id": "specialty-47406",
  "foto": "img/probador/specialty-47406.webp",
  "ajuste": 1.069,
  "cx": 0.468,
  "cy": 0.499
 },
 {
  "id": "specialty-48292",
  "foto": "img/probador/specialty-48292.webp",
  "ajuste": 1.079,
  "cx": 0.465,
  "cy": 0.499
 },
 {
  "id": "vintage-48011",
  "foto": "img/probador/vintage-48011.webp",
  "ajuste": 1.136,
  "cx": 0.446,
  "cy": 0.493
 },
 {
  "id": "vintage-48010",
  "foto": "img/probador/vintage-48010.webp",
  "ajuste": 1.136,
  "cx": 0.446,
  "cy": 0.493
 }
];
