import { MessageService } from 'primeng/api';
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
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUpload } from 'src/app/api/models/class/file-upload';
import { User } from 'src/app/api/models/class/user';
import { FileUploadService } from 'src/app/api/services/upload-file.service';
import { UserService } from 'src/app/api/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    TextareaModule,
    FileUploadModule
  ]
})
export class UserFormComponent implements OnInit {
  userForm!: UntypedFormGroup;
  id!: string;

  uploadedFiles: FileUpload[] = [];
  initialFiles: FileUpload[] = [];

  originalInitialFiles: FileUpload[] = []; // snapshot immuable de départ
  removedInitialKeys = new Set<string>(); // ce que l’utilisateur retire en édition

  @Input() option: string = 'Admin';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private filesUploadService: FileUploadService,
    private messageService: MessageService,
    private route: ActivatedRoute
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

    this.userService.getUser(this.id).then((user: User) => {
      this.userForm.patchValue(user);

      if (user.pictureUrl) {
        this.filesUploadService.getFilesUpload(user.pictureUrl).then(files => {
          this.initialFiles = files;
          this.uploadedFiles = files.map(f => ({
            ...f,
            isNew: false
          }));
          // snapshot immuable de départ
          this.originalInitialFiles = [...this.initialFiles];
        });
      }
    });
  }

  // ✅ Sélection des fichiers depuis p-fileUpload
  onFilesSelected(event: any) {
    const files: File[] = Array.isArray(event.currentFiles) ? event.currentFiles : [];
    const newFiles = files
      .filter(f => !this.uploadedFiles.some(uf => uf.file === f))
      .map(file => {
        const fUpload = new FileUpload(file);
        fUpload.name = file.name;
        fUpload.size = file.size.toString();
        fUpload.type = file.type;
        fUpload.isNew = true;
        fUpload.url = URL.createObjectURL(file); // Aperçu local
        return fUpload;
      });

    //Si Multiple == true
    // this.uploadedFiles.push(...newFiles);
    //Sinon
    this.uploadedFiles = newFiles;

    // synchroniser avec PrimeNG
    event.currentFiles = [...files];
  }

  onDeleteFile(event: any) {
    // event.file contient le File sélectionné
    const fileToRemove = event.file || event?.rawFile;
    if (!fileToRemove) return;

    // Supprimer de uploadedFiles
    this.uploadedFiles = this.uploadedFiles.filter(f => f.file !== fileToRemove);

    // Supprimer côté PrimeNG
    if (event.currentFiles) {
      event.currentFiles = event.currentFiles.filter((f: File) => f !== fileToRemove);
    }
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() {
    return this.userForm.controls;
  }

  removeExistingFile(file: FileUpload) {
    if (file?.key) this.removedInitialKeys.add(file.key);

    // mise à jour de l’UI (listes visibles)
    this.initialFiles = this.initialFiles.filter(f => f.key !== file.key);
    this.uploadedFiles = this.uploadedFiles.filter(f => f.key !== file.key);
  }

  async onSubmitForm() {
    try {
      // 1️⃣ Clés actuelles et initiales
      const currentKeys = this.uploadedFiles
        .filter(f => !f.isNew && !!f.key)
        .map(f => f.key as string);

      // 2️⃣ diff basé sur le SNAPSHOT immuable
      const baselineKeys = this.originalInitialFiles.map(f => f.key as string);
      const deletedByDiff = baselineKeys.filter(k => !currentKeys.includes(k));

      // union: (ce que l’utilisateur a explicitement retiré) U (diff automatique)
      const deletedKeys = Array.from(
        new Set([...Array.from(this.removedInitialKeys), ...deletedByDiff])
      );

      // on prend les objets complets depuis le snapshot (il n’a pas été modifié)
      const filesToDelete = this.originalInitialFiles.filter(f =>
        deletedKeys.includes(f.key as string)
      );

      // 🔥 suppression Firestore + Storage
      await Promise.all(filesToDelete.map(f => this.filesUploadService.deleteFile(f)));

      // 3️⃣ Nouveaux fichiers à uploader
      const newFiles = this.uploadedFiles.filter(f => f.isNew && f.file instanceof File);

      // 🔥 Upload parallèle
      const uploadedFiles: FileUpload[] = await Promise.all(
        newFiles.map(f => this.filesUploadService.pushFileToStorage(f))
      );

      // 4️⃣ Mettre à jour uploadedFiles avec les infos complètes
      uploadedFiles.forEach((uploaded, i) => {
        const f = newFiles[i];
        f.key = uploaded.key;
        f.url = uploaded.url;
        f.name = uploaded.name;
        f.size = uploaded.size;
        f.type = uploaded.type;
        f.isNew = false;
      });

      const formValue = this.userForm.value as User;
      const user = new User(
        formValue['displayName'],
        formValue['email'],
        formValue['surname'],
        formValue['name'],
        formValue['adress'],
        formValue['zipcode'],
        formValue['city']
      );

      // pictureUrl uniquement avec des URLs valides
      user.pictureUrl = this.uploadedFiles
        .filter(f => f.url) // prend uniquement les fichiers uploadés
        .map(f => f.url);

      this.userService.updateUser(this.id, user).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Utilisateur mis à jour avec succès'
        });
        console.log('✅ User synchronisé avec Firebase');
      });
    } catch (error) {
      console.error('❌ Erreur lors du traitement des fichiers:', error);
    }
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
