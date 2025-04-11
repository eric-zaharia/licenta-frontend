import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { WalletService } from '../../services/wallet/wallet.service';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { AsyncPipe, NgIf } from '@angular/common';
import { Account } from '@multiversx/sdk-core/out';
import { MatIcon } from '@angular/material/icon';
import { Transaction } from '../../model/transaction';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-wallets',
    imports: [
        AsyncPipe,
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
        MatTableModule,
    ],
    templateUrl: './wallets.component.html',
    styleUrl: './wallets.component.css'
})
export class WalletsComponent implements OnInit {
    wallet?: Account | null;
    readonly dialog = inject(MatDialog);
    userPassword: FormControl = new FormControl('');
    balance$: Promise<string> | undefined = undefined;
    transactions$: Promise<Transaction[] | void> | undefined = undefined;
    displayedColumns: string[] = ['incoming', 'address', 'amount', 'timestamp'];
    dataSource: Transaction[] = [];

    constructor(
        protected walletService: WalletService,
    ) {
    }

    ngOnInit() {
        this.wallet = this.walletService.restoreWallet(this.userPassword.value);
        this.balance$ = this.walletService.getEgldBalance();
        this.transactions$ = this.walletService.getTransactions().then(
            (result: Transaction[]) => {
                this.dataSource = result;
            }
        );
    }

    accountLocked() {
        return sessionStorage.getItem("decryptedWallet") === null && this.existsAccount()
    }

    existsAccount(): boolean {
        return localStorage.getItem("encryptedMnemonic") !== null;
    }

    removeAccount() {
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
                this.balance$ = this.walletService.getEgldBalance();
                this.transactions$ = this.walletService.getTransactions().then(
                    (result: Transaction[]) => {
                        this.dataSource = result;
                    }
                );
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
        this.balance$ = this.walletService.getEgldBalance();
        this.transactions$ = this.walletService.getTransactions().then(
            (result: Transaction[]) => {
                this.dataSource = result;
            }
        );
    }

    transfer() {
        const addr = "erd12k59hnw5fzl9st5jdf4xgqkglakxumy5nvkpj4r572a8pn6ae36s9fz9gg";
        this.walletService.sendTransaction(addr, 0.15).then(r => {
            this.balance$ = this.walletService.getEgldBalance();
            this.transactions$ = this.walletService.getTransactions().then(
                (result: Transaction[]) => {
                    this.dataSource = result;
                }
            );
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

    createAccount(mnemonic: string) {
        console.log(mnemonic);
        this.wallet = this.walletService.generateWallet(mnemonic, this.userPassword.value);
    }

    onAddClick() {
        if (this.mnemonic && this.mnemonic != "") {
            this.createAccount(this.mnemonic);
            this.dialogRef.close({wallet: this.wallet});
        }
    }

    hide = signal(true);

    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide());
        event.stopPropagation();
    }
}
