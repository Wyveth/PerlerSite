import { Component, OnInit } from '@angular/core';
import { EmailAuthProvider, getAuth, User } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { UserService } from 'src/app/Shared/Services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  id!: string;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      confirmPassword: ['', Validators.required]
    },
    {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

   // convenience getter for easy access to form fields
   get f() { return this.passwordForm.controls; }

   onSubmitForm() {
    const formValue = this.passwordForm.value;
    const password = formValue['password'];
    const user = getAuth().currentUser as User;
    this.authService.updatePasswordUser(user, password).then(
      () => {
        //TODO Toast
      },
      (error: string) => {
        //TODO Toast + error;
      });
  }

  shouldShowPasswordError() {
    const password = this.passwordForm.controls.password;
    return password.touched && password.hasError('required');
  }

  shouldShowConfirmPasswordError() {
    const confirmPassword = this.passwordForm.controls.confirmPassword;
    return confirmPassword.touched && confirmPassword.hasError('required');
  }
}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}
