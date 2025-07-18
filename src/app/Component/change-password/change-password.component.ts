import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { getAuth, User } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { ToastService } from 'src/app/Shared/Services/Toast.service';
import { UserService } from 'src/app/Shared/Services/user.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: UntypedFormGroup;
  id!: string;
  toasts: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService) { }

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
        this.toastService.show('Le mot de passe a bien été mis à jour.', {
          classname: 'bg-success text-light',
          delay: 3000 ,
          autohide: true
        });
      },
      (error: string) => {
        //TODO Toast + error;
        this.toastService.show('La mise à jour du mot de passe a échoué. Veuillez réessayer ultérieurement.', {
          classname: 'bg-danger text-light',
          delay: 3000 ,
          autohide: true
        });
      });
  }

  showCustomToastSuccess(customTpl: string | TemplateRef<any>) {
    this.toastService.show(customTpl, {
      classname: 'bg-danger text-light',
      delay: 3000,
      autohide: true
    });
  }

  showCustomToastError(customTpl: string | TemplateRef<any>) {
    this.toastService.show(customTpl, {
      classname: 'bg-danger text-light',
      delay: 3000,
      autohide: true
    });
  }

  shouldShowPasswordError() {
    const password = this.passwordForm.controls.password;
    return password.touched && password.hasError('required');
  }

  shouldShowConfirmPasswordError() {
    const confirmPassword = this.passwordForm.controls.confirmPassword;
    return confirmPassword.touched && (confirmPassword.hasError('required') || confirmPassword.hasError('mustMatch'));
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
  }
}
