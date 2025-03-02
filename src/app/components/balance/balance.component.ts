import { Component } from '@angular/core';
import {WalletService} from '../../services/wallet/wallet.service';

@Component({
  selector: 'app-balance',
  imports: [],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.css'
})
export class BalanceComponent {
  seedPhrase: string = '';
  balance: string = '';

  constructor(private walletService: WalletService) {}

  async ngOnInit() {
    this.seedPhrase = await this.walletService.generateSeedPhrase();
    console.log('Generated seed phrase:', this.seedPhrase);

    // Suppose you already have or create an address you want to check
    // (From a private key or test address).
    const testAddress = 'erd12zuf2hqf6t6l8jquw4grv20er9aalfckmy4hymhm4s450yjnlsrsau997s'; // Replace with a valid address
    this.balance = await this.walletService.getBalance(testAddress);
    console.log('Address balance:', this.balance);
  }
}
