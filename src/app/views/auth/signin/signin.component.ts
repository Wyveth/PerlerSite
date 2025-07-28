import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api/services/auth.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbsComponent]
})
export class SigninComponent implements OnInit {
  signinForm!: UntypedFormGroup;
  errorMessage!: string;

  constructor(private formBuilder: UntypedFormBuilder,
              private authService: AuthService,
              private router: Router) { }

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

    this.authService.signInUser(email, password).then(
      () => {
        this.router.navigate(['/home']);
      },
      (error: string) => {
        if(error == 'auth/invalid-email'){
          this.errorMessage = 'L\'adresse email est erronée';
        }
        else if(error == 'auth/user-disabled'){
          this.errorMessage = 'Le compte est désactivé';
        }
        else if(error == 'auth/user-not-found'){
          this.errorMessage = 'Aucun utilisateur n\'a été retrouvé avec cette adresse email';
        }
        else if(error == 'auth/wrong-password'){
          this.errorMessage = 'Le mot de passe est erroné';
        }
      }
    );
  }
}
