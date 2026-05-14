# Groupmark

Groupmark te ayuda a organizar mejor tu navegador cada vez que lo abres.

Los grupos de pestañas se pierden al cerrar la ventana. Groupmark los conecta con tus marcadores para que no tengas que reabrir todo a mano cada mañana.

Crea una carpeta de marcadores → ponle un nombre → un clic y se abre como grupo de pestañas con su color. Funciona entre dispositivos sin login ni cuenta.

---

## Cómo funciona

1. Crea una carpeta en tu barra de marcadores y mete las URLs que uses a diario (correo, GitHub, lo que sea).
2. Abre Groupmark desde la barra del navegador.
3. Elige el color del grupo con los puntos de colores.
4. Haz clic en la carpeta → se abren todas las pestañas como un grupo, con el nombre y el color que elegiste.

El color se guarda y sincroniza entre dispositivos vía Brave Sync / Chrome Sync. No hay backend. No hay cuenta. Tus datos no salen del navegador.

---

## Instalación

### Chrome Web Store

*(próximamente)*

### Desde el código fuente

```bash
git clone https://github.com/JesusMartinezCamps/groupmark-browser-extension.git
```

1. Abre `chrome://extensions`
2. Activa **"Modo de desarrollador"** (arriba a la derecha)
3. **"Cargar descomprimida"** → selecciona la carpeta del repo
4. Listo

Compatible con Chrome, Brave, Edge y Vivaldi (Chromium ≥ 114).

---

## Contribuir

El código es vanilla JS, sin build step ni dependencias. Si ves algo que mejorar, abre un PR.

Regla única: la extensión es offline. Sin fetch a internet, sin permisos extra.

---

MIT · [JesusMartinezCamps](https://github.com/JesusMartinezCamps)
