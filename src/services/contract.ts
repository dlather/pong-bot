/* eslint-disable @typescript-eslint/no-explicit-any */
// Will be used to interact with the contract
import { JsonRpcProvider, Wallet } from 'ethers';
import { Contract } from 'ethers';
import { ABI as PingPongABI } from '../contract/PingPong.js';
import { getConfig } from '../utils/config.js';

export class PingPongContract {
  private provider: JsonRpcProvider;
  constructor(private _provider: JsonRpcProvider) {
    this.provider = _provider;
  }

  async callPong(txnHash: string, onStart: () => void, onSuccess: () => void, onError: (error: Error) => void) {
    try {
      onStart();
      const contract = new Contract(getConfig().pingPongAddress, PingPongABI, this.provider) as any;
      const gasLimit = await contract.estimateGas.pong(txnHash);

      const wallet = new Wallet(getConfig().walletPrivateKey, this.provider);
      const nonce = await this.provider.getTransactionCount(wallet.address);

      const tx = await contract.connect(wallet).pong(txnHash, {
        gasLimit,
        nonce,
      });
      await tx.wait();
      onSuccess();
    } catch (error) {
      onError(error as Error);
    }
  }
}
