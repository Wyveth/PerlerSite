import { AuthService } from 'src/app/api/services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { getAuth } from '@angular/fire/auth';
import { severity } from 'src/app/shared/enum/severity';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    DividerModule
  ]
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {
  passwordForm!: UntypedFormGroup;
  id!: string;
  toasts: any[] = [];

  constructor(
    resources: AppResource,
    private messageService: MessageService,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    super(resources);
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.formBuilder.group(
      {
        oldPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
          ]
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
    return this.passwordForm.controls;
  }

  async onSubmitForm() {
    const user = getAuth().currentUser;
    if (!user) {
      this.messageService.add({
        severity: severity.warn,
        summary: this.resource.change_password.no_connected,
        detail: this.resource.change_password.reconnect_b
      });
      return;
    }

    try {
      await this.authService.updatePasswordUser(
        user,
        this.f.oldPassword.value,
        this.f.password.value
      );
      this.messageService.add({
        severity: severity.success,
        summary: this.resource.generic.success,
        detail: this.resource.change_password.success
      });
    } catch (err: any) {
      this.messageService.add({
        severity: severity.error,
        summary: this.resource.generic.error,
        detail: this.resource.change_password.error
      });
    }
  }

  shouldShowOldPasswordErrors() {
    const password = this.passwordForm.controls.oldPassword;
    return (
      password.touched &&
      (password.hasError('required') ||
        password.hasError('minlength') ||
        password.hasError('pattern'))
    );
  }

  shouldShowPasswordErrors() {
    const password = this.passwordForm.controls.password;
    return (
      password.touched &&
      (password.hasError('required') ||
        password.hasError('minlength') ||
        password.hasError('pattern'))
    );
  }

  shouldShowConfirmPasswordErrors() {
    const confirmPassword = this.passwordForm.controls.confirmPassword;
    return (
      confirmPassword.touched &&
      (confirmPassword.hasError('required') || confirmPassword.hasError('mustMatch'))
    );
  }
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
