# ai_task_prioritizer

AIを使ってタスクの優先順位を自動で整理するアプリです。

---

## 使い方（GitHub Codespacesで動かす）

### 必要なもの
- GitHubアカウント（無料）
- Gemini APIキー（無料）← [Google AI Studioで取得](https://aistudio.google.com/apikey)

> クレジットカード不要で始められます。無料枠を超えた場合は止まるだけで、勝手に課金されることはありません。

---

### 手順

**① Codespacesを起動する**

このページの緑色の「Code」ボタンをクリック
→「Codespaces」タブ
→「Create codespace on main」をクリック
→ブラウザ上でVSCodeが開く（1〜2分待つ）

---

**② 環境変数を設定する**

ターミナルで以下を実行：

```bash
cp .env.local.example .env.local
```

VSCode左側のファイルツリーから`.env.local`を開いて、自分のGemini APIキーを貼る：

```
GEMINI_API_KEY=ここに自分のAPIキーを貼る
```

保存する（Ctrl+S / Cmd+S）

---

**③ next.config.tsを確認する**

`next.config.ts`の中身が以下になっていることを確認する：

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.app.github.dev",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;
```

> この設定がないとCodespaces上でServer Actionsが動かない。

---

**④ 起動する**

```bash
npm install
npm run dev
```

---

**④ ブラウザで開く**

ポートの転送通知が出たら「ブラウザで開く」をクリック

---

### 注意事項

- `.env.local`には実際のAPIキーが入るので、GitHubにpushしないこと（`.gitignore`で除外済み）
- Codespacesの無料枠は月60時間。クレカ未登録なら超過しても課金されない
- 無料枠を超えてブロックされた場合、クレジットカードを登録すれば同じアカウントで再開できるbにpushしないこと
- Codespacesの無料枠は月60時間。クレカ未登録なら超過しても課金されない
