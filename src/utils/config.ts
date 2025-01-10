import dotenv from 'dotenv';
import { CHAIN_STACK_NODE_ENDPOINT, ALCHEMY_NODE_ENDPOINT, INFURA_NODE_ENDPOINT } from './constants.js';

dotenv.config();

export const getConfig = () => {
  const providers: Array<{ url: string; priority: number }> = [];

  if (process.env.INFURA_API_KEY) {
    providers.push({
      url: `${INFURA_NODE_ENDPOINT}${process.env.INFURA_API_KEY}`,
      priority: 1, // Highest priority
    });
  }

  if (process.env.ALCHEMY_API_KEY) {
    providers.push({
      url: `${ALCHEMY_NODE_ENDPOINT}${process.env.ALCHEMY_API_KEY}`,
      priority: 2,
    });
  }

  if (process.env.CHAIN_STACK_NODE_KEY) {
    providers.push({
      url: `${CHAIN_STACK_NODE_ENDPOINT}${process.env.CHAIN_STACK_NODE_KEY}`,
      priority: 3,
    });
  }

  return {
    providers,
    pingPongAddress: process.env.PING_PONG_ADDRESS || '',
    walletPrivateKey: process.env.WALLET_PRIVATE_KEY || '',
  };
};
