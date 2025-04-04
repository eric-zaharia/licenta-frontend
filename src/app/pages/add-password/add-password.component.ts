import { Component, inject, OnInit, signal } from '@angular/core';
import { split, combine } from 'shamir-secret-sharing';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { merge, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgForOf, NgIf } from '@angular/common';

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

    firstFormGroup = this._formBuilder.group({
        passwordLabel: ['', Validators.required],
        shardsNo: ['3'],
        password: ['', Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
        storeShards: ['Yes'],
        shardsStoredInDb: ['1'],
        emailSection: this._formBuilder.group({
            emails: this._formBuilder.array([])
        }),
    });

    password: string = "parola mea secreta";
    toUint8Array = (data: string) => new TextEncoder().encode(data);

    ngOnInit() {
        this.secondFormGroup.get('shardsStoredInDb')?.valueChanges.subscribe(value => {
            const shardsCount = parseInt(value ?? '0', 10);
            this.updateEmails(shardsCount);
        });

        // Optionally, update email list when the user toggles the storeShards option.
        this.secondFormGroup.get('storeShards')?.valueChanges.subscribe(value => {
            if (value === 'No') {
                // When switching to 'No', initialize emails based on current shardsStoredInDb value
                const shardsCount = parseInt(this.secondFormGroup.get('shardsStoredInDb')?.value ?? '0', 10);
                this.updateEmails(shardsCount);
            } else {
                // Clear the email list if storing shards is not required
                this.clearEmails();
            }
        });

        // Initialize email fields if storeShards is initially 'No'
        if (this.secondFormGroup.get('storeShards')?.value === 'No') {
            const shardsCount = parseInt(this.secondFormGroup.get('shardsStoredInDb')?.value ?? '0', 10);
            this.updateEmails(shardsCount);
        }
    }

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
    }

    async testShamir() {
        console.log(this.password);
        const secret = this.toUint8Array(this.password);
        const [share1, share2, share3] = await split(secret, 3, 2);
        console.log("Shares: ", share1, " ", share2, " ", share3);
        const reconstructed = await combine([share2, share1]);
        let reconstructedPassword = new TextDecoder().decode(reconstructed);
        console.log("Reconstructed: ", reconstructedPassword);
    }


    protected readonly of = of;
}
