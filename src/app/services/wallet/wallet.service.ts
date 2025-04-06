import { Injectable } from '@angular/core';
import { Account, Address, Mnemonic, TestnetEntrypoint } from '@multiversx/sdk-core/out';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class WalletService {
    private entrypoint: TestnetEntrypoint;
    private controller;
    private account?: Account;

    constructor() {
        this.entrypoint = new TestnetEntrypoint();
        this.controller = this.entrypoint.createTransfersController();
    }

    getMnemonic() {
        return Mnemonic.generate().toString();
    }

    removeWalletData() {
        localStorage.removeItem("encryptedMnemonic");
        sessionStorage.removeItem("decryptedWallet");

        return null;
    }

    restoreWallet(userPassword: string) {
        const storedData = sessionStorage.getItem('decryptedWallet');
        if (storedData) {
            const { mnemonicString } = JSON.parse(storedData);
            this.account = Account.newFromMnemonic(mnemonicString);
            return this.account;
        }

        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic == null) {
            return null;
        }

        if (!userPassword) {
            return null;
        }

        const bytes = CryptoJS.AES.decrypt(encryptedMnemonic, userPassword);
        const mnemonicString = bytes.toString(CryptoJS.enc.Utf8);

        if (!mnemonicString) {
            return null;
        }

        this.account = Account.newFromMnemonic(mnemonicString);
        sessionStorage.setItem('decryptedWallet', JSON.stringify({ mnemonicString }));
        return this.account;
    }

    generateWallet(mnemonicString: string, userPassword: string) {
        console.log(userPassword);
        if (sessionStorage.getItem('decryptedWallet') != null) {
            sessionStorage.removeItem('decryptedWallet');
        }

        this.account = Account.newFromMnemonic(mnemonicString);

        // const userPassword = prompt("Enter a password to secure your wallet:");
        const encryptedMnemonic = CryptoJS.AES.encrypt(mnemonicString, userPassword).toString();
        console.log(encryptedMnemonic);

        localStorage.setItem('encryptedMnemonic', encryptedMnemonic);

        return this.account;
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
