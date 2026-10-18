# Live Jump for YouTube

English | [日本語](README.ja.md)

A Chrome extension that lets one keyboard key press the “Live” button or the play button in the YouTube player.
The default key is **F2**, which Chrome doesn't use. You can switch to another key, such as F13–F24 sent from a macro pad or AutoHotkey.

## Install

1. Put this folder (`youtube-live-hotkey`) on your computer.
2. Open `chrome://extensions` in Chrome.
3. Turn on “Developer mode” in the top right.
4. Click “Load unpacked” and choose the `youtube-live-hotkey` folder.
5. Reload any YouTube tabs that were already open.

After updating to a new version, click this extension's reload button (↻) in `chrome://extensions`, then reload your YouTube tabs.

## Usage

Press your key (F2 by default) and it acts on what the player is doing:

| Player state | What the key does |
| --- | --- |
| Live stream, paused | Presses the “Live” button and resumes from the latest point |
| Live stream, playing | Pauses |
| Regular video | Toggles play / pause |

- It works even while you're typing in live chat.
- A short notice such as “Jumped to live” or “Paused” appears at the top of the player.
- During ads, the “Live” button isn't pressed; the key only toggles play / pause.

## Settings

Open the settings from the extension's toolbar icon (or **Details → Extension options** in `chrome://extensions`).
The settings page follows Chrome's display language: Japanese if Chrome is in Japanese, English otherwise.

- **Change key**: click it, then press the key you want (combinations with Ctrl, Shift, etc. work too). Click **Cancel** or press Esc to stop.
- **Pick from list**: choose from F2, F4, F8, and F9 (which Chrome doesn't use) and F13–F24 (which aren't on regular keyboards).
- **Reset to F2**: restores the default.
- **Show a notice**: turns the on-screen notice on or off.

Changes apply right away to open YouTube tabs.

> If you assign a character key (such as `Q`) or a key used for editing text (such as Enter or the arrow keys), it won't trigger while you're typing in chat or the search box.

## Using F13–F24

F13–F24 aren't on regular keyboards, so send them from a tool. Choose the same key in the settings first.

**AutoHotkey v2** (turns Ctrl + Alt + L into F13)

```ahk
^!l::Send "{F13}"
```

On a macro pad or similar device, assign the key in its settings software.

## Notes

- Keys only arrive while a YouTube tab is showing in Chrome and the page has focus (not while you're using another app such as OBS).
- It doesn't work from a popped-out chat window.
- On a Mac, you may need to hold fn while pressing F2 and other function keys.
- It may stop working if YouTube changes its player. Internally it clicks `button.ytp-live-badge` (the “Live” button) inside `.ytp-time-display.ytp-live`, which appears during live streams, and the play button `.ytp-play-button`.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension definition (Manifest V3) |
| `common.js` | Default settings and shortcut matching (shared by the two files below) |
| `content.js` | Runs on YouTube, receives the key, and presses the “Live” or play button |
| `options.html` / `options.css` / `options.js` | Settings page (also used as the toolbar popup) |
| `_locales/en`, `_locales/ja` | UI text (English and Japanese) |
| `icons/` | Icons |
