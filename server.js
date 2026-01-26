import express from "express";
const app = express();
app.disable("x-powered-by");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// ホーム（検索フォーム）
app.get("/", (req, res) => {
  res.send(`
    <h2>YouTube Viewer</h2>
    <form action="/search">
      <input type="text" name="q" placeholder="きのこを崇めよ" style="width:300px;">
      <button type="submit">検索</button>
    </form>
  `);
});

// 検索結果（ドッキリ版）
app.get("/search", (req, res) => {
  const q = req.query.q || "しいたけ";

  const videos = Array(9).fill({
    id: "dQw4w9WgXcQ", // ドッキリ用の動画ID
    title: "松川しばく"
  });

  let list = `
    <h2>検索結果: ${q}</h2>
    <p>これは運命です。あなたは猿よりも頭が悪いです。あと猿に失礼です</p>
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    ">
  `;

  list += videos.map(v => `
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

// 動画再生（埋め込み＋ドッキリメッセージ）
app.get("/watch", (req, res) => {
  const id = req.query.v;
  if (!id) return res.send("動画IDがありません");

  res.send(`
    <h2>動画再生</h2>
    <p style="color:red; font-weight:bold;">松川が来たらすぐに逃げましょう</p>
    <iframe width="560" height="315"
      src="https://www.youtube.com/embed/${id}?autoplay=1"
      frameborder="0" allowfullscreen></iframe>
    <br><br>
    <a href="/">ホーム</a>
  `);
});

// Shorts 再生（そのまま）
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

// チャンネル動画一覧（ドッキリ化）
app.get("/channel", (req, res) => {
  const id = req.query.id;
  if (!id) return res.send("チャンネルIDがありません");

  const videos = Array(9).fill({
    id: "dQw4w9WgXcQ",
    title: "Matukawa'hed is lonely"
  });

  let list = `
    <h2>チャンネル動画一覧（ID: ${id}）</h2>
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    ">
  `;

  list += videos.map(v => `
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

app.listen(PORT, () => console.log("こんなところに野生の松川が!"));
