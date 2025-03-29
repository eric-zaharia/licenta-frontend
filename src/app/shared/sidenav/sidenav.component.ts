import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth/auth.service';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidenav',
    imports: [
        MatToolbarModule,
        MatSidenavModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatNavList,
        MatListItem,
        RouterLink,
        RouterOutlet,
        AsyncPipe,
    ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
    authService: AuthService = inject(AuthService);
    authenticated = false;

    ngOnInit() {
        this.authService.authStatus$.subscribe(authStatus => {
            this.authenticated = authStatus;
        })
    }

    logout(): void {
        this.authenticated = false;
        this.authService.logout();
    }

}
