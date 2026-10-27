import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/Shared/Component/breadcrumbs/breadcrumbs.component';
import { User } from 'src/app/api/models/class/user';
import { AuthService } from 'src/app/api/services/auth.service';
import { UserService } from 'src/app/api/services/user.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { BaseComponent } from 'src/app/Shared/Component/base/base.component';
import { AppResource } from 'src/app/Shared/Models/app.resource';
import { MessageService } from 'primeng/api';
import { severity } from 'src/app/Shared/enum/severity';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    DividerModule
  ]
})
export class SignupComponent extends BaseComponent implements OnInit {
  signupForm!: UntypedFormGroup;
  errorMessage!: string;

  constructor(
    resources: AppResource,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {
    super(resources);
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group(
      {
        displayName: [
          '',
          Validators.required,
          this.userService.existingFieldValidator('displayName')
        ],
        email: [
          '',
          [Validators.required, Validators.email],
          this.userService.existingFieldValidator('email')
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    const formValue = this.signupForm.value;
    const password = formValue['password'];

    const user = new User(formValue['displayName'], formValue['email']);

    user.admin = false;
    user.disabled = false;

    this.authService
      .register(user, password)
      .then(() => {
        this.router.navigate([this.resource.router.routes.home]);
        this.messageService.add({
          severity: severity.success,
          summary: this.resource.signup.title,
          detail: this.resource.signin.signin_success_detail
        });
      })
      .catch((error: any) => {
        this.errorMessage =
          error?.code === 'auth/email-already-in-use'
            ? this.resource.error.email_already_exists
            : this.resource.signup.signup_error;
        this.messageService.add({
          severity: severity.error,
          summary: this.resource.signup.title,
          detail: this.errorMessage
        });
      });
  }

  /*Validation Erreur*/
  shouldShowDisplayNameError() {
    const displayName = this.signupForm.controls.displayName;
    return (
      displayName.touched &&
      (displayName.hasError('required') || displayName.hasError('displayNameExists'))
    );
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
    return (
      confirmPassword.touched &&
      (confirmPassword.hasError('required') || confirmPassword.hasError('mustMatch'))
    );
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
  };
}
