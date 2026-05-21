# Planilla de Enturnamiento

Panel web (PWA) para visualizar las llegadas de vehículos y gestionar la planilla de enturnamiento.

## Contenido

- `index.html` — vista principal del panel.
- `css/styles.css` — estilos principales.
- `js/main.js`, `js/functions.js`, `js/pwa.js` — lógica de la aplicación y registro del Service Worker.
- `static/css/app.css`, `static/js/app.js`, `static/js/watchdog.js` — assets auxiliares.
- `sw.js` — Service Worker (PWA).
- `manifest.webmanifest` — manifiesto PWA.
- `icons/` — íconos de la app (192, 512, maskable).

## Uso local

Abrir `index.html` directamente en el navegador, o servirlo con cualquier servidor estático:

```bash
# Ejemplo con Python
python -m http.server 8000
```

Algunas funciones del panel (despachos, cancelaciones, webhooks) requieren un backend separado que expone los endpoints invocados desde `js/functions.js`. Sin ese backend, el panel carga pero esas acciones no estarán disponibles.

## PWA

Cuando se publican cambios visibles en el frontend, recordar subir `VERSION` en `sw.js` para que los clientes actualicen automáticamente sin requerir refresco manual.
