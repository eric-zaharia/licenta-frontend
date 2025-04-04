import { Component, inject, OnInit } from '@angular/core';
import { combine, split } from 'shamir-secret-sharing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { of } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { PasswordService } from '../../services/password/password.service';

@Component({
    selector: 'app-add-password',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioButton,
        MatRadioGroup,
        NgForOf,
        NgIf,
    ],
    templateUrl: './add-password.component.html',
    styleUrl: './add-password.component.css'
})
export class AddPasswordComponent implements OnInit {
    private _formBuilder = inject(FormBuilder);
    private passwordService = inject(PasswordService);

    firstFormGroup = this._formBuilder.group({
        passwordLabel: ['', Validators.required],
        shardsNo: ['3'],
        password: ['', Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
        storeShards: ['Yes'],
        userShards: ['0'],
        emailSection: this._formBuilder.group({
            emails: this._formBuilder.array([])
        }),
    });

    ngOnInit() {
        this.secondFormGroup.get('userShards')?.valueChanges.subscribe(value => {
            const shardsCount = parseInt(value ?? '0', 10);
            this.updateEmails(shardsCount);
        });

        this.secondFormGroup.get('storeShards')?.valueChanges.subscribe(value => {
            if (value === 'No') {
                const shardsCount = parseInt(this.secondFormGroup.get('userShards')?.value ?? '0', 10);
                this.updateEmails(shardsCount);
            } else {
                this.clearEmails();
            }
        });

        if (this.secondFormGroup.get('storeShards')?.value === 'No') {
            const shardsCount = parseInt(this.secondFormGroup.get('userShards')?.value ?? '0', 10);
            this.updateEmails(shardsCount);
        }
    }

    submitPassword() {
        let label = this.firstFormGroup.value.passwordLabel ?? "Default label";
        let shardsNo = parseInt(this.firstFormGroup.value.shardsNo ?? '3', 10);
        let password = '';
        if (typeof this.firstFormGroup.value.password !== 'string') {
            return;
        } else {
            password = this.firstFormGroup.value.password;
        }

        let shards: string[];
        this.passwordService.getShamirShards(password, shardsNo).then(resultedShards => {
            shards = resultedShards;
            let selfCustodyShardsNo = parseInt(this.secondFormGroup.value.userShards ?? '0');
            let mailRecipients = this.secondFormGroup.value.emailSection?.emails;
            if (selfCustodyShardsNo !== shardsNo) {
                this.passwordService.uploadPassword({
                    label: label,
                    shards: shards,
                    mailRecipients: mailRecipients,
                    shardsNo: shardsNo,
                    selfCustodyShardsNo: selfCustodyShardsNo
                }).subscribe();
            }
        });
    }
    // async testShamir(password: string) {
    //     console.log(password);
    //     const secret = this.toUint8Array(password);
    //     const [share1, share2, share3] = await split(secret, 3, 2);
    //     console.log("Shares: ", share1, " ", share2, " ", share3);
    //     const reconstructed = await combine([share2, share1]);
    //     let reconstructedPassword = new TextDecoder().decode(reconstructed);
    //     console.log("Reconstructed: ", reconstructedPassword);
    // }

    get range() {
        const count = Number(this.firstFormGroup.value.shardsNo) || 0;
        return Array.from({length: count}, (_, i) => i + 1);
    }

    get emails(): FormArray {
        return this.secondFormGroup.get('emailSection.emails') as FormArray;
    }

    updateEmails(count: number): void {
        const emailsArray = this.secondFormGroup.get('emailSection.emails') as FormArray;

        if (!emailsArray) {
            return;
        }

        while (emailsArray.length < count) {
            emailsArray.push(
                this._formBuilder.control('', [Validators.required, Validators.email])
            );
        }

        while (emailsArray.length > count) {
            emailsArray.removeAt(emailsArray.length - 1);
        }
    }

    clearEmails(): void {
        const emailsArray = this.secondFormGroup.get('emailSection.emails') as FormArray;
        if (emailsArray) {
            emailsArray.clear();
        }
        this.secondFormGroup.controls.userShards.reset('0');
    }

    protected readonly of = of;
}
