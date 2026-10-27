import { MessageService } from 'primeng/api';
import { AppResource } from 'src/app/Shared/Models/app.resource';
import { BreadcrumbsComponent } from 'src/app/Shared/Component/breadcrumbs/breadcrumbs.component';
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
import { AuthService } from 'src/app/api/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BaseComponent } from 'src/app/Shared/Component/base/base.component';
import { severity } from 'src/app/Shared/enum/severity';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    InputTextModule,
    PasswordModule,
    FloatLabelModule
  ]
})
export class SigninComponent extends BaseComponent implements OnInit {
  signinForm!: UntypedFormGroup;
  errorMessage!: string;

  get f() {
    return this.signinForm.controls;
  }

  constructor(
    resources: AppResource,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    super(resources);
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  onSubmit() {
    const formValue = this.signinForm.value;
    const email = formValue['email'];
    const password = formValue['password'];

    this.authService.login(email, password).then(
      () => {
        this.router.navigate([this.resource.router.routes.home]);
        this.messageService.add({
          severity: severity.success,
          summary: this.resource.signin.signin_success_summary,
          detail: this.resource.signin.signin_success_detail
        });
      },
      (error: any) => {
        // Firebase renvoie un objet FirebaseError : le code est dans error.code
        switch (error?.code) {
          case 'auth/user-disabled':
            this.errorMessage = this.resource.signin.user_desactivated;
            break;
          case 'auth/user-not-found':
            this.errorMessage = this.resource.signin.user_not_found;
            break;
          case 'auth/network-request-failed':
            this.errorMessage = this.resource.error.network_error;
            break;
          case 'auth/invalid-email':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
          default:
            this.errorMessage = this.resource.signin.email_password_false;
        }

        this.messageService.add({
          severity: severity.error,
          summary: this.resource.signin.error,
          detail: this.errorMessage
        });
      }
    );
  }
}
