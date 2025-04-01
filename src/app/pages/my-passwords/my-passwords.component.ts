import { Component, inject, OnInit, signal } from '@angular/core';
import { PasswordService } from '../../services/password/password.service';
import { MatList, MatListItem } from '@angular/material/list';
import {
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';

@Component({
    selector: 'app-my-passwords',
    imports: [
        MatList,
        MatListItem,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatExpansionPanelDescription
    ],
    templateUrl: './my-passwords.component.html',
    styleUrl: './my-passwords.component.css'
})
export class MyPasswordsComponent implements OnInit {
    passwordService: PasswordService = inject(PasswordService);
    passwords: any[] = [];
    panelOpenState: any[] = [];

    ngOnInit() {
        this.passwordService.getAllUserPasswords().subscribe((passwords: any) => {
            this.passwords = passwords;
            for (let i = 0; i < passwords.length; i++) {
                this.panelOpenState.push(signal(false));
            }
            console.log(passwords);
        })
    }
}
