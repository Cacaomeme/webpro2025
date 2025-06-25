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
  // フォームから送信された 'name' の値を取得するのじゃ
  const name = req.body.name;
  if (name) {
    // 名前が入力されていれば、新しいユーザーをデータベースに追加するぞ
    const newUser = await prisma.user.create({
      data: { name },
    });
    console.log('新しいユーザーを追加しました:', newUser);
  }
  // ユーザーを追加した後、ルートパス ('/') にリダイレクトするのじゃ
  // これにより、更新されたユーザー一覧が再度表示されるぞ
  res.redirect('/');
});

// サーバーを指定されたポートで起動するのじゃ
app.listen(PORT, () => {
  console.log(`Expressサーバーが起動したぞい！ http://localhost:${PORT} でアクセスできるぞ。`);
});