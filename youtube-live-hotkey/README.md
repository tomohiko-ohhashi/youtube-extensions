# Live Jump for YouTube / ライブジャンプ for YouTube

[English](#english) | [日本語](#日本語)

## English

A Chrome extension that lets one keyboard key press the “Live” button or the play button in the YouTube player.
The default key is **F2**, which Chrome doesn't use. You can switch to another key, such as F13–F24 sent from a macro pad or AutoHotkey.

### Install

**Chrome Web Store**: coming soon.

**Manual install**

1. Download this repository (**Code → Download ZIP**) and unzip it.
2. Open `chrome://extensions` in Chrome.
3. Turn on “Developer mode” in the top right.
4. Click “Load unpacked” and choose the `youtube-live-hotkey` folder.
5. Reload any YouTube tabs that were already open.

After updating to a new version, click this extension's reload button (↻) in `chrome://extensions`, then reload your YouTube tabs.

### Usage

Press your key (F2 by default) and it acts on what the player is doing:

| Player state | What the key does |
| --- | --- |
| Live stream, paused | Presses the “Live” button and resumes from the latest point |
| Live stream, playing | Pauses |
| Regular video | Toggles play / pause |

- It works even while you're typing in live chat.
- A short notice such as “Jumped to live” or “Paused” appears at the top of the player.
- During ads, the “Live” button isn't pressed; the key only toggles play / pause.

### Settings

Open the settings from the extension's toolbar icon (or **Details → Extension options** in `chrome://extensions`).
The settings page follows Chrome's display language: Japanese if Chrome is in Japanese, English otherwise.

- **Change key**: click it, then press the key you want (combinations with Ctrl, Shift, etc. work too). Click **Cancel** or press Esc to stop.
- **Pick from list**: choose from F2, F4, F8, and F9 (which Chrome doesn't use) and F13–F24 (which aren't on regular keyboards).
- **Reset to F2**: restores the default.
- **Show a notice**: turns the on-screen notice on or off.

Changes apply right away to open YouTube tabs.

> If you assign a character key (such as `Q`) or a key used for editing text (such as Enter or the arrow keys), it won't trigger while you're typing in chat or the search box.

### Using F13–F24

F13–F24 aren't on regular keyboards, so send them from a tool. Choose the same key in the settings first.

**AutoHotkey v2** (turns Ctrl + Alt + L into F13)

```ahk
^!l::Send "{F13}"
```

On a macro pad or similar device, assign the key in its settings software.

### Notes

- Keys only arrive while a YouTube tab is showing in Chrome and the page has focus (not while you're using another app such as OBS).
- It doesn't work from a popped-out chat window.
- On a Mac, you may need to hold fn while pressing F2 and other function keys.
- It may stop working if YouTube changes its player. Internally it clicks `button.ytp-live-badge` (the “Live” button) inside `.ytp-time-display.ytp-live`, which appears during live streams, and the play button `.ytp-play-button`.
- No data is collected or sent anywhere. The only thing stored is your settings, in Chrome's own storage.

---

## 日本語

キーボードのキーひとつで、YouTube のプレーヤー左下の「ライブ」ボタンや再生ボタンを押せるようにする Chrome 拡張機能です。
初期設定は Chrome で使われていない **F2** キーです。左手デバイスや AutoHotkey から送る F13〜F24 など、ほかのキーにも変えられます。

### インストール

**Chrome ウェブストア**: 公開準備中です。

**手動でインストールする**

1. このリポジトリをダウンロード（**Code → Download ZIP**）して展開します。
2. Chrome で `chrome://extensions` を開きます。
3. 右上の「デベロッパー モード」をオンにします。
4. 「パッケージ化されていない拡張機能を読み込む」を押して、`youtube-live-hotkey` フォルダを選びます。
5. すでに開いている YouTube のタブは、一度再読み込みしてください。

新しい版に更新したときは、`chrome://extensions` でこの拡張機能の再読み込みボタン（↻）を押してから、YouTube のタブを再読み込みしてください。

### 使い方

設定したキー（初期設定: F2）を押すと、そのときの状態に合わせて次のように動きます。

| 状態 | キーを押したときの動作 |
| --- | --- |
| ライブ配信で一時停止中 | 「ライブ」ボタンを押して、最新の配信位置から再生 |
| ライブ配信で再生中 | 一時停止 |
| 通常の動画 | 再生 / 一時停止の切り替え |

- チャット欄に入力中でも反応します。
- 押したときは、プレーヤーの上部に「ライブへ移動しました」「一時停止しました」などの通知が出ます。
- 広告の再生中は「ライブ」ボタンは押さず、再生 / 一時停止だけを切り替えます。

### 設定

ツールバーの拡張機能アイコン（または `chrome://extensions` の「詳細」→「拡張機能のオプション」）から設定画面を開けます。
画面の言語は Chrome の表示言語に合わせて切り替わります（日本語なら日本語、それ以外は英語）。

- **キーを変更**: ボタンを押してから、割り当てたいキーを押します（Ctrl や Shift との組み合わせも可）。「キャンセル」ボタンか Esc でやめられます。
- **一覧から選ぶ**: Chrome で使われていない F2・F4・F8・F9 と、普通のキーボードにない F13〜F24 から選べます。
- **F2 に戻す**: 初期設定に戻します。
- **通知を表示する**: キーを押したときの画面上の通知を切り替えます。

設定は保存した時点で、開いている YouTube のタブにもすぐ反映されます。

> 文字キー（例: `Q`）や、Enter・矢印キーなど文字の編集に使うキーを割り当てた場合、チャット欄や検索欄で入力しているときは入力を優先して反応しません。

### F13〜F24 を使うとき

F13〜F24 は普通のキーボードにはないので、ツールから送ります。先に設定画面で同じキーを選んでおいてください。

**AutoHotkey v2**（Ctrl + Alt + L を F13 に変換する例）

```ahk
^!l::Send "{F13}"
```

左手デバイスなどでは、付属の設定ソフトでキーを割り当ててください。

### 注意

- キーが届くのは、Chrome で YouTube のタブを表示していて、そのページにフォーカスがあるときだけです（OBS など別のアプリを操作中は届きません）。
- 別ウィンドウに切り離したチャット（ポップアウト チャット）からは操作できません。
- Mac では、F2 などのファンクションキーを fn キーと一緒に押す必要があることがあります。
- YouTube の画面の作りが変わると動かなくなる可能性があります。内部では、ライブ配信中に表示される `.ytp-time-display.ytp-live` の中の `button.ytp-live-badge`（「ライブ」ボタン）と、再生ボタン `.ytp-play-button` をクリックしています。
- データの収集や送信は一切ありません。保存するのは設定だけで、Chrome の中に保存されます。

---

## Files / ファイル構成

| File / ファイル | Purpose / 内容 |
| --- | --- |
| `manifest.json` | Extension definition (Manifest V3) / 拡張機能の定義 |
| `common.js` | Default settings and shortcut matching / 初期設定とショートカットキーの判定処理 |
| `content.js` | Runs on YouTube and presses the “Live” or play button / YouTube のページで動き、「ライブ」ボタンや再生ボタンを押す |
| `options.html`, `options.css`, `options.js` | Settings page (also the toolbar popup) / 設定画面（ツールバーのポップアップと兼用） |
| `_locales/en`, `_locales/ja` | UI text in English and Japanese / 画面に出す文言（英語・日本語） |
| `icons/` | Icons / アイコン |
