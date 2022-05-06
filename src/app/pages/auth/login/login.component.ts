import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export interface Login {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;

  login: Login = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService,
              private router: Router,
              private notification: NzNotificationService,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  async submitForm(value: { email: string; password: string; }): Promise<void> {
    try {
      if (this.validateForm.valid) {
        const result = await this.authService.login((value as Login));
        console.log(`login realizado ${result}`);
        this.router.navigate(['']);
      } else {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    } catch (error) {
      this.showErrorMsg(`${error}`);
    }
  }

  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message, { nzKey: type, nzDuration: 3000 });
  }

  showSuccessMsg(message: string): void {
    this.createNotification('success', 'Sucesso', message);
  }

  showErrorMsg(message: string): void {
    this.createNotification('error', 'Erro', message);
  }

  showWarningMsg(message: string): void {
    this.createNotification('warning', 'Atenção', message);
  }

  showInfoMsg(message: string): void {
    this.createNotification('info', 'Informação', message);
  }
}
