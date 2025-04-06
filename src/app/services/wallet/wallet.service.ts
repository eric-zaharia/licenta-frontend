import { Injectable } from '@angular/core';
import { Account, Address, DevnetEntrypoint, Mnemonic } from '@multiversx/sdk-core/out';

@Injectable({
    providedIn: 'root',
})
export class WalletService {
    private entrypoint: DevnetEntrypoint;
    private controller;
    private account?: Account;

    constructor() {
        this.entrypoint = new DevnetEntrypoint();
        this.controller = this.entrypoint.createTransfersController();
    }

    getMnemonic() {
        return Mnemonic.generate().toString();
    }

    generateWallet(mnemonicString: string) {
        this.account = Account.newFromMnemonic(mnemonicString);
        return Account.newFromMnemonic(mnemonicString);
    }

    async sendTransaction(destination: string, amount: number) {
        if (this.account) {
            const destinationAddress = Address.newFromBech32(destination);

            this.account.nonce = await this.entrypoint.recallAccountNonce(this.account.address);

            const transaction = await this.controller.createTransactionForNativeTokenTransfer(
                this.account,
                this.account.getNonceThenIncrement(),
                {
                    receiver: destinationAddress,
                    nativeAmount: BigInt(amount),
                }
            );

            const txHash = await this.entrypoint.sendTransaction(transaction);
        }
    }

}
