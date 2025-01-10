import dotenv from 'dotenv';
import { CHAIN_STACK_NODE_ENDPOINT, ALCHEMY_NODE_ENDPOINT } from './constants.js';

dotenv.config();

export const getConfig = () => {
  return {
    providers: {
      alchemy: `${ALCHEMY_NODE_ENDPOINT}${process.env.ALCHEMY_API_KEY}`,
      chainstack: `${CHAIN_STACK_NODE_ENDPOINT}${process.env.CHAIN_STACK_NODE_KEY}`,
    },
  };
};
