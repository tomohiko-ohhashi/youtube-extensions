# YouTube Live Jump

English | [日本語](README.ja.md)

A Chrome extension that lets one keyboard key press the “Live” button or the play button in the YouTube player.
The default key is **F18**. Send it from a Stream Deck, AutoHotkey, a macro keyboard, or similar.

## Install

1. Put this folder (`youtube-live-hotkey`) on your computer.
2. Open `chrome://extensions` in Chrome.
3. Turn on “Developer mode” in the top right.
4. Click “Load unpacked” and choose the `youtube-live-hotkey` folder.
5. Reload any YouTube tabs that were already open.

After updating to a new version, click this extension's reload button (↻) in `chrome://extensions`, then reload your YouTube tabs.

## Usage

Press your key (F18 by default) and it acts on what the player is doing:

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
- **Pick from list**: F13–F24 aren't on regular keyboards, so you can pick them from a list. The list also has F2, F4, F8, and F9, which Chrome doesn't use.
- **Reset to F18**: restores the default.
- **Show a notice**: turns the on-screen notice on or off.

Changes apply right away to open YouTube tabs.

> If you assign a character key (such as `Q`), it won't trigger while you're typing in chat or the search box.

## Sending F18

F13–F24 aren't on regular keyboards, so send them from a tool.

**AutoHotkey v2** (turns Ctrl + Alt + L into F18)

```ahk
^!l::Send "{F18}"
```

On a Stream Deck or other macro device, assign F18 with its hotkey action.

## Notes

- Keys only arrive while a YouTube tab is showing in Chrome and the page has focus (not while you're using another app such as OBS).
- It doesn't work from a popped-out chat window.
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
