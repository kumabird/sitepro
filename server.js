import express from "express";

const app = express();
app.disable("x-powered-by");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// ★ 51本の固定動画を自動生成（全部同じ動画ID）
const fixedVideos = Array.from({ length: 51 }, (_, i) => ({
  id: "NfZsV6z48wE",
  title: `固定動画 ${i + 1}`
}));

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

// ★ 検索結果は固定の51本を返す
app.get("/search", (req, res) => {
  const q = req.query.q;
  if (!q) return res.send("検索ワードがありません");

  let list = `
    <h2>検索結果: ${q}</h2>
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    ">
  `;

  list += fixedVideos.map(v => `
    <div>
      <a href="/watch?v=${v.id}">
        <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" style="width:100%; border-radius:8px;">
        <div style="margin-top:5px; font-weight:bold;">${v.title}</div>
      </a>
    </div>
  `).join("");

  list += "</div><br><a href='/'>戻る</a>";

  res.send(list);
});

// 動画再生
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

app.listen(PORT, () => console.log("Server running"));
