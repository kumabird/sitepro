import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// YouTube 以外禁止
function isYouTube(url) {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  );
}

// 同意画面スキップ（地域パラメータ削除）
function cleanYouTubeURL(url) {
  if (url.includes("gl=") || url.includes("hl=")) {
    return "https://www.youtube.com/";
  }
  return url;
}

app.get("/", (req, res) => {
  res.redirect("/proxy?url=https://www.youtube.com");
});

app.get("/proxy", async (req, res) => {
  let url = req.query.url;
  if (!url) return res.send("URL が指定されていません");

  if (!isYouTube(url)) {
    return res.send("このプロキシでは YouTube のみ利用できます");
  }

  url = cleanYouTubeURL(url);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": req.headers["user-agent"]
      }
    });

    const contentType = response.headers.get("content-type");
    res.set("Content-Type", contentType);

    const body = await response.text();

    // リンク書き換え
    const rewritten = body
      .replace(/href="([^"]+)"/g, (m, p1) => {
        if (p1.startsWith("http")) {
          return `href="/proxy?url=${encodeURIComponent(p1)}"`;
        }
        return m;
      })
      .replace(/src="([^"]+)"/g, (m, p1) => {
        if (p1.startsWith("http")) {
          return `src="/proxy?url=${encodeURIComponent(p1)}"`;
        }
        return m;
      });

    res.send(rewritten);

  } catch (err) {
    res.send("読み込みエラー: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
