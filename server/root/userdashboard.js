const status = document.getElementById('status');
const fileList = document.getElementById('fileList');
const uploadForm = document.getElementById('uploadForm');
const mkdirBtn = document.getElementById('mkdirBtn');
const logoutBtn = document.getElementById('logoutBtn');
const folderInput = document.getElementById('folderInput');
let currentPath = '.';
let currentUser = null;

async function requireSession() {
  const response = await fetch('/api/me');
  if (!response.ok) {
    window.location.href = '/login.html';
    return null;
  }
  currentUser = await response.json();
  return currentUser;
}

async function loadFiles(path = currentPath) {
  const user = await requireSession();
  if (!user) return;
  currentPath = path;
  status.textContent = 'Loading files...';
  const response = await fetch(`/api/lsdir/${encodeURIComponent(user.username)}${path && path !== '.' ? `/${encodeURIComponent(path)}` : ''}`);
  const data = await response.json();
  fileList.innerHTML = '';

  const breadcrumb = document.createElement('div');
  breadcrumb.className = 'breadcrumb';
  breadcrumb.innerHTML = `<button class="link-btn" data-path=".">Home</button>`;
  if (data.path && data.path !== '.') {
    const parts = data.path.split('/');
    let build = '';
    parts.forEach((part, index) => {
      build = index === 0 ? part : `${build}/${part}`;
      breadcrumb.innerHTML += ` / <button class="link-btn" data-path="${build}">${part}</button>`;
    });
  }
  fileList.appendChild(breadcrumb);

  if (!data.entries.length) {
    fileList.innerHTML += '<p class="empty">No files yet.</p>';
    status.textContent = 'This folder is empty.';
    return;
  }

  const list = document.createElement('ul');
  data.entries.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'file-item';
    item.innerHTML = `
      <span>${entry.name} (${entry.type})</span>
      <div class="file-actions">
        ${entry.type === 'dir' ? `<button class="link-btn" data-enter="${entry.path}">Open</button>` : `<a href="/api/download/${encodeURIComponent(user.username)}/${encodeURIComponent(entry.path)}" target="_blank">Download</a>`}
        <button data-name="${entry.path}" class="link-btn">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
  fileList.appendChild(list);
  status.textContent = `Loaded ${data.entries.length} item(s).`;
}

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const user = await requireSession();
  if (!user) return;
  const fileInput = document.getElementById('file');
  if (!fileInput.files.length) {
    status.textContent = 'Choose a file first.';
    return;
  }
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  const uploadTarget = currentPath && currentPath !== '.' ? currentPath : '';
  if (uploadTarget) formData.append('folder', uploadTarget);
  const response = await fetch(`/api/upload/${encodeURIComponent(user.username)}`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  status.textContent = data.status || 'Uploaded';
  uploadForm.reset();
  loadFiles();
});

mkdirBtn.addEventListener('click', async () => {
  const user = await requireSession();
  if (!user) return;
  const name = folderInput.value.trim();
  if (!name) {
    status.textContent = 'Enter a folder name.';
    return;
  }
  const targetPath = currentPath && currentPath !== '.' ? `${currentPath}/${name}` : name;
  const response = await fetch(`/api/mkdir/${encodeURIComponent(user.username)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: targetPath }),
  });
  const data = await response.json();
  status.textContent = data.status || 'Folder created';
  loadFiles();
});

fileList.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.hasAttribute('data-enter')) {
    const path = button.getAttribute('data-enter');
    loadFiles(path);
    return;
  }

  if (button.hasAttribute('data-path')) {
    const path = button.getAttribute('data-path');
    loadFiles(path);
    return;
  }

  if (button.hasAttribute('data-name')) {
    const user = await requireSession();
    if (!user) return;
    const name = button.getAttribute('data-name');
    const response = await fetch(`/api/delete/${encodeURIComponent(user.username)}/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      status.textContent = 'Deleted.';
      loadFiles();
    }
  }
});

logoutBtn.addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/login.html';
});

loadFiles();
