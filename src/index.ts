import { JSONFilePreset } from 'lowdb/node';

type DbSchema = {
  posts: string[];
};

const defaultData: DbSchema = { posts: [] };

async function main() {
  const db = await JSONFilePreset<DbSchema>('db.json', defaultData);
  console.log(db.data);
  db.data.posts.push('hello world');
  await db.write();
}

main();
