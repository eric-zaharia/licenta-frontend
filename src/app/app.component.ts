import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BalanceComponent} from './components/balance/balance.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BalanceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  pkey: String = 'cheie';
}
