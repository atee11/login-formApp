import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassWord = control.get('confirmPassword');

    if (!password || !confirmPassWord) {
        return null;
    }

    return password.value === confirmPassWord.value ? null : {passwordMismatch : true}
}