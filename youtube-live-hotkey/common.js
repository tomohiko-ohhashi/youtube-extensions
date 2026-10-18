'use strict';

// content.js と options.js で共有する設定とショートカットの処理。

const DEFAULT_SETTINGS = Object.freeze({
  shortcut: Object.freeze({
    code: 'F18',
    key: 'F18',
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

  // 修飾キーなしの文字キー（入力欄で打つと文字になるキー）かどうか
  function isPrintable(s) {
    return !s.ctrlKey && !s.altKey && !s.metaKey && typeof s.key === 'string' && s.key.length === 1;
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

  return { fromEvent, isModifierOnly, matches, isPrintable, format };
})();
