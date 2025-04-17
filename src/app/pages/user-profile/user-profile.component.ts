import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { EmailRecipientService } from '../../services/email-recipient/email-recipient.service';
import { MatList, MatListItem } from '@angular/material/list';
import { AuthService } from '../../services/auth/auth.service';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-user-profile',
    imports: [
        FormsModule,
        MatCard,
        MatCardContent,
        MatCardFooter,
        MatCardHeader,
        MatCardTitle,
        MatList,
        MatListItem,
        MatIcon,
        MatIconButton,
        MatButton,
        ReactiveFormsModule,
        MatInput,
        MatLabel,
        MatFormField,
    ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
    emailRecipients: any = [];
    userProfile: any = {};

    showEmailForm: boolean = false;
    currentEmailToAdd = new FormControl('', [Validators.required, Validators.email]);
    addAddress: boolean = true;

    constructor(
        private emailRecipientService: EmailRecipientService,
        private authService: AuthService,
    ) {

    }

    ngOnInit() {
        this.emailRecipientService.getEmailRecipients().subscribe({
            next: (data: any) => {
                this.emailRecipients = data;
            },
            error: (err: any) => {
                console.log(err);
            }
        })

        this.userProfile = this.authService.getUserDetails();
    }

    deleteEmailRecipient(index: number) {
        this.emailRecipientService.deleteEmailRecipient(this.emailRecipients[index]).subscribe({
            next: (data: any) => {
                this.emailRecipientService.getEmailRecipients().subscribe({
                    next: (data: any) => {
                        this.emailRecipients = data;
                    },
                    error: (err: any) => {
                        console.log(err);
                    }
                })
            },
            error: (err: any) => {
                console.log(err);
            }
        })
    }

    enableEmailForm() {
        this.showEmailForm = true;
        this.addAddress = false;
    }

    cancelAddEmail() {
        this.addAddress = true;
        this.showEmailForm = false;
        this.currentEmailToAdd.setValue('');
    }

    submitNewEmail() {
        this.emailRecipientService.addEmailRecipient({email: this.currentEmailToAdd.value}).subscribe({
            next: (data: any) => {
                this.addAddress = true;
                this.showEmailForm = false;
                this.currentEmailToAdd.setValue('');
                this.emailRecipientService.getEmailRecipients().subscribe({
                    next: (data: any) => {
                        this.emailRecipients = data;
                    },
                    error: (err: any) => {
                        console.log(err);
                    }
                })
            },
            error: (err: any) => {
                console.log(err);
            }
        })
    }
}
