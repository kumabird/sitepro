import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// ホーム（検索フォーム）
app.get("/", (req, res) => {
  res.send(`
    <h2>YouTube Viewer（API不要）</h2>
    <form action="/search">
      <input type="text" name="q" placeholder="検索ワードを入力" style="width:300px;">
      <button type="submit">検索</button>
    </form>
  `);
});

// 検索結果（HTML解析）
app.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.send("検索ワードがありません");

  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const html = await fetch(url).then(r => r.text());

  // HTML から videoId を抽出
  const videoIds = [...html.matchAll(/"videoId":"(.*?)"/g)].map(m => m[1]);
  const unique = [...new Set(videoIds)].slice(0, 20);

  let list = unique.map(id => `
    <div style="margin-bottom:20px;">
      <a href="/watch?v=${id}">
        <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" width="200"><br>
        動画ID: ${id}
      </a>
    </div>
  `).join("");

  res.send(`
    <h2>検索結果: ${q}</h2>
    ${list}
    <a href="/">戻る</a>
  `);
});

// 動画再生（埋め込み）
app.get("/watch", (req, res) => {
  const id = req.query.v;
  if (!id) return res.send("動画IDがありません");

  res.send(`
    <h2>動画再生</h2>
    <iframe width="560" height="315"
      src="https://www.youtube.com/embed/${id}"
      frameborder="0" allowfullscreen></iframe>
    <br><br>
    <a href="/">ホーム</a>
  `);
});

// Shorts 再生（埋め込み）
app.get("/shorts", (req, res) => {
  const id = req.query.v;
  if (!id) return res.send("Shorts ID がありません");

  res.send(`
    <h2>Shorts 再生</h2>
    <iframe width="315" height="560"
      src="https://www.youtube.com/embed/${id}"
      frameborder="0" allowfullscreen></iframe>
    <br><br>
    <a href="/">ホーム</a>
  `);
});

// チャンネル動画一覧（HTML解析）
app.get("/channel", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.send("チャンネルIDがありません");

  const url = `https://www.youtube.com/channel/${id}/videos`;
  const html = await fetch(url).then(r => r.text());

  const videoIds = [...html.matchAll(/"videoId":"(.*?)"/g)].map(m => m[1]);
  const unique = [...new Set(videoIds)].slice(0, 30);

  let list = unique.map(id => `
    <div style="margin-bottom:20px;">
      <a href="/watch?v=${id}">
        <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" width="200"><br>
        動画ID: ${id}
      </a>
    </div>
  `).join("");

  res.send(`
    <h2>チャンネル動画一覧</h2>
    ${list}
    <a href="/">戻る</a>
  `);
});

app.listen(PORT, () => console.log("Server running"));
