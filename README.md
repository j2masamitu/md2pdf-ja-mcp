# md2pdf-ja-mcp

[md2pdf-ja](https://github.com/j2masamitu/md2pdf-ja) 用の MCP (Model Context Protocol) サーバー - Claude Code から直接、日本語の Markdown ファイルを美しい PDF に変換します。

## 機能

- 🚀 Claude Code から Markdown を PDF に変換
- 🇯🇵 日本語文書に最適化
- 🎨 複数のテーマ（default、academic、business）
- 📄 カスタムページフォーマット（A4、A5、B5、Letter）
- 🎯 カスタム CSS サポート
- ⚡ 高速で効率的な変換

## 前提条件

この MCP サーバーを使用する前に、[md2pdf-ja](https://github.com/j2masamitu/md2pdf-ja) をインストールする必要があります：

```bash
npm install -g @j2masamitu/md2pdf-ja
```

## インストール

### オプション 1: npm（推奨）

```bash
npm install -g @j2masamitu/md2pdf-ja-mcp
```

### オプション 2: ソースから

```bash
git clone https://github.com/j2masamitu/md2pdf-ja-mcp
cd md2pdf-ja-mcp
npm install
npm run build
npm link
```

## 設定

### Claude Code の設定

```bash
claude mcp add md2pdf-ja-mcp md2pdf-ja-mcp --scope user
```

## 利用可能なツール

### convert_markdown_to_pdf

日本語の Markdown ファイルを美しい PDF に変換します。

**パラメータ：**

- `input`（必須）：入力 Markdown ファイルへのパス
- `output`（オプション）：出力 PDF ファイルへのパス
- `title`（オプション）：文書のタイトル - **明示的に要求された場合のみ使用**
- `author`（オプション）：文書の著者 - **明示的に要求された場合のみ使用**
- `theme`（オプション）：テーマ（`default`、`academic`、`business`）- **明示的に要求された場合のみ使用**
- `format`（オプション）：ページフォーマット（`A4`、`A5`、`B5`、`Letter`）- **明示的に要求された場合のみ使用**
- `css`（オプション）：カスタム CSS ファイルへのパス - **明示的に要求された場合のみ使用**

**重要：** デフォルトでは、`input`（およびオプションで `output`）パラメータのみを使用する必要があります。他のパラメータは、ユーザーが明示的に要求した場合にのみ含める必要があります。これにより、PDF 内のタイトルの重複や不要なメタデータを防ぎます。

**Claude Code での使用例：**

```
document.md を PDF に変換して
```

```
document.md を academic テーマで PDF に変換して
```

Claude Code は、リクエストに基づいて適切なパラメータを使用して MCP ツールを自動的に使用します。

## 使用例

### 基本的な変換

```
my-document.md を PDF に変換して
```

### オプション付き

```
report.md を以下のオプションで PDF に変換して：
- タイトル: 「2024年度年次報告書」
- 著者: 「山田太郎」
- テーマ: academic
- フォーマット: A4
```

### カスタム CSS 使用

```
presentation.md を custom.css を使用してスタイリングして PDF に変換して
```

## 開発

```bash
# 依存関係のインストール
npm install

# ビルド
npm run build

# ウォッチモード
npm run watch
```

## 動作の仕組み

この MCP サーバーは：
1. Claude Code からリクエストを受信
2. 入力パラメータの検証
3. 適切なオプションで md2pdf-ja CLI を実行
4. 変換結果を Claude Code に返す

## トラブルシューティング

### 「md2pdf-ja: command not found」

md2pdf-ja がグローバルにインストールされていることを確認してください：

```bash
npm install -g @j2masamitu/md2pdf-ja
md2pdf-ja --version
```

### Claude Code に MCP サーバーが表示されない

1. 設定ファイルのパスが正しいことを確認
2. JSON 構文が有効であることを確認
3. Claude Code を完全に再起動
4. Claude Code のログでエラーを確認

### パーミッションエラー

dist/index.js ファイルが実行可能であることを確認してください：

```bash
chmod +x dist/index.js
```

## ライセンス

MIT

## 関連プロジェクト

- [md2pdf-ja](https://github.com/j2masamitu/md2pdf-ja) - コアコンバータツール
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP 仕様
