import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_THEME,
  applyTheme,
  initializeThemeSwitches,
  normalizeTheme,
  readStoredTheme,
  writeStoredTheme,
} from '../src/theme.js';

function createStorage(initialValue = null, throws = false) {
  let value = initialValue;

  return {
    getItem() {
      if (throws) throw new Error('storage unavailable');
      return value;
    },
    setItem(_key, nextValue) {
      if (throws) throw new Error('storage unavailable');
      value = nextValue;
    },
    value() {
      return value;
    },
  };
}

function createButton() {
  const attributes = new Map();
  const listeners = new Map();

  return {
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    getAttribute(name) {
      return attributes.get(name);
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    click() {
      listeners.get('click')?.();
    },
  };
}

test('theme values default to Archive and reject unknown values', () => {
  assert.equal(DEFAULT_THEME, 'archive');
  assert.equal(normalizeTheme('archive'), 'archive');
  assert.equal(normalizeTheme('arcade'), 'arcade');
  assert.equal(normalizeTheme('sepia'), 'archive');
  assert.equal(normalizeTheme(null), 'archive');
});

test('theme storage reads, writes, and tolerates unavailable storage', () => {
  const storage = createStorage('arcade');

  assert.equal(readStoredTheme(storage), 'arcade');
  assert.equal(writeStoredTheme(storage, 'archive'), true);
  assert.equal(storage.value(), 'archive');

  const blockedStorage = createStorage(null, true);
  assert.equal(readStoredTheme(blockedStorage), 'archive');
  assert.equal(writeStoredTheme(blockedStorage, 'arcade'), false);
});

test('applyTheme writes a normalized theme to the document root', () => {
  const root = { dataset: {} };

  assert.equal(applyTheme(root, 'arcade'), 'arcade');
  assert.equal(root.dataset.theme, 'arcade');
  assert.equal(applyTheme(root, 'unknown'), 'archive');
  assert.equal(root.dataset.theme, 'archive');
});

test('theme switches synchronize, toggle, and persist across the document', () => {
  const first = createButton();
  const second = createButton();
  const root = { dataset: {} };
  const storage = createStorage('arcade');
  const document = {
    documentElement: root,
    querySelectorAll() {
      return [first, second];
    },
  };

  initializeThemeSwitches(document, storage);

  assert.equal(root.dataset.theme, 'arcade');
  assert.equal(first.getAttribute('aria-checked'), 'true');
  assert.equal(first.getAttribute('aria-label'), 'Use Archive theme');
  assert.equal(second.getAttribute('aria-checked'), 'true');

  first.click();

  assert.equal(root.dataset.theme, 'archive');
  assert.equal(storage.value(), 'archive');
  assert.equal(first.getAttribute('aria-checked'), 'false');
  assert.equal(first.getAttribute('aria-label'), 'Use Arcade theme');
  assert.equal(second.getAttribute('aria-checked'), 'false');
});
