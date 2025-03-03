import {Component, ViewChild} from '@angular/core';
import {Drawer} from 'primeng/drawer';
import {Avatar} from 'primeng/avatar';
import {Ripple} from 'primeng/ripple';
import {StyleClass} from 'primeng/styleclass';
import {DrawerModule} from 'primeng/drawer';
import {Button, ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-drawer',
  imports: [
    Drawer,
    DrawerModule,
    Avatar,
    ButtonDirective,
    Button
  ],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css'
})
export class DrawerComponent {

  visible: boolean = false;
}
