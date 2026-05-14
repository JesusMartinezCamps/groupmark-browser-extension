# Groupmark

Abre tus carpetas de marcadores como grupos de pestañas con color persistente, sincronizados entre dispositivos sin login ni backend.

**Compatible con:** Chrome · Brave · Edge · Vivaldi (Chromium ≥ 114)

---

## Qué hace

- Lista tus carpetas top-level de la barra de marcadores en un popup.
- Un clic → abre todas las URLs de la carpeta como un grupo de pestañas con título y color.
- El color se guarda automáticamente y sincroniza entre tus dispositivos vía Brave Sync / Chrome Sync.
- Sin cuenta, sin servidor, sin telemetría. Tus datos no salen del navegador.

---

## Instalación

### Opción A — Chrome Web Store

*(próximamente)*

### Opción B — Instalar desde el código fuente

1. Descarga o clona el repositorio:

   ```bash
   git clone https://github.com/JesusMartinezCamps/groupmark.git
   ```

2. Abre `chrome://extensions` en tu navegador.

3. Activa **"Modo de desarrollador"** (toggle arriba a la derecha).

4. Haz clic en **"Cargar descomprimida"** y selecciona la carpeta `groupmark`.

5. La extensión aparece en la barra. Haz clic en su icono para abrir el popup.

> Cada vez que modifiques el código, ve a `chrome://extensions` y pulsa el botón de recargar (↻) en la tarjeta de Groupmark.

---

## Uso

1. Crea carpetas en tu barra de marcadores con las URLs que quieras agrupar.
2. Abre el popup de Groupmark.
3. Elige el color del grupo haciendo clic en los puntos de colores.
4. Pulsa **Abrir** → se abren todas las URLs como un grupo de pestañas.

El color queda guardado. La próxima vez que abras el grupo en otro dispositivo, tendrá el mismo color.

---

## Cómo funciona

- Las URLs viven en tus marcadores normales (sincronizados por el navegador).
- El color del grupo se guarda en `chrome.storage.sync` con el nombre de la carpeta como clave.
- No hay base de datos propia ni servidor. Todo es local + sync nativo del navegador.

---

## Contribuir

Pull requests bienvenidos. Antes de abrir uno:

- La extensión usa JavaScript ES2022 vanilla, sin build step ni dependencias.
- No introducir `fetch` a internet ni permisos adicionales sin discusión previa.
- Los commits en español.

---

## Licencia

MIT — ver [LICENSE](LICENSE).
