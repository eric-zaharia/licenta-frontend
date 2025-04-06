import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { WalletService } from '../../services/wallet/wallet.service';

@Component({
  selector: 'app-wallets',
    imports: [
        MatButton
    ],
  templateUrl: './wallets.component.html',
  styleUrl: './wallets.component.css'
})
export class WalletsComponent {
    mnemonic: string = "";
    wallet: any = null;

    constructor(
        private walletService: WalletService,
    ) {
    }

    getMnemonic() {
        this.mnemonic = this.walletService.getMnemonic();
    }

    getWallet(mnemonic: string) {
        console.log(mnemonic);
        this.wallet = this.walletService.generateWallet(mnemonic);
    }
}
