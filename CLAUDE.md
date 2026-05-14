# groupmark — instrucciones para Claude

Extensión Chromium MV3 que abre carpetas de marcadores como grupos de pestañas con color persistente entre dispositivos. OSS, sin backend, sin login.

## Qué hace el producto

Una carpeta de marcadores = un grupo de pestañas. El color del grupo se guarda en `chrome.storage.sync` usando el nombre de la carpeta como clave. La sincronización entre dispositivos la hace el navegador (Brave Sync / Chrome Sync).

## Estructura del código

```
manifest.json          Configuración MV3 (permisos, service worker, popup)
service_worker.js      Lógica core: abrir carpeta como tab group, leer/guardar color
popup.html/js/css      UI del popup (360×500px, vanilla JS)
icons/                 icon16/48/128.png
```

## Reglas de implementación

- Vanilla JS ES2022, sin build step, sin dependencias externas.
- Los datos de URL viven en `chrome.bookmarks`. No duplicar en `storage.sync`.
- La clave del color en `storage.sync` es `g:<nombre de carpeta>`. No cambiar el esquema sin consenso.
- Solo los permisos declarados en manifest.json: `bookmarks`, `tabs`, `tabGroups`, `storage`.
- La extensión es offline. No hacer `fetch` a internet por ningún motivo.
- Solo Chromium en v1 (Chrome, Brave, Edge, Vivaldi). Firefox port posterior.

## Idioma

- Código: inglés
- UI visible al usuario: español
- Commits: español
