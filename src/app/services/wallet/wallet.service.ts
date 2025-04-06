import { Injectable } from '@angular/core';
import { ApiNetworkProvider, Mnemonic, UserWallet } from '@multiversx/sdk-core/out';

@Injectable({
    providedIn: 'root',
})
export class WalletService {
    private provider: ApiNetworkProvider;

    constructor() {
        this.provider = new ApiNetworkProvider(
            "https://testnet-api.multiversx.com",
            {
                clientName: "multiversx-licenta"
            }
        );
    }

    getMnemonic() {
        return Mnemonic.generate().toString();
    }

    generateWallet(mnemonicString: string) {
        const mnemonic = Mnemonic.fromString(mnemonicString);
        const password = "my password";
        const addressIndex = 0;

        const secretKey = mnemonic.deriveKey(addressIndex);
        const userWallet = UserWallet.fromSecretKey({ secretKey: secretKey, password: password });
        const jsonFileContent = userWallet.toJSON();

        console.log(jsonFileContent);

        return jsonFileContent;
    }

}
