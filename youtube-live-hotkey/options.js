'use strict';

// 画面の文言は _locales の翻訳から入れる（Chrome の表示言語が日本語なら日本語、それ以外は英語）
const t = (name, substitutions) => chrome.i18n.getMessage(name, substitutions);
document.documentElement.lang = chrome.i18n.getUILanguage();
document.title = t('optionsTitle');
for (const el of document.querySelectorAll('[data-i18n]')) {
  el.textContent = t(el.dataset.i18n);
}
for (const el of document.querySelectorAll('[data-i18n-label]')) {
  el.label = t(el.dataset.i18nLabel);
}

const keyBox = document.getElementById('key-box');
const currentEl = document.getElementById('current');
const recordButton = document.getElementById('record');
const resetButton = document.getElementById('reset');
const recordingHint = document.getElementById('recording-hint');
const presetSelect = document.getElementById('preset');
const showToastInput = document.getElementById('show-toast');
const statusEl = document.getElementById('status');

presetSelect.setAttribute('aria-label', t('presetLabel'));

let recording = false;
// キーを記録した直後の keyup で、フォーカス中のボタンが押されないようにする（Space など）
let swallowKeyUp = false;

function render({ shortcut, showToast }) {
  currentEl.textContent = Shortcut.format(shortcut);
  showToastInput.checked = showToast;
}

function showStatus(text) {
  statusEl.textContent = text;
}

async function saveShortcut(shortcut) {
  await chrome.storage.sync.set({ shortcut });
  render({ shortcut, showToast: showToastInput.checked });
  let message = t('statusSaved', Shortcut.format(shortcut));
  if (Shortcut.isTypingKey(shortcut)) message += t('statusTypingKeyNote');
  showStatus(message);
}

function setRecording(on) {
  recording = on;
  recordButton.textContent = t(on ? 'recordingButton' : 'recordButton');
  currentEl.hidden = on;
  recordingHint.hidden = !on;
  keyBox.classList.toggle('recording', on);
}

recordButton.addEventListener('click', () => {
  setRecording(!recording);
  showStatus('');
});

document.addEventListener('keydown', (e) => {
  if (!recording) return;
  e.preventDefault();
  e.stopPropagation();
  if (e.key === 'Escape') {
    setRecording(false);
    swallowKeyUp = true;
    return;
  }
  if (Shortcut.isModifierOnly(e)) return;
  setRecording(false);
  swallowKeyUp = true;
  saveShortcut(Shortcut.fromEvent(e));
}, true);

document.addEventListener('keyup', (e) => {
  if (!swallowKeyUp) return;
  e.preventDefault();
  swallowKeyUp = false;
}, true);

resetButton.addEventListener('click', () => {
  setRecording(false);
  saveShortcut({ ...DEFAULT_SETTINGS.shortcut });
});

presetSelect.addEventListener('change', () => {
  const code = presetSelect.value;
  presetSelect.value = '';
  if (!code) return;
  setRecording(false);
  saveShortcut({ ...DEFAULT_SETTINGS.shortcut, code, key: code });
});

showToastInput.addEventListener('change', async () => {
  await chrome.storage.sync.set({ showToast: showToastInput.checked });
  showStatus(t(showToastInput.checked ? 'statusToastOn' : 'statusToastOff'));
});

chrome.storage.sync.get(DEFAULT_SETTINGS).then(render);
