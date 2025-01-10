import { JsonRpcProvider } from 'ethers';
import { getConfig } from '../utils/config.js';
import logger from './logger.js';

/* 
The system maintains a pool of trusted RPC providers, prioritizing one provider at a time based on pre-defined priorities. 
A health check runs every 30 seconds to validate the providers and update the pool. 
On failure, the bot gracefully switches to the next available provider.
*/

type ProviderConfig = {
  provider: JsonRpcProvider;
  priority: number;
  url: string;
};

export class ProviderManager {
  private static instance: ProviderManager;
  private validProviders: ProviderConfig[] = [];
  private currentProviderIndex = 0;

  private constructor() {
    this.initializeProviders();
    this.startHealthCheck();
  }

  public static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager();
    }
    return ProviderManager.instance;
  }

  public getProvider(): JsonRpcProvider {
    if (this.validProviders.length === 0) {
      throw new Error('No valid providers available.');
    }

    const currentProviderConfig = this.validProviders[this.currentProviderIndex];
    return currentProviderConfig.provider;
  }

  public async handleProviderFailure(): Promise<void> {
    this.currentProviderIndex = (this.currentProviderIndex + 1) % this.validProviders.length;
    logger.warn(`Switching to provider at index ${this.currentProviderIndex}`);
  }

  private initializeProviders(): void {
    const providers = getConfig().providers;

    this.validProviders = providers
      .map((provider) => ({
        provider: new JsonRpcProvider(provider.url),
        priority: provider.priority || 0,
        url: provider.url,
      }))
      .sort((a, b) => a.priority - b.priority);
  }

  private async startHealthCheck(): Promise<void> {
    const healthCheckInterval = 30_000;

    setInterval(async () => {
      const newValidProviders: ProviderConfig[] = [];
      for (const config of this.validProviders) {
        try {
          await config.provider.getBlockNumber();
          newValidProviders.push(config);
          logger.info(`Provider ${config.url} is healthy.`);
        } catch {
          logger.warn(`Provider ${config.url} is unhealthy.`);
        }
      }

      // Update the valid providers list and reset the index if necessary
      this.validProviders = newValidProviders.sort((a, b) => a.priority - b.priority);
      if (this.currentProviderIndex >= this.validProviders.length) {
        this.currentProviderIndex = 0; // Reset to the first valid provider
      }
    }, healthCheckInterval);
  }
}
