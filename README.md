# ai_task_prioritizer

# ai_task_prioritizer

AIを使ってタスクの優先順位を自動で整理するアプリです。

---

## 使い方（GitHub Codespacesで動かす）

### 必要なもの
- GitHubアカウント（無料）
- Gemini APIキー（無料）← [Google AI Studioで取得](https://aistudio.google.com/apikey)

---

### 手順

**① Codespacesを起動する**
このページの緑色の「Code」ボタンをクリック
→「Codespaces」タブ
→「Create codespace on main」をクリック
→ブラウザ上でVSCodeが開く（1〜2分待つ）

**② 環境変数を設定する**
ターミナルで以下を実行：
```bash
cp .env.local.example .env.local
```
`.env.local`を開いて、自分のGemini APIキーを貼る：

**③ 起動する**
```bash
npm install
npm run dev
```

**④ ブラウザで開く**
ポートの転送通知が出たら「ブラウザで開く」をクリック

---

## 注意事項
- `.env.local`には実際のAPIキーが入るので、GitHubにpushしないこと
- Codespacesの無料枠は月60時間。クレカ未登録なら超過しても課金されない
