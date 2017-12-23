import { FormBuilder, FormGroup, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/timer';

export function checkPasswords(password: string, confirmPassword: string) {
    return (group: FormGroup) => {
        const passwordInput = group.controls[password],
            confirmPasswordInput = group.controls[confirmPassword];
        if (passwordInput.value !== confirmPasswordInput.value) {
            return confirmPasswordInput.setErrors({ notEquivalent: true });
        } else {
            return confirmPasswordInput.setErrors(null);
        }
    };
}

export function checkUsername(userService): ValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return Observable.timer(200).switchMap(() => {
        return userService.checkAvailable(control.value)
          .map(result => (result.available ? null : { alreadyTaken: true }));
      });
    };
  }
