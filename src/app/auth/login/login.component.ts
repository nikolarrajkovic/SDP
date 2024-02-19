import {ChangeDetectorRef, Component} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NbLoginComponent } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthModel } from '../auth.model';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    CommonModule,
    RouterLink,
  ],
})
export class LoginComponent extends NbLoginComponent {
  user = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
  });

  constructor(private authService: AuthService,
              cd: ChangeDetectorRef,
              private routerNav: Router) {
    super(authService, {}, cd, null);
  }

  login(): void {
    const loginDTO: AuthModel = { email: this.user.controls.email.value, password: this.user.controls.password.value };
    this.authService.login(loginDTO).subscribe((res) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('refreshToken', res.refreshToken);
      this.routerNav.navigate(['/pages/tables/campaigns']);
    });
  }
}
