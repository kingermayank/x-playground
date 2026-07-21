export const THEMES = Object.freeze({
  archive: 'archive',
  arcade: 'arcade',
});

export const DEFAULT_THEME = THEMES.archive;

const STORAGE_KEY = 'always-cooking-theme';

export function normalizeTheme(value) {
  return value === THEMES.arcade ? THEMES.arcade : DEFAULT_THEME;
}

export function readStoredTheme(storage) {
  try {
    return normalizeTheme(storage?.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
}

export function writeStoredTheme(storage, theme) {
  try {
    storage?.setItem(STORAGE_KEY, normalizeTheme(theme));
    return Boolean(storage);
  } catch {
    return false;
  }
}

export function applyTheme(root, theme) {
  const normalizedTheme = normalizeTheme(theme);
  root.dataset.theme = normalizedTheme;
  return normalizedTheme;
}

function syncSwitch(button, theme) {
  const usesArcade = theme === THEMES.arcade;
  button.setAttribute('aria-checked', String(usesArcade));
  button.setAttribute(
    'aria-label',
    usesArcade ? 'Use Archive theme' : 'Use Arcade theme',
  );
}

export function initializeThemeSwitches(documentRoot, storage) {
  const root = documentRoot.documentElement;
  const switches = [...documentRoot.querySelectorAll('[data-theme-toggle]')];
  const syncAll = (theme) => switches.forEach((button) => syncSwitch(button, theme));
  const initialTheme = applyTheme(root, readStoredTheme(storage));

  syncAll(initialTheme);

  switches.forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === THEMES.arcade
        ? THEMES.archive
        : THEMES.arcade;

      applyTheme(root, nextTheme);
      writeStoredTheme(storage, nextTheme);
      syncAll(nextTheme);
    });
  });

  return initialTheme;
}

if (typeof document !== 'undefined') {
  let storage;

  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }

  initializeThemeSwitches(document, storage);
}
