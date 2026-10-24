# HIGH28 / ふたば — Official Site

MIX師・作曲家「HIGH28（ふたば）」のポートフォリオサイト。**Tailwind CSS v4** で作った静的サイト。ビルド済みの CSS を同梱しているので、GitHub Pages にそのまま置けます。

## 構成

```
high28-site/
├─ index.html                  # ページ本体（文章・作品・リンクはここ）
├─ assets/
│  ├─ css/
│  │  ├─ input.css             # Tailwind のソース（テーマ設定と自前CSS）
│  │  └─ style.css             # ビルド出力（生成物・手動編集しない）
│  ├─ js/main.js               # ローダー・カーソル・スクロール演出 etc.
│  └─ img/
│     ├─ high28-logo.webp      # ロゴ（白・透過 / 1400×351）
│     ├─ chibi-solo.webp       # 個人活動の立ち絵（透過 / 900×764）
│     ├─ chibi-group.webp      # 堕天症候群の立ち絵（透過 / 571×983）
│     ├─ og.jpg                # SNSシェア用画像（1200×630 / 約68KB）
│     └─ works/                # 作品サムネイル（WebP）
├─ package.json                # npm scripts（Tailwind ビルド用）
├─ .gitignore
├─ .nojekyll                   # GitHub Pages 用
└─ README.md
```

## ローカルで確認

```powershell
cd C:\Users\high2\high28-site
python -m http.server 8000
# → http://localhost:8000
```

`index.html` をダブルクリックでも動きます（`style.css` はビルド済みなのでそのまま表示されます）。

## HTMLを編集したら（Tailwindの再ビルド）

Tailwind は HTML を走査して使っているクラスだけ CSS に含めます。**新しいクラスを追加したら必ず再ビルドしてください。**

```powershell
npm install              # 初回だけ
npm run build            # 1回だけビルド
npm run dev              # 保存ごとに自動ビルド（開発用）
```

`assets/css/style.css` は生成物なので手動編集しないでください。変更したい場合は `assets/css/input.css` に書きます。

## GitHub Pages で公開

1. GitHub でリポジトリを作成（例: `high28`）
2. このフォルダで以下を実行

```powershell
cd C:\Users\high2\high28-site

# 初回だけ（Git のユーザー情報が未設定の場合）
git config user.name "HIGH28"
git config user.email "you@example.com"

npm install
npm run build

git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/high28hutaba/high28.git
git push -u origin main
```

3. GitHub のリポジトリ → **Settings → Pages**
4. **Source: Deploy from a branch** / **Branch: `main` / `(root)`** を選んで Save
5. 数十秒〜数分で `https://high28hutaba.github.io/high28/` に公開されます

> リポジトリ名を `<ユーザー名>.github.io` にすると `https://high28hutaba.github.io/` で表示されます。

## 公開前に確認する場所

| 内容 | 場所 |
| --- | --- |
| 作品カード | `#works`。「少女A」「少女レイ」の2作品（YouTube / X）を設定済み |
| Contactのリンク先 | `#contact` のボタン。`https://x.com/High28Hutaba`（XのDM） |
| プロフィール本文・対応内容 | `#about` |
| グループ紹介の文言・リンク | `#group`。リンク先が決まったら「グループを見る」のボタンを追加 |
| OGP画像の絶対URL | `<head>` の `og:image` を `https://high28hutaba.github.io/high28/assets/img/og.jpg` に変更し、`og:url` を追加 |

SNSリンク（X / YouTube / SoundCloud / Discord）は設定済みです。変更する場合は `#links` の各 `href` と、`<head>` の JSON-LD の `sameAs` も一緒に更新してください。

## 画像の使い分け

| 画像 | 用途 | 使う場所 |
| --- | --- | --- |
| `chibi-solo.webp` | 個人活動（HIGH28 / ふたば）の立ち絵 | ヒーロー・OGP画像 |
| `chibi-group.webp` | 所属グループ「堕天症候群」の立ち絵 | `#group` セクションのみ |

グループの立ち絵を個人のヒーローに戻さないよう注意してください。逆に、個人の立ち絵をグループ紹介に使わないこと。

## 作品を追加する

`#works` 内の `<a class="group block">` をまるごとコピーして、`href` と `src`、タイトル・担当・日付を差し替えます。

1. サムネイルを `assets/img/works/` に WebP で置く（1280×720 推奨、約30〜50KB）
2. `<img src="assets/img/works/ファイル名.webp" alt="作品名のサムネイル">`
3. タイトル・担当・日付を編集

## 動きと仕掛け

| 仕掛け | 内容 | 実装 |
| --- | --- | --- |
| ローダー | 初回表示時に HIGH28 のロゴと進捗バーを表示し、読み込み後にフェードアウト | `#loader` / `main.js` |
| スクロール進捗 | 画面上部の細い緑のバー | `#progress` |
| カスタムカーソル | 緑のドット＋遅れて追従するリング。リンク上で拡大 | `.cursor-dot` / `.cursor-ring` |
| ロゴのグリッチ | 常時ループで色収差（RGBずれ）＋横スライスずれ。マウス操作は不要 | `#logoGlitch`（SVGフィルター）/ `.glitch-logo` |
| 立ち絵の浮遊 | ゆっくり上下に浮く＋マウスに少し追従（パララックス） | `.animate-float` / `#chibiParallax` |
| マグネティック | CTAボタンがカーソルに少し引き寄せられる | `[data-magnetic]` |
| マーキー | MIX / 作曲 / Mastering などの細い流れる帯（ホバーで停止） | `.marquee-track` |
| マスクリビール | 見出しが下からせり上がって出現 | `[data-mask]` |
| カード演出 | サムネイルが彩度アップ＋ズーム、タイトルに下線 | `.work-thumb` / `.work-link` |
| ヘッダー縮小 | スクロールで高さが 64px → 56px に | `.site-header.is-scrolled` |
| Groupパネル | 「堕天症候群」の紹介。個人のプロフィールとは枠で分離 | `#group` / `.group-visual` |

`prefers-reduced-motion: reduce` の環境では、ローダー・カーソル・パララックス・グリッチ・マーキーが停止します。

## カスタマイズ

- **配色**: `assets/css/input.css` の `@theme` に色を追加

  ```css
  @theme {
    --color-accent: #34d399;
  }
  ```

  あとは `text-accent` / `bg-accent` が使えるようになります。今は Tailwind 標準の `zinc`（グレー）と `emerald`（緑）を使用。
- **フォント**: `index.html` の Google Fonts 読み込みと `input.css` の `@theme { --font-sans / --font-jp }`
- **文字サイズ・余白**: 各セクションの Tailwind クラスを編集
- **独自ドメイン**: リポジトリ直下に `CNAME` ファイルを作り、ドメイン名を1行書く

## メモ

- 外部依存は Google Fonts のみ。オフライン時は端末のフォントで表示されます。
- `prefers-reduced-motion` に対応。動きを抑える設定の端末ではアニメーションが止まります。
- JS無効でも全コンテンツが表示されます（`js` クラスがないと reveal が発動しません）。
- 作品サムネイルは各動画のものです。差し替える場合、権利者本人の許諾を得た画像を使ってください。
- `node_modules/` は `.gitignore` 済み。リポジトリには含まれません。
