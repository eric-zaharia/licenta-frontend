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
  privateKey: Buffer<ArrayBufferLike> | undefined;
  balance: string = '';

  constructor(private walletService: WalletService) {}

  async ngOnInit() {
    this.seedPhrase = await this.walletService.generateSeedPhrase();

    const testAddress = 'erd12zuf2hqf6t6l8jquw4grv20er9aalfckmy4hymhm4s450yjnlsrsau997s';
    this.balance = await this.walletService.getBalance(testAddress);
  }
}
