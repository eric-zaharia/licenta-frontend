import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BalanceComponent} from './components/balance/balance.component';
import {DrawerComponent} from './shared/drawer/drawer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BalanceComponent, DrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  pkey: String = 'cheie';
}
