import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

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
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
    private _formBuilder = inject(FormBuilder);

    options = this._formBuilder.group({
        bottom: 0,
        fixed: true,
        top: 0,
    });

}
