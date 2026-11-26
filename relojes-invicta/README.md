# AURUM TEMPO · Catálogo de relojes Invicta con pedidos por WhatsApp

Tienda web para hombres de 18 a 50 años. Incluye catálogo de 30 modelos (80 % deportivos), Black Friday automático, cupones acumulables, carrito, registro de pedidos, CRM de clientes, probador virtual y Concierge con IA.

## Qué incluye

| Sección | Qué hace |
|---|---|
| **Portada** | Reloj animado que marca la hora real, contador de Black Friday y beneficios. |
| **Estilo de vida** | Estatus, Aventura, Diversión y Madurez: cada tarjeta filtra el catálogo por outfit. |
| **Catálogo** | 30 relojes de invicta.com.pe con filtros (línea, deportivo/formal, automático, ofertas), búsqueda, orden y favoritos. |
| **Black Friday** | De 15 % a 40 % automático por modelo, sin cupón. Termina el 30/11 a las 23:59 (hora de Lima). |
| **Cupones** | `BIENVENIDA10` (10 %), `TIEMPO15` (15 % desde S/ 600) y `LUJO20` (20 % desde S/ 1,000). Se suman al Black Friday. |
| **Probador** | Fotos reales de muñeca en 10 tonos de piel (de claro a oscuro, `img/munecas/`) con la foto frontal real del reloj encima, a escala según los mm de la caja y la medida de muñeca. Incluye prueba con cámara o foto propia y opción de compartir la imagen. 29 de los 30 modelos se pueden probar (`js/probador-datos.js`, fotos en `img/probador/`). Solo entran al probador los relojes con foto **frontal** oficial (invictawatch.com): si no la tiene, el modelo va al catálogo y al buscador, pero no al probador (por eso el Speedway 50883 no aparece). Las fotos del probador no tienen transparencias dentro del reloj. |
| **Compra** | Separas con S/ 20 y pagas el saldo al recoger en agencia (Shalom, Olva, Marvisur, Flores o Cruz del Sur). El pedido se registra con un código y abre WhatsApp con el mensaje listo. |
| **Concierge IA** | Responde dudas y recomienda relojes. Sin clave de IA funciona con las preguntas frecuentes. |
| **Panel `/admin.html`** | Resumen de ventas, pedidos con estados, CRM de clientes (etiquetas y notas), productos (precio, % Black Friday y foto) y cupones. Exporta a CSV. |

## Probarlo ya (modo demo)

Sin configurar nada, la web funciona en **modo demo**: los pedidos y clientes se guardan en tu navegador y los ves en `admin.html`. Es ideal para probar la experiencia de compra.

Para verlo en tu computadora, abre una terminal en esta carpeta y ejecuta:

```bash
npx serve .
```

Luego abre la dirección que aparece (por ejemplo `http://localhost:3000`). Abrir el `index.html` con doble clic no funciona, porque los navegadores bloquean los módulos JavaScript así.

## Configuración (archivo `js/config.js`)

- `whatsapp`: número de ventas (`51942356571`): código de país y número, sin `+`.
- `supabaseUrl` y `supabaseAnonKey`: déjalos vacíos para el modo demo.
- `blackFriday`: fechas de la campaña. Al terminar, los precios regulares vuelven solos.
- `adelanto`, `agencias` y `plazoEntrega`: modalidad de compra.

## Conectar Supabase (pedidos reales y CRM)

1. Crea un proyecto gratuito en supabase.com.
2. Ve a **SQL Editor → New query**, pega el contenido de `supabase/01-esquema.sql` y ejecútalo.
3. Haz lo mismo con `supabase/02-semilla.sql` (carga los 30 relojes y los 3 cupones).
4. En **Authentication → Users → Add user**, crea tu usuario administrador (correo y contraseña).
5. En **SQL Editor**, ejecuta lo siguiente con tu correo:
   ```sql
   insert into admins (user_id) select id from auth.users where email = 'TU_CORREO';
   ```
6. En **Authentication → Providers → Email**, desactiva **"Allow new users to sign up"** para que nadie más pueda crear cuentas.
7. En **Project Settings → API**, copia la **Project URL** y la clave **anon public** en `js/config.js`.

Con esto, los pedidos se guardan en Supabase y el panel `admin.html` pide tu contraseña. Los precios, descuentos y cupones se recalculan en el servidor (función `crear_pedido`), así nadie puede alterar el total desde el navegador.

Si cambias el catálogo en `js/catalogo.js`, regenera la semilla con este comando y vuelve a ejecutar `02-semilla.sql`:

```bash
npm run semilla
```

## Publicar en Netlify

1. En Netlify: **Add new site → Import from Git**, elige este repositorio.
2. **Base directory**: `relojes-invicta`. Es un sitio aparte del de Tumi.
3. Para activar la IA del Concierge: **Site settings → Environment variables**, agrega `ANTHROPIC_API_KEY` con tu clave de console.anthropic.com. Opcionalmente agrega `CONCIERGE_MODEL` para usar otro modelo.
4. Para usar un dominio propio después: **Domain management → Add a domain**.

## Fotos

- **Relojes:** mientras no haya foto, cada reloj se dibuja en SVG y marca la hora real. Para usar la foto oficial, pega su URL en **admin.html → Productos → URL foto oficial** (con Supabase), o en el campo `imagen` de `js/catalogo.js`.
- **Estilo de vida y probador:** las escenas están ilustradas en código (`js/escenas.js`). Si agregas fotos con estos nombres en `img/`, se usan en lugar de las ilustraciones:
  - `vida-estatus.jpg`, `vida-aventura.jpg`, `vida-diversion.jpg`, `vida-madurez.jpg`
  - `look-formal.jpg`, `look-deportivo.jpg`, `look-elegante.jpg`, `look-semiformal.jpg`, `look-casual.jpg`, `look-aventura.jpg`

## Catálogo de invicta.com.pe

Los 30 modelos (`js/productos.js`) se tomaron de invicta.com.pe el 26/11/2026, con modelos disponibles en esa fecha: referencia, foto oficial, precio vigente, medida, cristal y resistencia al agua. Las descripciones son textos propios por línea. **Revisa precios y disponibilidad antes de cada campaña**, porque la tienda oficial los cambia.

- No había ningún Reserve disponible entre S/ 299 y 1,500, así que se reemplazaron por 3 automáticos (Pro Diver 8929, Pro Diver 8930OBXL y Speedway 48079).
- Los % de Black Friday se aplican sobre el precio oficial vigente.

## Aviso legal

El pie de página indica que AURUM TEMPO es un distribuidor independiente, no afiliado a Invicta Watch Group. Las fotos y textos oficiales tienen derechos de autor: úsalos con autorización del distribuidor o reemplázalos por fotos propias cuando tengas stock.

## Estructura

```
index.html            Tienda
admin.html            Panel de pedidos y CRM
css/estilos.css       Diseño (negro, oro, rojo y navy)
js/config.js          Configuración
js/catalogo.js        30 relojes, cupones, outfits y tonos de piel
js/conocimiento.js    Preguntas frecuentes y reglas del Concierge
js/app.js             Catálogo, carrito y checkout
js/probador.js        Probador virtual
js/concierge.js       Chat (IA y respuestas sin conexión)
js/escenas.js         Ilustraciones de fondo
js/reloj-svg.js       Dibujo de relojes en hora real
js/datos.js           Supabase o modo demo
js/admin.js           Panel
netlify/functions/    Función del Concierge IA
supabase/             Esquema y datos iniciales
```

## Agregar o retirar modelos (catálogo rotativo)

Con solo la referencia, el comando busca el modelo en invicta.com.pe (foto, precio y especificaciones), descarga la foto **frontal** oficial de invictawatch.com (o usa la principal sin el brazalete trasero), recorta el fondo, mide la caja y actualiza el catálogo, el buscador, el probador y la semilla de Supabase.

Requisitos (una sola vez):

```bash
pip3 install pillow numpy scipy
```

| Acción | Comando |
|---|---|
| Agregar un modelo | `npm run agregar -- 47182` |
| Agregar con precio y descuento propios | `npm run agregar -- 47182 --precio 899 --bf 20 --etiquetas mas-vendido` |
| Probar sin guardar nada | `npm run agregar -- 47182 --simular` |
| Retirar un modelo | `npm run quitar -- 47182` |
| Actualizar el índice de modelos Invicta del buscador | `npm run modelos-invicta` |

Después de agregar o retirar modelos, guarda y publica los cambios (`git add -A`, `git commit`, `git push`). Si usas Supabase, vuelve a ejecutar `supabase/02-semilla.sql`.

Una futura skill puede llamar a estos comandos directamente (por ejemplo, recorrer una lista de referencias y ejecutar `npm run agregar -- <ref>` para cada una).

## Buscador

La lupa del menú reconoce modelos, líneas y referencias aunque estén incompletos o con errores. Además de los relojes en stock, consulta `js/modelos-invicta.json` (≈4,900 modelos Invicta para hombre) y muestra los que no están en la colección como **bajo pedido**, con consulta directa por WhatsApp.

## Probador: looks

Estándar (muñeca sola), Formal · camisa, Formal · terno, Casual · polo, Invierno · chompa y Tattoo. Las prendas y el tatuaje son fotos reales generadas sobre la misma muñeca (`img/looks/`), con 6 colores por prenda. Con prenda, el puño se ubica justo antes de la caja del reloj para que se vea completo; con muñeca sola o tatuaje, el reloj va sobre la piel. Datos en `js/looks.js`.
