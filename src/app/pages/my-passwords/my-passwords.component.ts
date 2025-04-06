import { Component, inject, OnInit, signal } from '@angular/core';
import { PasswordService } from '../../services/password/password.service';
import { MatList, MatListItem } from '@angular/material/list';
import {
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatButton } from "@angular/material/button";
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-my-passwords',
    imports: [
        MatList,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatExpansionPanelDescription,
        MatButton,
        MatLabel,
        MatFormField,
        MatInput,
        FormsModule
    ],
    templateUrl: './my-passwords.component.html',
    styleUrl: './my-passwords.component.css'
})
export class MyPasswordsComponent implements OnInit {
    passwordService: PasswordService = inject(PasswordService);
    passwords: any[] = [];
    panelOpenState: any[] = [];

    shards: any[] = [];
    selfCustodyShards: any[] = [];
    requiredForDecryption: any[] = [];
    decryptedPassword: string[] = [];

    currentSelfCustodyShard: any[] = [];

    ngOnInit() {
        this.passwordService.getAllUserPasswords().subscribe((passwords: any) => {
            this.passwords = passwords;
            for (let i = 0; i < passwords.length; i++) {
                this.panelOpenState.push(signal(false));
                this.shards.push([]);
                this.selfCustodyShards.push(0);
                this.currentSelfCustodyShard.push("");
                this.requiredForDecryption.push(0);
                this.decryptedPassword.push("");
            }
        })
    }

    getAvailableShards(passwordId: any) {
        let index = this.passwords.findIndex(password => password.id == passwordId);
        this.passwordService.getPassword(passwordId).subscribe((response: any) => {
            this.shards[index] = response.shards;
            this.requiredForDecryption[index] = response.required - this.shards[index].length;
            this.selfCustodyShards[index] = response.selfCustodyShardsNo;
        })
    }

    decryptPassword(passwordId: any) {
        let index = this.passwords.findIndex(password => password.id == passwordId);
        this.passwordService.reconstructPassword(this.shards[index]).then(pw => {
            this.decryptedPassword[index] = pw;
        })
    }

    addSelfCustodyShard(passwordId: any, curr: string) {
        let index = this.passwords.findIndex(password => password.id == passwordId);
        this.shards[index].push(curr);
        this.requiredForDecryption[index] -= 1;
    }
}
