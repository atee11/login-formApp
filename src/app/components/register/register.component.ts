import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from 'src/app/shared/password-match.directive';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/interfaces/auth';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.pattern(/^\p{L}+(?: \p{L}+)*$/u)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  },
  {
    validators: passwordMatchValidator  
  }
  )

  lang: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private translateService: TranslateService
    ) { }

  get fullName() {
    return this.registerForm.controls['fullName'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  submitDetails() {
    const postData = { ...this.registerForm.value };
    delete postData.confirmPassword;

    // Ellenőrizd, hogy az e-mail cím már szerepel-e az adatbázisban
    this.authService.getUserByEmail(postData.email as string).subscribe(
      response => {
        if (response.length > 0) {
          // Ha igen, akkor jeleníts meg egy toast üzenetet
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Error'),
            detail: this.translateService.instant('Email already registered')
          });
        } else {
          // Ha nem, akkor folytasd a regisztrációt
          this.authService.registerUser(postData as User).subscribe(
            response => {
              console.log(response);
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Success'),
                detail: this.translateService.instant('Register successfully')
              });
              this.router.navigate(['login'])
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: this.translateService.instant('Something went wrong')
              });
            }
          )
        }
      },
      error => {
        this.messageService.add({
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
