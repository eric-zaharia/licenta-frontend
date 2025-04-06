import { Component, inject, OnInit } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { WalletService } from '../../services/wallet/wallet.service';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {
    MAT_DIALOG_DATA, MatDialog,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { NgIf } from '@angular/common';
import { Account } from '@multiversx/sdk-core/out';

@Component({
  selector: 'app-wallets',
    imports: [
        MatButton,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatCardFooter
    ],
  templateUrl: './wallets.component.html',
  styleUrl: './wallets.component.css'
})
export class WalletsComponent implements OnInit {
    wallet?: Account | null;
    readonly dialog = inject(MatDialog);

    constructor(
        private walletService: WalletService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.wallet = this.walletService.restoreWallet();
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AddWalletDialog, {
            data: {},
            panelClass: 'custom-dialog-container',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.wallet = result.wallet;
            }
        });
    }
}

@Component({
    selector: 'add-wallet-dialog',
    templateUrl: 'add-wallet-dialog.html',
    styleUrl: 'add-wallet-dialog.css',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonToggle,
        MatButtonToggleGroup,
        NgIf,
    ],
})
export class AddWalletDialog {
    mnemonic: string = "";
    wallet?: Account;
    readonly dialogRef = inject(MatDialogRef<AddWalletDialog>);
    readonly data = inject(MAT_DIALOG_DATA);
    selectedAction: string = "import";

    constructor(private walletService: WalletService) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    getMnemonic() {
        this.mnemonic = this.walletService.getMnemonic();
    }

    createWallet(mnemonic: string) {
        console.log(mnemonic);
        this.wallet = this.walletService.generateWallet(mnemonic);
    }

    onAddClick() {
        if (this.mnemonic && this.mnemonic != "") {
            this.createWallet(this.mnemonic);
            this.dialogRef.close({wallet: this.wallet});
        }
    }
}
