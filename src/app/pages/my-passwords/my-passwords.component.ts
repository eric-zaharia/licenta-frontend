import { Component, inject, OnInit } from '@angular/core';
import { PasswordService } from '../../services/password/password.service';

@Component({
    selector: 'app-my-passwords',
    imports: [],
    templateUrl: './my-passwords.component.html',
    styleUrl: './my-passwords.component.css'
})
export class MyPasswordsComponent implements OnInit {
    passwordService: PasswordService = inject(PasswordService);
    passwords: Object = [];

    ngOnInit() {
        this.passwordService.getAllUserPasswords().subscribe((passwords) => {
            this.passwords = passwords;
            console.log(passwords);
        })
    }
}
