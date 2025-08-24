import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload } from 'src/app/api/models/class/file-upload';
import { User } from 'src/app/api/models/class/user';
import { FileUploadService } from 'src/app/api/services/upload-file.service';
import { UserService } from 'src/app/api/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class UserFormComponent implements OnInit {
  userForm!: UntypedFormGroup;
  pictureUrl!: string;
  id!: string;
  fileIsUploading = false;
  fileUploaded = false;
  fileUrl!: string;
  fileObject!: FileUpload;

  @Input() option: string = 'Admin';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private filesUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      surname: ['', Validators.required],
      name: ['', Validators.required],
      adress: ['', Validators.required],
      zipcode: ['', Validators.required],
      city: ['', Validators.required]
    });

    this.userService.getUser(this.id).then((data: any) => {
      this.fileUrl = data.pictureUrl;
      this.userForm.patchValue(data);
    });
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() {
    return this.userForm.controls;
  }

  onSubmitForm() {
    const formValue = this.userForm.value;
    const user = new User(formValue['displayName'], formValue['email']);

    user.surname = formValue['surname'];
    user.name = formValue['name'];
    user.adress = formValue['adress'];
    user.zipcode = formValue['zipcode'];
    user.city = formValue['city'];

    if (this.fileUrl && this.fileUrl !== '') {
      user.pictureUrl = this.fileUrl;
      user.file = this.fileObject;
      if (user.file != undefined) this.filesUploadService.saveFileData(user.file);
    }

    this.userService.updateUser(this.id, user);

    if (this.option == 'Profil') {
      this.router.navigate(['profil']);
    } else {
      this.router.navigate(['users']);
    }
  }

  onUploadFile(file: File) {
    this.fileObject = new FileUpload(file);

    this.fileIsUploading = true;
    this.filesUploadService.pushFileToStorage(this.fileObject).then((url: any) => {
      this.fileUrl = url;
      this.fileIsUploading = false;
      this.fileUploaded = true;
    });
  }

  detectFiles(event: any) {
    this.onUploadFile(event.target.files[0]);
  }

  /* Validation Erreur */
  shouldShowSurnameError() {
    const surname = this.userForm.controls.surname;
    return surname.touched && surname.hasError('required');
  }

  shouldShowNameError() {
    const name = this.userForm.controls.name;
    return name.touched && name.hasError('required');
  }

  shouldShowAdresseError() {
    const adress = this.userForm.controls.adress;
    return adress.touched && adress.hasError('required');
  }

  shouldShowZipCodeError() {
    const zipCode = this.userForm.controls.zipcode;
    return zipCode.touched && zipCode.hasError('required');
  }

  shouldShowCityError() {
    const city = this.userForm.controls.city;
    return city.touched && city.hasError('required');
  }
  /* Fin Validation Erreur */
}
