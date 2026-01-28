import express from "express";

const app = express();
app.disable("x-powered-by");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// ★ 叫びタイトル7種類
const titlePatterns = [
  "議員という大きな、ク、カテゴリーに比べたらア、政務調査費、セィッイッム活動費の、報告ノォォー",
  "一生懸命ほんとに、少子化問題、高齢ェェエエ者ッハアアアァアーー！！　高齢者問題はー！　我が県のみウワッハッハーーン！！　我が県のッハアーーーー！",
  "そういう問題ッヒョオッホーーー！！　解決ジダイガダメニ！　俺ハネェ！　ブフッフンハアァア！！　誰がね゛え！　誰が誰に投票ジデモ゛オンナジヤ、オンナジヤ思っでえ！",
  "ウーハッフッハーン！！　ッウーン！　ずっと投票してきたんですわ！　せやけど！　変わらへんからーそれやったらワダヂが！",
  "立候補して！　文字通り！　アハハーンッ！　命がけでイェーヒッフア゛ーー！！！　……ッウ、ック。サトウ記者！　あなたには分からないでしょうけどね！",
  "この世の中を！　ウグッブーン！！　ゴノ、ゴノ世のブッヒィフエエエーーーーンン！！　ヒィェーーッフウンン！！　ウゥ……ウゥ……。ア゛ーーーーーア゛ッア゛ーー！！！！　ゴノ！　世の！　中ガッハッハアン！！　ア゛ーー世の中を！　ゥ変エダイ！　その一心でええ！！",
  "ですから皆さまのご指摘を、県民の皆さまのご指摘と受け止めデーーヒィッフウ！！　ア゛ーハーア゛ァッハアァーー！　ッグ、ッグ、ア゛ーア゛ァアァアァ。ご指摘と受け止めて！　ア゛ーア゛ーッハア゛ーーン！"
];

// ★ 51本の固定動画（タイトルはランダム）
const fixedVideos = Array.from({ length: 51 }, () => ({
  id: "NfZsV6z48wE",
  title: titlePatterns[Math.floor(Math.random() * titlePatterns.length)]
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

// ★ 検索結果（51本表示）→ 10% の確率で wBf47hGMch0 に差し替え
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

  list += fixedVideos.map(v => {
    // ★ 10% の確率で検索結果の動画 ID を差し替え
    const videoId = Math.random() < 0.1 ? "wBf47hGMch0" : v.id;

    return `
      <div>
        <a href="/watch?v=${videoId}">
          <img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" style="width:100%; border-radius:8px;">
          <div style="margin-top:5px; font-weight:bold;">${v.title}</div>
        </a>
      </div>
    `;
  }).join("");

  list += "</div><br><a href='/'>戻る</a>";

  res.send(list);
});

// ★ 動画再生（9本同時）※元のまま
app.get("/watch", (req, res) => {
  const id = req.query.v;
  if (!id) return res.send("動画IDがありません");

  const iframes = Array.from({ length: 9 }, () => `
    <iframe width="300" height="170"
      src="https://www.youtube.com/embed/${id}"
      frameborder="0" allowfullscreen></iframe>
  `).join("");

  res.send(`
    <h2>動画再生（9本同時）</h2>
    <div style="
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    ">
      ${iframes}
    </div>
    <br><br>
    <a href="/redirect">ホーム</a>
  `);
});

// ★ ホーム → 8秒動画 → 自動で別動画（元のまま）
app.get("/redirect", (req, res) => {
  res.send(`
    <style>
      body {
        margin: 0;
        background: black;
        overflow: hidden;
      }
      iframe {
        width: 100vw;
        height: 100vh;
        border: none;
      }
    </style>

    <iframe id="player"
      src="https://www.youtube.com/embed/mpSYaTtWlaY?autoplay=1&mute=1"
      allow="autoplay"
    ></iframe>

    <script>
      setTimeout(() => {
        document.getElementById("player").src =
          "https://www.youtube.com/embed/ZAE-avsH8D0?autoplay=1&mute=0&playlist=ZAE-avsH8D0&loop=1";
      }, 8000);
    </script>
  `);
});

app.listen(PORT, () => console.log("Server running"));
