'use strict';

// キーを押したときの動作:
//   - ライブ配信で一時停止中 → 「ライブ」ボタンを押す（最新の配信位置へ移動して再生）
//   - それ以外（ライブ配信で再生中、通常の動画） → 再生ボタンを押す（再生 / 一時停止の切り替え）
//
// YouTube のプレーヤーでは、ライブ配信中だけ .ytp-time-display に .ytp-live が付き、
// その中の button.ytp-live-badge が「ライブ」ボタンになる。
const LIVE_BADGE_SELECTOR = '.ytp-time-display.ytp-live .ytp-live-badge';
const PLAY_BUTTON_SELECTOR = '.ytp-play-button';
const SHORTCUT_MESSAGE = 'youtube-live-hotkey:shortcut';
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

function isVisible(el) {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

// 動画ページ以外に移動しても裏に残っているプレーヤーは操作しない
function findPlayer() {
  const players = [document.getElementById('movie_player'), ...document.querySelectorAll('.html5-video-player')];
  return players.find((player) => player && isVisible(player)) || null;
}

function pressLiveButton(badge) {
  // 最新位置にいるときはボタンが無効になっていて、一時停止中はその状態のまま残ることがある。
  // 押せる状態に戻してから押せば、YouTube 側で最新位置へ移動して再生が始まる。
  badge.disabled = false;
  badge.click();
}

function togglePlay(player, video) {
  const button = player.querySelector(PLAY_BUTTON_SELECTOR);
  if (button) {
    button.click();
  } else if (video?.paused) {
    video.play();
  } else {
    video?.pause();
  }
}

function handleShortcut(player) {
  if (!player) {
    notify(null, 'プレーヤーが見つかりません');
    return;
  }
  const video = player.querySelector('video');
  const paused = !video || video.paused;
  const badge = player.querySelector(LIVE_BADGE_SELECTOR);
  // 広告の再生中は「ライブ」ボタンを押さず、再生 / 一時停止だけを切り替える
  if (badge && paused && !player.classList.contains('ad-showing')) {
    pressLiveButton(badge);
    notify(player, 'ライブへ移動しました');
  } else {
    togglePlay(player, video);
    notify(player, paused ? '再生しました' : '一時停止しました');
  }
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

  const player = findPlayer();
  if (player || isTopFrame) {
    handleShortcut(player);
  } else {
    // ライブチャット欄（iframe）にフォーカスがあるときは、親ページのプレーヤーに任せる
    window.top.postMessage({ type: SHORTCUT_MESSAGE }, YOUTUBE_ORIGIN);
  }
}

window.addEventListener('keydown', onKeyDown, true);

if (isTopFrame) {
  window.addEventListener('message', (e) => {
    if (e.origin !== YOUTUBE_ORIGIN || e.data?.type !== SHORTCUT_MESSAGE) return;
    handleShortcut(findPlayer());
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
