'use strict';

// content.js と options.js で共有する設定とショートカットの処理。

const DEFAULT_SETTINGS = Object.freeze({
  shortcut: Object.freeze({
    code: 'F2',
    key: 'F2',
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
  }),
  showToast: true,
});

const Shortcut = (() => {
  const MODIFIER_KEYS = new Set([
    'Control', 'Alt', 'AltGraph', 'Shift', 'Meta', 'OS',
    'CapsLock', 'Fn', 'FnLock', 'Hyper', 'Super',
  ]);
  // 入力欄で、文字の削除や確定、カーソル移動に使うキー
  const EDITING_KEYS = new Set([
    'Enter', 'Tab', 'Backspace', 'Delete',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End', 'PageUp', 'PageDown',
  ]);

  function fromEvent(e) {
    return {
      code: e.code,
      key: e.key,
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
    };
  }

  function isModifierOnly(e) {
    return MODIFIER_KEYS.has(e.key);
  }

  function matches(e, s) {
    if (!s) return false;
    if (e.ctrlKey !== !!s.ctrlKey || e.altKey !== !!s.altKey ||
        e.shiftKey !== !!s.shiftKey || e.metaKey !== !!s.metaKey) {
      return false;
    }
    const code = e.code && e.code !== 'Unidentified' ? e.code : '';
    if (s.code && code) return code === s.code;
    // 仮想キーだけを送ってくるツールでは code が空になるので key で比べる
    return !!s.key && e.key === s.key;
  }

  // 入力欄で文字の入力や編集に使うキー（修飾キーなしの文字キーや Enter・矢印キーなど）かどうか
  function isTypingKey(s) {
    if (s.ctrlKey || s.altKey || s.metaKey || typeof s.key !== 'string') return false;
    return s.key.length === 1 || EDITING_KEYS.has(s.key);
  }

  function keyLabel(s) {
    const code = s.code || '';
    if (/^Key[A-Z]$/.test(code)) return code.slice(3);
    if (/^Digit\d$/.test(code)) return code.slice(5);
    if (code) return code;
    return s.key === ' ' ? 'Space' : (s.key || '?');
  }

  function format(s) {
    const parts = [];
    if (s.ctrlKey) parts.push('Ctrl');
    if (s.altKey) parts.push('Alt');
    if (s.shiftKey) parts.push('Shift');
    if (s.metaKey) parts.push('Meta');
    parts.push(keyLabel(s));
    return parts.join(' + ');
  }

  return { fromEvent, isModifierOnly, matches, isTypingKey, format };
})();
