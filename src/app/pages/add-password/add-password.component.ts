import { Component, OnInit } from '@angular/core';
import {split, combine} from 'shamir-secret-sharing';

@Component({
  selector: 'app-add-password',
  imports: [],
  templateUrl: './add-password.component.html',
  styleUrl: './add-password.component.css'
})
export class AddPasswordComponent implements OnInit {
    password: string = "parola mea secreta";
    toUint8Array = (data: string) => new TextEncoder().encode(data);

    ngOnInit() {
        this.testShamir().then(r => {});
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
}
