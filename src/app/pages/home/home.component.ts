import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatIcon } from "@angular/material/icon";
import { MatLine } from "@angular/material/core";
import { MatList, MatListItem, MatNavList } from "@angular/material/list";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-home',
    imports: [
        MatIcon,
        MatLine,
        MatList,
        MatListItem,
        RouterLink,
        RouterLinkActive,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardTitle
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    authService: AuthService = inject(AuthService);
    authenticated = false;

    ngOnInit() {
        this.authService.authStatus$.subscribe(authStatus => {
            this.authenticated = authStatus;
        })
    }
}
