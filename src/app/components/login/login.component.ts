import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  lang: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService,
    private translateService: TranslateService
  ) { }
  
  get email () {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  loginUser() {
    const { email, password } = this.loginForm.value;
    this.authService.getUserByEmail(email as string).subscribe(
      response => {
        if (response.length > 0 && response[0].password === password) {
          sessionStorage.setItem('email', email as string);
          this.router.navigate(['/home']);
        }
        else {
          this.msgService.add({
            severity: 'error', summary: this.translateService.instant('Error'),
            detail: this.translateService.instant('Email or password is wrong')
          });
        }
      },
      error => {
        this.msgService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('Something went wrong')
        });
      }
    )
  }

  ngOnInit(): void {
    const language = sessionStorage.getItem('language');
    if (language) {
      this.translateService.use(language);
      this.lang = language;
    }
  }

  ChangeLang(event: any) {
    const selectedLanguage = event.target.value;
    this.translateService.use(selectedLanguage);
    sessionStorage.setItem('language', selectedLanguage);
    this.lang = selectedLanguage;
  }
}
