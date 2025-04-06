import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { WalletService } from '../../services/wallet/wallet.service';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-wallets',
    imports: [
        MatButton,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatCardFooter,
        MatLabel,
        MatFormField,
        MatInput,
        MatIcon,
        MatIconButton,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
    ],
  templateUrl: './wallets.component.html',
  styleUrl: './wallets.component.css'
})
export class WalletsComponent implements OnInit {
    wallet?: Account | null;
    locked = false;
    readonly dialog = inject(MatDialog);
    userPassword: FormControl = new FormControl('');

    constructor(
        private walletService: WalletService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.wallet = this.walletService.restoreWallet(this.userPassword.value);
    }

    walletLocked() {
        return sessionStorage.getItem("decryptedWallet") === null && this.existsWallet()
    }

    existsWallet(): boolean {
        return localStorage.getItem("encryptedMnemonic") !== null;
    }

    removeWallet() {
        this.wallet = this.walletService.removeWalletData();
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

    hide = signal(true);
    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }

    unlockWallet() {
        this.wallet = this.walletService.restoreWallet(this.userPassword.value);
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
        ReactiveFormsModule,
        MatIcon,
    ],
})
export class AddWalletDialog {
    mnemonic: string = "";
    wallet?: Account;
    readonly dialogRef = inject(MatDialogRef<AddWalletDialog>);
    readonly data = inject(MAT_DIALOG_DATA);
    selectedAction: string = "import";
    userPassword: FormControl = new FormControl('');

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
        this.wallet = this.walletService.generateWallet(mnemonic, this.userPassword.value);
    }

    onAddClick() {
        if (this.mnemonic && this.mnemonic != "") {
            this.createWallet(this.mnemonic);
            this.dialogRef.close({wallet: this.wallet});
        }
    }

    hide = signal(true);
    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }
}
