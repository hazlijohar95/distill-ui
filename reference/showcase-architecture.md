# Production Showcase Architecture

The proven architecture for building interactive production showcases. Load this reference when building the production-showcase.html file.

## State Machine Pattern

Every showcase uses a single state object as the source of truth. No scattered variables, no DOM-as-state.

```javascript
const state = {
  // Navigation
  page: 'default-view',
  previousPage: null,

  // Theme (persisted)
  theme: localStorage.getItem('app-theme') || 'light',

  // UI state
  sidebarCollapsed: false,
  sheetOpen: false,
  sheetType: null,
  cmdOpen: false,
  saveBarVisible: false,

  // Selection
  selectedItem: null,
  searchQuery: '',

  // Domain data (realistic, 5+ items per collection)
  items: [...],
  categories: [...],
};
```

## Page Renderer Pattern

Each view is a pure function that returns an HTML string from state. No side effects in renderers.

```javascript
const pages = {
  dashboard: () => `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-desc">Overview of your workspace.</p>
      </div>
      ${renderMetricCards()}
      ${renderRecentActivity()}
    </div>`,

  items: () => `
    <div class="page">
      <div class="page-header">...</div>
      <div class="toolbar">
        <input class="input" placeholder="Search..." oninput="filterItems(this.value)" />
        <button class="btn btn-p" onclick="openSheet('create-item')">+ Create</button>
      </div>
      <div class="table-wrap">
        ${renderItemRows(getFilteredItems())}
      </div>
    </div>`,

  'item-detail': () => {
    const item = state.selectedItem;
    if (!item) return pages.items();
    return `
      <div class="page">
        <div class="flex items-center gap-8">
          <button class="btn btn-ghost" onclick="navigate('items')">← Back</button>
          <h1 class="page-title">${item.name}</h1>
          <span class="badge">${item.status}</span>
        </div>
        <div class="tabs">...</div>
        <div id="detailTabContent">${renderDefaultTab(item)}</div>
      </div>`;
  },
};
```

## Navigation

```javascript
function navigate(page) {
  state.previousPage = state.page;
  state.page = page;
  closeSheet();
  hideSaveBar();
  updateNavHighlight();
  render();
}

function render() {
  const fn = pages[state.page] || pages[Object.keys(pages)[0]];
  document.getElementById('mainContent').innerHTML = fn();
}

function updateNavHighlight() {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const el = document.getElementById('nav-' + state.page);
  if (el) el.classList.add('active');
}
```

## Sheet System (CRUD)

One sheet container, content switches by type. Handles create, edit, detail, and config operations.

```javascript
function openSheet(type, data) {
  state.sheetType = type;
  state.sheetData = data;
  document.getElementById('sheetOverlay').classList.add('open');
  document.getElementById('sheet').classList.add('open');
  document.getElementById('sheetContent').innerHTML = getSheetContent(type);
}

function closeSheet() {
  document.getElementById('sheetOverlay').classList.remove('open');
  document.getElementById('sheet').classList.remove('open');
  state.sheetType = null;
}

function getSheetContent(type) {
  const sheets = {
    'create-item': `
      <div class="sheet-header">
        <div class="sheet-title">Create Item</div>
        <div class="sheet-desc">Add a new item to your workspace.</div>
      </div>
      <div class="sheet-section">
        <div class="form-field">
          <label class="form-label">Name</label>
          <input class="input w-full" placeholder="Item name" />
        </div>
        ...
      </div>
      <div class="sheet-footer">
        <button class="btn btn-s" onclick="closeSheet()">Cancel</button>
        <button class="btn btn-p" onclick="closeSheet();toast('Created','success')">Create</button>
      </div>`,
    // ... more sheet types
  };
  return sheets[type] || '';
}
```

## Command Palette

```javascript
function openCmd() {
  state.cmdOpen = true;
  document.getElementById('cmdOverlay').classList.add('open');
  document.getElementById('cmdInput').value = '';
  document.getElementById('cmdInput').focus();
  filterCmd('');
}

function closeCmd() {
  state.cmdOpen = false;
  document.getElementById('cmdOverlay').classList.remove('open');
}

function filterCmd(val) {
  document.querySelectorAll('.cmd-item').forEach(item => {
    const match = item.textContent.toLowerCase().includes(val.toLowerCase());
    item.style.display = match ? 'flex' : 'none';
  });
}
```

## Toast System

```javascript
let toastId = 0;
function toast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast-icon ${type}">${icons[type]}</span><span>${msg}</span>`;
  el.onclick = () => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); };
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 4000);
}
```

## Theme Toggle

```javascript
function applyTheme() {
  document.documentElement.classList.toggle('dark', state.theme === 'dark');
  localStorage.setItem('app-theme', state.theme);
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme();
}
```

## Keyboard Shortcuts

```javascript
document.addEventListener('keydown', (e) => {
  // Command palette
  if (e.metaKey && e.key === 'k') { e.preventDefault(); state.cmdOpen ? closeCmd() : openCmd(); }

  // Close overlays
  if (e.key === 'Escape') {
    if (state.cmdOpen) closeCmd();
    else if (state.sheetType) closeSheet();
  }

  // Sidebar toggle
  if (e.metaKey && e.key === 'b') { e.preventDefault(); toggleSidebar(); }

  // Settings
  if (e.metaKey && e.key === ',') { e.preventDefault(); navigate('settings'); }

  // Save
  if (e.metaKey && e.key === 's') { e.preventDefault(); hideSaveBar(); toast('Saved', 'success'); }

  // Number keys in command palette
  if (state.cmdOpen && e.key >= '1' && e.key <= '9') {
    const pages = ['view1', 'view2', 'view3', ...];
    if (pages[parseInt(e.key) - 1]) cmdNav(pages[parseInt(e.key) - 1]);
  }
});
```

## CSS Foundation

Always define tokens as CSS custom properties with dark mode support:

```css
:root {
  --primary: [from tokens.json];
  --bg: [from tokens.json];
  --fg: [from tokens.json];
  --border: [from tokens.json];
  /* ... all tokens */
}
.dark {
  --bg: [dark value];
  --fg: [dark value];
  /* ... dark overrides */
}
```

## Checklist Before Done

- [ ] Every major route has a corresponding interactive view
- [ ] Navigation works between all views
- [ ] At least one sheet/modal for CRUD
- [ ] Command palette with Cmd+K
- [ ] Dark/light theme toggle
- [ ] Toast notifications on actions
- [ ] Search/filter on list views
- [ ] Detail view with back navigation
- [ ] Tabs within at least one view
- [ ] Realistic domain content (not placeholder)
- [ ] 5+ items in every list/table
- [ ] Keyboard shortcuts functional
- [ ] Fills viewport (not a scrollable document)
- [ ] Uses extracted tokens (not generic CSS)
