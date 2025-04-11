import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton, MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatError, MatFormField, MatFormFieldModule, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { WalletService } from '../../services/wallet/wallet.service';
import { Transaction } from '../../model/transaction';
import { AddWalletDialog } from '../wallets/wallets.component';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { NgIf } from '@angular/common';
import { Account } from '@multiversx/sdk-core/out';

@Component({
  selector: 'app-transfer',
    imports: [
        FormsModule,
        MatButton,
        MatCard,
        MatCardContent,
        MatCardFooter,
        MatCardHeader,
        MatCardTitle,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatFormFieldModule
    ],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {
    readonly address = new FormControl('', [Validators.required]);
    readonly amount = new FormControl('', [Validators.required]);

    readonly dialog = inject(MatDialog);

    ngOnInit(): void {
    }

    openTransferDialog() {
        const dialogRef = this.dialog.open(ConfirmTransfer, {
            data: {
                address: this.address.value,
                amount: this.amount.value,
            },
            panelClass: 'custom-dialog-container',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {

            }
        });
    }
}

@Component({
    selector: 'confirm-transfer-dialog',
    templateUrl: 'confirm-transfer-dialog.html',
    styleUrl: 'confirm-transfer-dialog.css',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        ReactiveFormsModule,
    ],
})
export class ConfirmTransfer {
    readonly dialogRef = inject(MatDialogRef<ConfirmTransfer>);
    readonly data = inject(MAT_DIALOG_DATA);

    onNoClick(): void {
        this.dialogRef.close();
    }

    onAddClick() {
        this.dialogRef.close();
    }
}
