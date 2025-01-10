import { Contract, Wallet } from 'ethers';
import { getConfig } from '../utils/config.js';
import { ABI as PingPongABI } from './PingPong.js';
import { ProviderManager } from '../services/provider.js';

export class PingPongContract {
  async callPong(txnHash: string) {
    const provider = ProviderManager.getInstance().getProvider();
    const wallet = new Wallet(getConfig().walletPrivateKey, provider);
    const contract = new Contract(getConfig().pingPongAddress, PingPongABI, provider);

    const gasLimit = await contract.getFunction('pong').estimateGas(txnHash);
    const nonce = await provider.getTransactionCount(wallet.address);
    const tx = await contract.getFunction('pong').send(txnHash, {
      gasLimit,
      nonce,
    });
    await tx.wait();
    return tx;
  }
}
