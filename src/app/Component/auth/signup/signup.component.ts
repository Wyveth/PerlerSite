import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/Shared/Component/breadcrumbs/breadcrumbs.component';
import { User } from 'src/app/Shared/Models/User.Model';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { UserService } from 'src/app/Shared/Services/user.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbsComponent]
})
export class SignupComponent implements OnInit {
  signupForm!: UntypedFormGroup;
  errorMessage!: string;

  constructor(private formBuilder: UntypedFormBuilder,
              private authService: AuthService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      displayName: ['', Validators.required, this.userService.existingDisplayNameValidator()],
      email: ['', [Validators.required, Validators.email], this.userService.existingEmailValidator()],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      confirmPassword: ['', Validators.required]
    },
    {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    const formValue = this.signupForm.value;
    const email = formValue['email'];
    const password = formValue['password'];

    const user = new User(
      formValue['displayName'],
      formValue['email'],
    );

    user.admin = false;
    user.disabled = false;

    this.authService.createNewUser(email, password).then(
      () => {
        this.userService.createUser(user);
        this.router.navigate(['/product-list']);
      },
      (error: string) => {
        this.errorMessage = error;
      }
    );
  }

  /*Validation Erreur*/
  shouldShowDisplayNameError() {
    const displayName = this.signupForm.controls.displayName;
    return displayName.touched && (displayName.hasError('required') || displayName.hasError('displayNameExists'));
  }

  shouldShowEmailError() {
    const email = this.signupForm.controls.email;
    return email.touched && (email.hasError('required') || email.hasError('emailExists'));
  }

  shouldShowPasswordError() {
    const password = this.signupForm.controls.password;
    return password.touched && password.hasError('required');
  }

  shouldShowConfirmPasswordError() {
    const confirmPassword = this.signupForm.controls.confirmPassword;
    return confirmPassword.touched && (confirmPassword.hasError('required') || confirmPassword.hasError('mustMatch'));
  }
  /* Fin Validation Error */
}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: UntypedFormGroup) => {
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
