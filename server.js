import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// YouTube の動画IDを抽出
function extractVideoId(url) {
  const match = url.match(/v=([^&]+)/);
  if (match) return match[1];

  // youtu.be/xxxx
  const short = url.match(/youtu\.be\/([^?]+)/);
  if (short) return short[1];

  return null;
}

app.get("/", (req, res) => {
  res.send(`
    <h2>YouTube 軽量プロキシ</h2>
    <form action="/watch">
      <input type="text" name="v" placeholder="動画IDを入力">
      <button type="submit">再生</button>
    </form>
  `);
});

// watch?v=xxxx に対応
app.get("/watch", async (req, res) => {
  const videoId = req.query.v;
  if (!videoId) return res.send("動画IDがありません");

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  try {
    const response = await fetch(embedUrl, {
      headers: { "User-Agent": req.headers["user-agent"] }
    });

    const html = await response.text();
    res.set("Content-Type", "text/html");
    res.send(html);

  } catch (err) {
    res.send("読み込みエラー: " + err.message);
  }
});

// 通常の YouTube URL をプロキシ
app.get("/proxy", (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("URL がありません");

  const id = extractVideoId(url);
  if (!id) return res.send("動画IDが見つかりません");

  res.redirect(`/watch?v=${id}`);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

