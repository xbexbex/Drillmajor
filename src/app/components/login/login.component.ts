import { Output, Input, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

const nameRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+$/;
const pwRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+$/;

/* class UsernameValidator {
  static checkUsername(userService: UserService) {

    return async (control: FormControl) => {
      const username = control.value;
      try {
        const notTaken = await userService.checkAvailable(username);
        console.log(notTaken);
        if (notTaken !== true) {
          return control.setErrors({ alreadyTaken: true });
        } else {
          control.setErrors(null);
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
  logIn: FormGroup;
  signUp: FormGroup;
  selectedIndex = 0;
  hide = true;
  hide2 = true;
  hide3 = true;
  disabled = false;
  meme = '';

  constructor(private userService: UserService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.logIn = this.fb.group({
      username: ['', [
        Validators.required, Validators.minLength(3), Validators.maxLength(256), Validators.nullValidator, Validators.pattern(nameRegexp)]],
      password: ['', [
        Validators.required, Validators.minLength(5), Validators.maxLength(256), Validators.nullValidator, Validators.pattern(nameRegexp)]],
    });
    this.signUp = this.fb.group({
      newUsername: ['', [
        Validators.required, Validators.minLength(3), Validators.maxLength(256), Validators.nullValidator, Validators.pattern(nameRegexp)
        /* , UsernameValidator.checkUsername(this.userService) */]], //causes the input to flicker
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
    const input = this.logIn.get('username');
    function err(validator: string) {
      return input.hasError(validator);
    }
    return err('required') ? 'Required' :
      'Invalid username';
  }

  getPasswordErrorMessage() {
    const input = this.logIn.get('password');
    function err(validator: string) {
      return input.hasError(validator);
    }
    return err('required') ? 'Required' :
      'Invalid password';
  }

  getNewUsernameErrorMessage() {
    const input = this.signUp.get('newUsername');
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
    const input = this.signUp.get('newPassword');
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
    return this.signUp.get('confirmPassword').hasError('required') ? 'Required' :
      this.signUp.get('confirmPassword').hasError('notEquivalent') ? 'Does not match' :
        '';
  }

  async continueClick() {
    if (this.selectedIndex === 0) {
      if (!this.logIn.invalid) {
        this.disabled = true;
        try {
          const meme = await this.userService.login(
            this.logIn.get('username').value,
            this.logIn.get('password').value
          );
        } catch (err) {
          console.log(err);
          this.disabled = false;
        }
        this.disabled = false;
      }
    } else if (!this.signUp.invalid) {
      this.disabled = true;
      try {
        const meme = await this.userService.register(
          this.signUp.get('newUsername').value,
          this.signUp.get('newPassword').value
        );
      } catch (err) {
        console.log(err);
        this.disabled = false;
      }
      this.disabled = false;
    }
  }
}
