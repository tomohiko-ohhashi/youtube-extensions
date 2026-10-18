'use strict';

// YouTube のプレーヤーでは、ライブ配信中だけ .ytp-time-display に .ytp-live が付き、
// その中の button.ytp-live-badge（「ライブ」ボタン）を押すと最新の配信位置へ移動する。
// 最新位置にいるときや広告の再生中は、このボタンが disabled になる。
const LIVE_BADGE_SELECTOR = '.ytp-time-display.ytp-live .ytp-live-badge';
const LIVEHEAD_CLASS = 'ytp-live-badge-is-livehead';
const JUMP_MESSAGE = 'youtube-live-hotkey:jump';
const YOUTUBE_ORIGIN = 'https://www.youtube.com';
const isTopFrame = window === window.top;

let settings = { ...DEFAULT_SETTINGS };

chrome.storage.sync.get(DEFAULT_SETTINGS).then((stored) => {
  settings = stored;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  for (const [name, { newValue }] of Object.entries(changes)) {
    if (name in DEFAULT_SETTINGS) settings[name] = newValue ?? DEFAULT_SETTINGS[name];
  }
});

function findLiveBadge() {
  return document.querySelector(`#movie_player ${LIVE_BADGE_SELECTOR}`) ||
    document.querySelector(LIVE_BADGE_SELECTOR);
}

function jumpToLive(badge) {
  if (!badge) {
    notify(null, 'ライブ配信が見つかりません');
    return;
  }
  const player = badge.closest('.html5-video-player');
  if (badge.disabled) {
    notify(player, badge.classList.contains(LIVEHEAD_CLASS)
      ? 'すでにライブの最新位置です'
      : '今はライブへ移動できません');
    return;
  }
  badge.click();
  notify(player, 'ライブへ移動しました');
}

function isEditable(el) {
  return el instanceof HTMLElement &&
    (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
}

function onKeyDown(e) {
  if (e.repeat || e.isComposing || !Shortcut.matches(e, settings.shortcut)) return;
  // 文字キーを割り当てた場合は、チャットや検索欄での入力を邪魔しない
  if (Shortcut.isPrintable(settings.shortcut) && isEditable(e.composedPath()[0])) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  const badge = findLiveBadge();
  if (badge || isTopFrame) {
    jumpToLive(badge);
  } else {
    // ライブチャット欄（iframe）にフォーカスがあるときは、親ページのプレーヤーに任せる
    window.top.postMessage({ type: JUMP_MESSAGE }, YOUTUBE_ORIGIN);
  }
}

window.addEventListener('keydown', onKeyDown, true);

if (isTopFrame) {
  window.addEventListener('message', (e) => {
    if (e.origin !== YOUTUBE_ORIGIN || e.data?.type !== JUMP_MESSAGE) return;
    jumpToLive(findLiveBadge());
  });
}

const toast = document.createElement('div');
Object.assign(toast.style, {
  top: '12%',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: '2147483647',
  padding: '8px 18px',
  borderRadius: '999px',
  background: 'rgba(0, 0, 0, 0.75)',
  color: '#fff',
  font: '500 15px/1.4 Roboto, "Noto Sans JP", sans-serif',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  transition: 'opacity 0.3s',
});
let toastTimer = 0;

function notify(player, text) {
  if (!settings.showToast || !document.body) return;
  toast.textContent = text;
  // 全画面表示中も見えるよう、できるだけプレーヤーの中に出す
  toast.style.position = player ? 'absolute' : 'fixed';
  (player || document.body).append(toast);
  toast.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toastTimer = setTimeout(() => toast.remove(), 300);
  }, 1200);
}
