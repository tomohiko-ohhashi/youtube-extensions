# Chrome ウェブストア掲載用の情報（Live Jump for YouTube）

Chrome ウェブストアのデベロッパー ダッシュボードに入力・アップロードする内容をまとめたものです。
名前と概要（短い説明）は `manifest.json` と `_locales` から自動で読み込まれるので、ダッシュボードで入力するのは「説明」以降です。

## アップロードするファイル

| 項目 | ファイル | 備考 |
| --- | --- | --- |
| パッケージ（ZIP） | `live-jump-for-youtube-<バージョン>.zip` | 作り方は下の「ZIP の作り方」 |
| ストアアイコン（128×128） | `youtube-live-hotkey/icons/icon128.png` | 絵は 96×96、周りに 16px の透明な余白 |
| スクリーンショット（1280×800） | `screenshot-1-en.png`, `screenshot-2-en.png` | 英語の掲載情報用 |
| スクリーンショット（1280×800） | `screenshot-1-ja.png`, `screenshot-2-ja.png` | 日本語の掲載情報用 |
| 小さいプロモーション タイル（440×280） | `promo-small-en.png`, `promo-small-ja.png` | 英語用・日本語用 |

画像はどれも透過なしの 24 ビット PNG です。実際の YouTube の画面で通知が出ているところを撮影して、3 枚目のスクリーンショットとして追加するとより伝わりやすくなります。

## ZIP の作り方

`youtube-live-hotkey` フォルダの**中身**を ZIP にします（ZIP を開いたとき、一番上に `manifest.json` があるようにします）。README は入れなくても構いません。

- Windows: `youtube-live-hotkey` フォルダを開き、README 以外のファイルとフォルダをすべて選択 → 右クリック →「送る」→「圧縮 (zip 形式) フォルダー」
- Mac / Linux（リポジトリの一番上で）:

  ```sh
  mkdir -p dist
  cd youtube-live-hotkey
  zip -r "../dist/live-jump-for-youtube-$(sed -n 's/.*"version": "\(.*\)".*/\1/p' manifest.json).zip" . -x 'README*'
  ```

新しい版を出すときは、`manifest.json` の `version` を上げてから ZIP を作り直してください。

## ストアの掲載情報（Store listing）

- カテゴリ: 機能と UI（Functionality & UI）
- 言語: 英語（English）を既定にして、日本語の掲載情報を追加します。

### 説明（英語）

```text
Press one key to control YouTube playback — handy for live streams.

• Live stream, paused → presses the player's “Live” button and resumes from the latest point
• Live stream, playing → pauses
• Regular video → plays / pauses

The default key is F2, which Chrome doesn't use. You can change it in the settings:
• Choose F2, F4, F8, F9, or F13–F24 from a list
• Or press any key or key combination to set it

F13–F24 aren't on regular keyboards, so they're handy to send from a macro pad or AutoHotkey without clashing with anything else.

Also
• Works while you're typing in live chat
• Shows a short on-screen notice (can be turned off)
• If you assign a character key or Enter, it won't get in the way while you type
• English and Japanese
• No data is collected or sent anywhere

Notes
• Keys only reach the extension while a YouTube tab is focused in Chrome.
• On a Mac, you may need to hold fn while pressing function keys.

This extension is not affiliated with, endorsed by, or sponsored by YouTube or Google LLC. YouTube is a trademark of Google LLC.
```

### 説明（日本語）

```text
キーひとつで YouTube の再生を操作できます。ライブ配信を見るときに便利です。

・ライブ配信で一時停止中 → プレーヤーの「ライブ」ボタンを押して、最新の位置から再生
・ライブ配信で再生中 → 一時停止
・通常の動画 → 再生 / 一時停止

初期設定のキーは、Chrome で使われていない F2 です。設定画面で変更できます。
・F2・F4・F8・F9・F13〜F24 を一覧から選択
・押したキーやキーの組み合わせをそのまま登録

F13〜F24 は普通のキーボードにないキーなので、左手デバイスや AutoHotkey から送れば、ほかの操作とぶつかりません。

そのほか
・チャット欄に入力中でも使えます
・押したときに画面に短い通知を表示します（オフにできます）
・文字キーや Enter を割り当てても、入力中のじゃまをしません
・日本語・英語に対応
・データの収集や送信は一切ありません

ご注意
・キーが届くのは、Chrome で YouTube のタブにフォーカスがあるときだけです。
・Mac では、ファンクションキーを fn キーと一緒に押す必要があることがあります。

この拡張機能は YouTube および Google LLC とは関係がなく、承認や後援を受けたものではありません。YouTube は Google LLC の商標です。
```

## プライバシーへの取り組み（Privacy practices）

審査担当者が読む欄なので、英語で入力します。

### 単一用途（Single purpose）

```text
Lets users control YouTube playback with a single keyboard key: when a live stream is paused, it presses the player's "Live" button to jump to the latest point; otherwise it toggles play / pause.
```

### 権限が必要な理由（Permission justification）

`storage`:

```text
Saves the user's chosen shortcut key and whether to show the on-screen notice (chrome.storage.sync). Nothing else is stored.
```

ホスト権限（`https://www.youtube.com/*` のコンテンツ スクリプト）:

```text
The content script runs on YouTube pages to listen for the user's chosen key and click the player's "Live" or play / pause button. It does not read, collect, or send any page content or user data.
```

### リモートコード（Remote code）

「いいえ、リモートコードを使用していません（No, I am not using remote code）」を選びます。すべてのコードはパッケージに含まれています。

### データの使用（Data usage）

- 収集するユーザーデータ: どの項目にもチェックを入れません（何も収集しません）。
- 次の 3 つの宣誓にはチェックを入れます。
  - 承認されている用途以外で、ユーザーデータを第三者に販売・転送しない
  - 拡張機能の単一用途と関係のない目的で、ユーザーデータを使用・転送しない
  - 信用力の判断や融資の目的で、ユーザーデータを使用・転送しない
- プライバシー ポリシー: ユーザーデータを扱わないので必須ではありません。
