import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatError, MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { EmailRecipientService } from '../../services/email-recipient/email-recipient.service';
import { MatList, MatListItem } from '@angular/material/list';
import { NgForOf } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

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
    ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
    emailRecipients: any = [];
    userProfile: any = {};

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

    openDeleteModal($index: number) {

    }
}
