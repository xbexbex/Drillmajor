import { Output, Input, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

const nameRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+$/;
const pwRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+$/;

// causes the input to flicker due to being async, should be fixed in Angular 5
/* class UsernameValidator {
  static checkUsername(userService: UserService) {

    return async (control: FormControl) => {
      const username = control.value;
      try {
        const notTaken = await userService.checkAvailable(username);
        console.log(notTaken);
        if (notTaken) {
          control.setErrors(null);
        } else {
          return control.setErrors({ alreadyTaken: true });
        }
      } catch (err) {
        console.log(err);
        return control.setErrors(null);
      }
    };
  }
} */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  logInForm: FormGroup;
  signUpForm: FormGroup;
  selectedIndex = 0;
  hide = true;
  hide2 = true;
  hide3 = true;
  disabled = false;
  error = '';

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.logInForm = this.fb.group({
      username: ['', [
        Validators.required, Validators.minLength(3), Validators.maxLength(256), Validators.nullValidator, Validators.pattern(nameRegexp)]],
      password: ['', [
        Validators.required, Validators.minLength(5), Validators.maxLength(256), Validators.nullValidator, Validators.pattern(nameRegexp)]],
    });
    this.signUpForm = this.fb.group({
      newUsername: ['', [
        Validators.required, Validators.minLength(3), Validators.maxLength(256), Validators.nullValidator, Validators.pattern(nameRegexp)
        /* , UsernameValidator.checkUsername(this.userService) */  //causes the input to flicker, should be fixed in Angular 5
      ]],
      newPassword: ['', [
        Validators.required, Validators.minLength(5), Validators.maxLength(256), Validators.nullValidator, Validators.pattern(pwRegexp)]],
      confirmPassword: ['',
        Validators.required]
    }, { validator: this.checkPasswords('newPassword', 'confirmPassword') });
  }

  checkPasswords(password: string, confirmPassword: string) {
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

  @Output() selectedIndexChange(val: number) {
    this.selectedIndex = val;
  }

  getUsernameErrorMessage() {
    const input = this.logInForm.get('username');
    function err(validator: string) {
      return input.hasError(validator);
    }
    return err('required') ? 'Required' :
      'Invalid username';
  }

  getPasswordErrorMessage() {
    const input = this.logInForm.get('password');
    function err(validator: string) {
      return input.hasError(validator);
    }
    return err('required') ? 'Required' :
      'Invalid password';
  }

  getNewUsernameErrorMessage() {
    const input = this.signUpForm.get('newUsername');
    function err(validator: string) {
      return input.hasError(validator);
    }
    return err('required') ? 'Required' :
      err('minlength') ? 'Must be at least 3 characters long' :
        err('maxlength') ? 'Cannot be longer than 256 characters' :
          err('alreadyTaken') ? 'Username already taken' :
            'Contains invalid characters';
  }

  getNewPasswordErrorMessage() {
    const input = this.signUpForm.get('newPassword');
    function err(validator: string) {
      return input.hasError(validator);
    }
    return err('required') ? 'Required' :
      err('pattern') ? 'Contains invalid characters' :
        err('minlength') ? 'Must be at least 5 characters long' :
          err('maxlength') ? 'Cannot be longer than 256 characters' :
            'Invalid password';
  }

  getConfirmPasswordErrorMessage() {
    return this.signUpForm.get('confirmPassword').hasError('required') ? 'Required' :
      this.signUpForm.get('confirmPassword').hasError('notEquivalent') ? 'Does not match' :
        '';
  }

  async continueClick() {
    if (this.selectedIndex === 0) {
      await this.logIn();
    } else {
      await this.signUp();
    }
  }

  async logIn() {
    if (!this.logInForm.invalid) {
      this.disabled = true;
      try {
        const status: number = await this.userService.login(
          this.logInForm.get('username').value,
          this.logInForm.get('password').value
        );
        if (status === 200) {
          this.router.navigate(['/']);
          return;
        } else if (status === 404) {
          this.disabled = false;
          this.error = 'Wrong username or password';
          return;
        }
      } catch (err) {
        console.log(err);
      }
      this.error = 'Something went wrong, try again later';
      this.disabled = false;
    }
    this.error = 'Invalid fields';
  }

  async signUp() {
    if (!this.signUpForm.invalid) {
      this.disabled = true;
      try {
        const status: number = await this.userService.register(
          this.signUpForm.get('newUsername').value,
          this.signUpForm.get('newPassword').value
        );
        if (status === 200) {
          this.router.navigate(['/']);
          return;
        } else if (status === 409) {
          this.disabled = false;
          this.error = 'Username already taken';
          return;
        }
      } catch (err) {
        console.log(err);
      }
      this.disabled = false;
      this.error = 'Something went wrong, try again later';
    }
    this.error = 'Invalid fields';
  }
}
