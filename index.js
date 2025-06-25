// node:http モジュールをインポートしてHTTPサーバー機能を使うのじゃ
import http from 'node:http';
// node:url モジュールをインポートしてURLの解析機能を使うのじゃ
import { URL } from 'node:url'; // URLはグローバルオブジェクトとして使えるが、明示的にインポートする方が分かりやすいじゃろう

// 環境変数からポート番号を取得するのじゃ。もし設定されていなければ8888を使うぞ
const PORT = process.env.PORT || 8888;

// HTTPサーバーを作成するのじゃ
const server = http.createServer(async (req, res) => {
  // リクエストのURLを解析するのじゃ
  const requestUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = requestUrl.pathname; // パス名（例: / や /ask）を取得するぞ
  const queryParams = requestUrl.searchParams; // クエリパラメータ（例: ?q=hoge）を取得するぞ

  // レスポンスのヘッダーを設定するのじゃ
  // まずはContent-Typeをtext/plain; charset=utf-8に設定じゃ
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  console.log(`リクエスト受信: ${req.method} ${req.url}`); // どのリクエストが来たかログに出力じゃ

  // パス名によって異なる応答を返すのじゃ
  if (pathname === '/') {
    // ルートパス('/')へのアクセスじゃな
    console.log("ルートパスが実行されたぞい！");
    res.writeHead(200); // ステータスコード200 (OK) を設定
    res.end("こんにちは！"); // "こんにちは！"と応答するのじゃ
  } else if (pathname === '/ask') {
    // '/ask'パスへのアクセスじゃな
    console.log("/ask パスが実行されたぞい！");
    const question = queryParams.get('q'); // 'q'という名前のクエリパラメータの値を取得するぞ
    if (question) {
      res.writeHead(200); // ステータスコード200 (OK) を設定
      res.end(`Your question is '${question}'`); // 質問の内容を応答するのじゃ
    } else {
      res.writeHead(400); // ステータスコード400 (Bad Request) を設定
      res.end("質問が指定されておらんぞ！ 例: /ask?q=あなたの質問");
    }
  } else {
    // その他のパスへのアクセスじゃな
    console.log("その他のパスが実行されたぞい！");
    res.writeHead(404); // ステータスコード404 (Not Found) を設定
    res.end("あらら、そのページは見つからんぞい！");
  }
});

// サーバーを指定されたポートで起動するのじゃ
server.listen(PORT, () => {
  console.log(`サーバーが起動したぞい！ http://localhost:${PORT} でアクセスできるぞ。`);
});