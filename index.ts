// 生成した Prisma Client をインポートするのじゃ
// このパスは schema.prisma の generator で指定した output と一致しておるな
import { PrismaClient } from "./generated/prisma/client";

// Prisma Client を初期化するぞ
const prisma = new PrismaClient({
  // クエリが実行されたときに、実際にどのようなSQLが実行されたかをログに表示する設定じゃ
  log: ['query'],
});

// メインの処理を非同期関数として定義するのじゃ
async function main() {
  // Prisma Client を使ってデータベースに接続したことをログに出力するぞ
  console.log("Prisma Client を初期化しました。");

  // 現在データベースに保存されている全てのユーザーを取得するのじゃ
  const usersBefore = await prisma.user.findMany();
  console.log("Before ユーザー一覧:", usersBefore);

  // 新しいユーザーをデータベースに追加するのじゃ
  // 名前は実行するたびに異なるように、現在時刻を組み合わせておるぞ
  const newUser = await prisma.user.create({
    data: {
      name: `新しいユーザー ${new Date().toISOString()}`,
    },
  });
  console.log("新しいユーザーを追加しました:", newUser);

  // もう一度、現在のユーザー一覧をデータベースから取得するのじゃ
  const usersAfter = await prisma.user.findMany();
  console.log("After ユーザー一覧:", usersAfter);
}

// main 関数を実行するのじゃ
// エラーが発生した場合は、エラーメッセージを表示してプログラムを終了するぞ
// 最後にPrisma Clientの接続を切断するのを忘れないようにな
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Prisma Client を切断しました。");
  });