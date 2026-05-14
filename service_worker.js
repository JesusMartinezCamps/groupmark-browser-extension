// Colores válidos en chrome.tabGroups.Color. Brave añade 'orange'.
const TAB_GROUP_COLORS = ['grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'];

// Devuelve un color determinista a partir del nombre, como fallback cuando
// el usuario no ha asignado uno explícitamente.
function defaultColorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return TAB_GROUP_COLORS[hash % TAB_GROUP_COLORS.length];
}

function colorKey(folderName) {
  return `g:${folderName}`;
}

// Lee el color guardado para una carpeta. Resuelve al default si no hay ninguno.
async function getSavedColor(folderName) {
  const key = colorKey(folderName);
  const result = await chrome.storage.sync.get(key);
  return result[key] ?? defaultColorFor(folderName);
}

// Guarda el color elegido para una carpeta.
async function saveColor(folderName, color) {
  await chrome.storage.sync.set({ [colorKey(folderName)]: color });
}

// Abre todos los marcadores de una carpeta como un grupo de pestañas.
// Si ya existe un grupo con ese nombre en la ventana activa, lo reutiliza.
async function openFolderAsGroup(folderId, folderName) {
  const [currentWindow] = await chrome.windows.getAll({ populate: false });
  const windowId = currentWindow?.id ?? chrome.windows.WINDOW_ID_CURRENT;

  const bookmarks = await chrome.bookmarks.getChildren(folderId);
  const urls = bookmarks
    .filter(b => b.url && b.url.startsWith('http'))
    .map(b => b.url);

  if (urls.length === 0) return { error: 'La carpeta está vacía o no tiene URLs válidas.' };

  // Buscar grupo existente con el mismo título en la ventana activa
  const existingGroups = await chrome.tabGroups.query({ windowId });
  const existing = existingGroups.find(g => g.title === folderName);

  let groupId;
  if (existing) {
    groupId = existing.id;
  } else {
    const color = await getSavedColor(folderName);
    const newTabs = await Promise.all(
      urls.map(url => chrome.tabs.create({ url, active: false }))
    );
    const tabIds = newTabs.map(t => t.id);
    groupId = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(groupId, { title: folderName, color, collapsed: false });
  }

  // Enfocar la primera pestaña del grupo
  const tabsInGroup = await chrome.tabs.query({ groupId });
  if (tabsInGroup.length > 0) {
    await chrome.tabs.update(tabsInGroup[0].id, { active: true });
  }

  return { groupId };
}

// Escucha mensajes del popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'OPEN_FOLDER') {
    openFolderAsGroup(message.folderId, message.folderName)
      .then(sendResponse)
      .catch(err => sendResponse({ error: err.message }));
    return true; // respuesta asíncrona
  }

  if (message.type === 'SAVE_COLOR') {
    saveColor(message.folderName, message.color)
      .then(() => sendResponse({ ok: true }))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }

  if (message.type === 'GET_COLOR') {
    getSavedColor(message.folderName)
      .then(color => sendResponse({ color }))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});
