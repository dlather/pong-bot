import { JSONFilePreset } from 'lowdb/node';
import { JsonRpcProvider } from 'ethers';
import { getConfig } from './utils/config.js';
import logger from './services/logger.js';

type DbSchema = {
  posts: string[];
};

const defaultData: DbSchema = { posts: [] };

async function main() {
  const db = await JSONFilePreset<DbSchema>('db.json', defaultData);
  logger.info(db.data);
  db.data.posts.push('hello world');
  await db.write();
  //   const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
  //   const jsonRpcProvider = new JsonRpcProvider(`${ALCHEMY_NODE_ENDPOINT}${process.env.ALCHEMY_API_KEY}`);
  const jsonRpcProvider = new JsonRpcProvider(getConfig().providers.alchemy);
  const blockNumber = await jsonRpcProvider.getBlockNumber();
  logger.info(blockNumber);
}

main();
