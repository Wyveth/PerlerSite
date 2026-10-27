import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/Shared/Component/breadcrumbs/breadcrumbs.component';
import { FileUpload } from 'src/app/api/models/class/file-upload';
import { Tag } from 'src/app/api/models/class/tag';
import { TagService } from 'src/app/api/services/tag.service';
import { FileUploadService } from 'src/app/api/services/upload-file.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { BaseComponent } from 'src/app/Shared/Component/base/base.component';
import { AppResource } from 'src/app/Shared/Models/app.resource';
import { severity } from 'src/app/Shared/enum/severity';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    FileUploadModule
  ]
})
export class TagFormComponent extends BaseComponent implements OnInit {
  tagForm!: UntypedFormGroup;

  id!: string;
  isAddMode!: boolean;
  tag: Tag = new Tag('', '');

  uploadedFiles: FileUpload[] = [];
  initialFiles: FileUpload[] = [];

  originalInitialFiles: FileUpload[] = []; // snapshot immuable de départ
  removedInitialKeys = new Set<string>(); // ce que l’utilisateur retire en édition

  constructor(
    resources: AppResource,
    private formBuilder: UntypedFormBuilder,
    private tagService: TagService,
    private filesUploadService: FileUploadService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(resources);
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.initForm();
  }

  initForm() {
    this.tagForm = this.formBuilder.group({
      code: [
        '',
        [Validators.required],
        [this.tagService.existingTagCodeValidator(!this.isAddMode)]
      ],
      libelle: ['', Validators.required]
    });

    if (!this.isAddMode) {
      this.tagService.getTag(this.id).then((tag: Tag) => {
        this.tagForm.patchValue(tag);

        if (tag.pictureUrl) {
          this.filesUploadService.getFilesUpload(tag.pictureUrl).then(files => {
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

  get f() {
    return this.tagForm.controls;
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

      // 5️⃣ Construire le Tag
      const formValue = this.tagForm.value;
      const tag = new Tag(formValue['code'], formValue['libelle']);

      // pictureUrl uniquement avec des URLs valides
      tag.pictureUrl = this.uploadedFiles
        .filter(f => f.url) // prend uniquement les fichiers uploadés
        .map(f => f.url);

      // 6️⃣ Créer ou mettre à jour le Tag
      if (this.isAddMode) {
        await this.tagService.createTag(tag);
      } else {
        await this.tagService.updateTag(this.id, tag);
      }

      console.log('✅ Tag synchronisé avec Firebase');

      this.messageService.add({
        severity: severity.success,
        summary: this.resource.generic.success,
        detail: this.isAddMode
          ? this.resource.generic.create_success_m.format(
              this.resource.tag.title.toLowerCase(),
              tag.libelle
            )
          : this.resource.generic.edit_success_m.format(
              this.resource.tag.title.toLowerCase(),
              tag.libelle
            )
      });

      this.router.navigate([this.resource.router.routes.tags]);
    } catch (error) {
      this.messageService.add({
        severity: severity.error,
        summary: this.resource.generic.error,
        detail: this.resource.error.default
      });
      console.error('❌ Erreur lors du traitement des fichiers:', error);
    }
  }

  /*Validation Erreur*/
  shouldShowCodeError() {
    const code = this.tagForm.controls.code;
    return code.touched && (code.hasError('required') || code.hasError('tagCodeExists'));
  }

  shouldShowLibelleError() {
    const libelle = this.tagForm.controls.libelle;
    return libelle.touched && libelle.hasError('required');
  }
  /* Fin Validation Error */
}
