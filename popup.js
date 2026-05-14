const COLORS = ['grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'];

async function getTopLevelFolders() {
  const tree = await chrome.bookmarks.getTree();
  const roots = tree[0].children ?? [];
  const folders = [];
  for (const root of roots) {
    for (const node of (root.children ?? [])) {
      // Nodo sin URL = carpeta
      if (!node.url) {
        const children = await chrome.bookmarks.getChildren(node.id);
        const urlCount = children.filter(c => c.url).length;
        folders.push({ id: node.id, name: node.title, urlCount });
      }
    }
  }
  return folders;
}

function buildColorPicker(folderName, selectedColor) {
  const picker = document.createElement('div');
  picker.className = 'color-picker';

  for (const color of COLORS) {
    const dot = document.createElement('button');
    dot.className = 'color-dot' + (color === selectedColor ? ' selected' : '');
    dot.dataset.color = color;
    dot.title = color;
    dot.addEventListener('click', async (e) => {
      e.stopPropagation();
      picker.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
      dot.classList.add('selected');
      await chrome.runtime.sendMessage({ type: 'SAVE_COLOR', folderName, color });
    });
    picker.appendChild(dot);
  }

  return picker;
}

function buildFolderRow(folder, savedColor) {
  const row = document.createElement('div');
  row.className = 'folder-row';

  const name = document.createElement('span');
  name.className = 'folder-name';
  name.textContent = folder.name;
  name.title = folder.name;

  const count = document.createElement('span');
  count.className = 'folder-count';
  count.textContent = `${folder.urlCount} tab${folder.urlCount !== 1 ? 's' : ''}`;

  const colorPicker = buildColorPicker(folder.name, savedColor);

  const btn = document.createElement('button');
  btn.className = 'btn-open';
  btn.textContent = 'Abrir';
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = '…';
    const result = await chrome.runtime.sendMessage({
      type: 'OPEN_FOLDER',
      folderId: folder.id,
      folderName: folder.name,
    });
    if (result?.error) {
      btn.textContent = 'Error';
      btn.title = result.error;
      setTimeout(() => { btn.disabled = false; btn.textContent = 'Abrir'; }, 2000);
    } else {
      window.close();
    }
  });

  row.append(name, count, colorPicker, btn);
  return row;
}

async function render() {
  const list = document.getElementById('folder-list');
  list.innerHTML = '';

  let folders;
  try {
    folders = await getTopLevelFolders();
  } catch (err) {
    const msg = document.createElement('p');
    msg.className = 'state-error';
    msg.textContent = `Error al leer marcadores: ${err.message}`;
    list.appendChild(msg);
    return;
  }

  if (folders.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'state-empty';
    msg.textContent = 'No hay carpetas en la barra de marcadores.';
    list.appendChild(msg);
    return;
  }

  // Cargar todos los colores en paralelo antes de pintar
  const colors = await Promise.all(
    folders.map(f =>
      chrome.runtime.sendMessage({ type: 'GET_COLOR', folderName: f.name })
        .then(res => res?.color ?? 'grey')
    )
  );

  for (let i = 0; i < folders.length; i++) {
    list.appendChild(buildFolderRow(folders[i], colors[i]));
  }
}

document.addEventListener('DOMContentLoaded', render);
