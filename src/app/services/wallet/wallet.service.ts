import {Injectable} from '@angular/core';
import * as bip39 from 'bip39';
import {UserSecretKey} from '@multiversx/sdk-core';
import {Address, ApiNetworkProvider} from '@multiversx/sdk-core/out';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private provider: ApiNetworkProvider;

  constructor() {
    this.provider = new ApiNetworkProvider("https://testnet-api.multiversx.com", { clientName: "multiversx-licenta" });;
  }

  async getBalance(address: string): Promise<string> {
    // Address string -> Address object
    const userAddress = new Address(address);

    // Query the blockchain
    const balance = await this.provider.getAccount(userAddress)
      .then(account => account.balance);
    return balance.toString();
  }

  // Generate a 12-word seed phrase
  async generateSeedPhrase(): Promise<string> {
    return bip39.generateMnemonic(128);
  }

  async validateSeedPhrase(mnemonic: string): Promise<boolean> {
    return bip39.validateMnemonic(mnemonic);
  }

  // Optionally, derive seed buffer from the mnemonic
  async mnemonicToSeed(mnemonic: string): Promise<Buffer> {
    return bip39.mnemonicToSeed(mnemonic);
  }

  async derivePrivateKey(mnemonic: string): Promise<UserSecretKey> {
    // Convert to seed buffer
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // For now, you might just take first 32 bytes as the private key
    // In a production wallet, you'd use a derivation path and possibly hardened keys
    const privateKeyBuffer = seed.subarray(0, 32);
    return new UserSecretKey(privateKeyBuffer);
  }
}
