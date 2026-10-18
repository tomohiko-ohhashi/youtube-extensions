'use strict';

const currentEl = document.getElementById('current');
const recordButton = document.getElementById('record');
const resetButton = document.getElementById('reset');
const recordingHint = document.getElementById('recording-hint');
const presetSelect = document.getElementById('preset');
const showToastInput = document.getElementById('show-toast');
const statusEl = document.getElementById('status');

let recording = false;
// キーを記録した直後の keyup で、フォーカス中のボタンが押されないようにする（Space など）
let swallowKeyUp = false;

function render({ shortcut, showToast }) {
  currentEl.textContent = Shortcut.format(shortcut);
  const isPreset = /^F(1[3-9]|2[0-4])$/.test(shortcut.code) &&
    !shortcut.ctrlKey && !shortcut.altKey && !shortcut.shiftKey && !shortcut.metaKey;
  presetSelect.value = isPreset ? shortcut.code : '';
  showToastInput.checked = showToast;
}

function showStatus(text) {
  statusEl.textContent = text;
}

async function saveShortcut(shortcut) {
  await chrome.storage.sync.set({ shortcut });
  render({ shortcut, showToast: showToastInput.checked });
  let message = `保存しました: ${Shortcut.format(shortcut)}`;
  if (Shortcut.isPrintable(shortcut)) message += '（チャットなどの入力欄では反応しません）';
  showStatus(message);
}

function setRecording(on) {
  recording = on;
  recordButton.textContent = on ? 'キーを待っています…' : 'キーを変更';
  recordingHint.hidden = !on;
  currentEl.classList.toggle('recording', on);
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
  if (!presetSelect.value) return;
  setRecording(false);
  saveShortcut({ ...DEFAULT_SETTINGS.shortcut, code: presetSelect.value, key: presetSelect.value });
});

showToastInput.addEventListener('change', async () => {
  await chrome.storage.sync.set({ showToast: showToastInput.checked });
  showStatus(showToastInput.checked ? '通知を表示します' : '通知を表示しません');
});

chrome.storage.sync.get(DEFAULT_SETTINGS).then(render);
