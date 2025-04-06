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

}
