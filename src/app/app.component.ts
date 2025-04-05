import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BalanceComponent} from './components/balance/balance.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
    imports: [SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  pkey: String = 'cheie';
}
