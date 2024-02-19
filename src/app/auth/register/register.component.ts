import {ChangeDetectorRef, Component} from '@angular/core';
import { NbRegisterComponent } from '@nebular/auth';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';
import { RouterLink } from '@angular/router';
import {AuthService} from '../auth.service';
import {AuthModel} from '../auth.model';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  standalone: true,
  styleUrls: ['./register.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NbButtonModule,
    NbInputModule,
    NbCheckboxModule,
    RouterLink,
  ],
})
export class RegisterComponent extends NbRegisterComponent {
  user = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    repeat: new FormControl<string>('', Validators.required),
    // terms: new FormControl<boolean>(false, Validators.required),
  });
  constructor(private authService: AuthService,
              cd: ChangeDetectorRef) {
    super(authService, {}, cd, null);
  }
  register(): void {
    if (this.user.controls.password.value !== this.user.controls.repeat.value) {
      return;
    }
    const registerDTO: AuthModel = {
      email: this.user.controls.email.value,
      password: this.user.controls.password.value,
    };
    this.authService.registerUser(registerDTO).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
      },
    );
  }
}
