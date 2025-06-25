// Expressフレームワークをインポートするのじゃ
import express from 'express';
// 生成した Prisma Client をインポートするぞ
import { PrismaClient } from './generated/prisma/client';

// Prisma Client を初期化するのじゃ
const prisma = new PrismaClient({
  // データベースに対して実行されるクエリをログに表示する設定じゃな
  log: ['query'],
});

// Expressアプリケーションを初期化するぞ
const app = express();

// 環境変数からポート番号を取得するのじゃ。もし設定されていなければ 8888 を使用するぞい
const PORT = process.env.PORT || 8888;

// EJS をテンプレートエンジンとして設定するのじゃ
// これにより、ウェブページをEJSテンプレートファイルを使って動的に生成できるようになるぞ
app.set('view engine', 'ejs');
// テンプレートファイルが 'views' ディレクトリにあることをExpressに伝えるのじゃ
app.set('views', './views');

// HTTPリクエストのボディ（特にフォームからのデータ）を解析するための設定じゃな
// これで、フォームから送られてくる 'name' などのデータを取得できるようになるぞ
app.use(express.urlencoded({ extended: true }));

// ルートパス ('/') へのGETリクエストを処理するハンドラーじゃ
app.get('/', async (req, res) => {
  // データベースからすべてのユーザー情報を取得するのじゃ
  const users = await prisma.user.findMany();
  // 'index' という名前のEJSテンプレートをレンダリングし、取得したユーザー情報を渡すのじゃ
  // これで、ウェブページにユーザー一覧が表示されるぞ
  res.render('index', { users });
});

// '/users' パスへのPOSTリクエストを処理するハンドラーじゃ
// これは、フォームから新しいユーザー情報が送信されたときに動くのじゃ
app.post('/users', async (req, res) => {
  const name = req.body.name; // フォームから送信された名前を取得じゃ
  const age = Number(req.body.age); // フォームから送信された年齢を取得じゃ。数値に変換するぞ。
  if (isNaN(age)) { // もし年齢が数値でなかったらエラーじゃ
    console.error('年齢は数値でなければなりません。');
    res.status(400).send('年齢は数値でなければなりません。');
    return; // ここで処理を終了じゃ
  }
  if (name) {
    const newUser = await prisma.user.create({
      data: { name, age }, // 年齢も保存するのじゃ
    });
    console.log('新しいユーザーを追加しました:', newUser);
  }
  res.redirect('/'); // ユーザー追加後、一覧ページにリダイレクトじゃ
});

// サーバーを指定されたポートで起動するのじゃ
app.listen(PORT, () => {
  console.log(`Expressサーバーが起動したぞい！ http://localhost:${PORT} でアクセスできるぞ。`);
});