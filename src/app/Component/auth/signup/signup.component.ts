import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Shared/Models/User.Model';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { UserService } from 'src/app/Shared/Services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      pseudo: ['', Validators.required, this.userService.existingPseudoValidator()],
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
    const pseudo = formValue['pseudo'];
    const email = formValue['email'];
    const password = formValue['password'];

    const user = new User(
      formValue['pseudo'],
      formValue['email'],
    );

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
  shouldShowPseudoError() {
    const pseudo = this.signupForm.controls.pseudo;
    return pseudo.touched && (pseudo.hasError('required') || pseudo.hasError('pseudoExists'));
  }

  shouldShowEmailError() {
    const email = this.signupForm.controls.email;
    return email.touched && (email.hasError('required') || email.hasError('emailExists'));
  }
  /* Fin Validation Error */
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
