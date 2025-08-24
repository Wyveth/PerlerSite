import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { FileUpload } from 'src/app/api/models/class/file-upload';
import { Tag } from 'src/app/api/models/class/tag';
import { TagService } from 'src/app/api/services/tag.service';
import { FileUploadService } from 'src/app/api/services/upload-file.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';

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
export class TagFormComponent implements OnInit {
  tagForm!: UntypedFormGroup;
  fileIsUploading = false;
  fileUploaded = false;
  fileUrl!: string;
  fileObject!: FileUpload;

  id!: string;
  isAddMode!: boolean;
  tag: Tag = new Tag('', '');

  constructor(
    private formBuilder: UntypedFormBuilder,
    private tagService: TagService,
    private filesUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.initForm();
  }

  initForm() {
    this.tagForm = this.formBuilder.group({
      code: ['', Validators.required, this.tagService.existingTagCodeValidator(this.isAddMode)],
      libelle: ['', Validators.required]
    });

    if (!this.isAddMode) {
      this.tagService.getTag(this.id).then((tag: Tag) => {
        this.tagForm.patchValue(tag);

        this.fileUrl = tag.pictureUrl || '';
      });
    }
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() {
    return this.tagForm.controls;
  }

  onSubmitForm() {
    const formValue = this.tagForm.value;
    const tag = new Tag(formValue['code'], formValue['libelle']);

    if (this.fileUrl && this.fileUrl !== '') {
      tag.pictureUrl = this.fileUrl;
      tag.file = this.fileObject;
      this.filesUploadService.saveFileData(tag.file);
    }

    if (this.isAddMode) {
      this.tagService.createTag(tag);
    } else {
      this.tagService.updateTag(this.id, tag);
    }
    this.router.navigate(['tags']);
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
