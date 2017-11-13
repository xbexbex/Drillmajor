import { Output, Input, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, FormControl, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/timer';
import { checkUsername, checkPasswords } from '../../misc/login.validators';

const nameRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+$/;
const pwRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  logInForm: FormGroup;
  signUpForm: FormGroup;
  firstTabActive = true;
  hide = true;
  hide2 = true;
  hide3 = true;
  disabled = false;
  error = '';
  progressMode = 'indeterminate';
  progressDisplay = 'hidden';

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
        Validators.required, Validators.minLength(3), Validators.maxLength(256), Validators.nullValidator, Validators.pattern(nameRegexp)],
        [checkUsername(this.userService)]
      ],
      newPassword: ['', [
        Validators.required, Validators.minLength(5), Validators.maxLength(256), Validators.nullValidator, Validators.pattern(pwRegexp)]],
      confirmPassword: ['',
        Validators.required]
    }, { validator: checkPasswords('newPassword', 'confirmPassword') });
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

  onTabChange($event: any) {
    this.error = '';
    this.firstTabActive = !this.firstTabActive;
  }

  async continueClick() {
    this.progressDisplay = 'visible';
    if (this.firstTabActive) {
      await this.logIn();
    } else {
      await this.signUp();
    }
    this.progressDisplay = 'hidden';
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
        } else if (status === 201) {
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
        } else if (status === 201) {
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
