import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload } from 'src/app/Shared/Models/FileUpload.Model';
import { Tag } from 'src/app/Shared/Models/Tag.Model';
import { TagService } from 'src/app/Shared/Services/tag.service';
import { FileUploadService } from 'src/app/Shared/Services/UploadFile.service';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss']
})
export class TagFormComponent implements OnInit {
  tagForm!: FormGroup;
  fileIsUploading = false;
  fileUploaded = false;
  fileUrl!: string;
  fileObject!: FileUpload;

  id!: string;
  isAddMode!: boolean;
  tag: Tag = new Tag('', '');

  constructor(private formBuilder: FormBuilder,
    private tagService: TagService,
    private filesUploadService: FileUploadService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.initForm();
  }

  initForm() {
    this.tagForm = this.formBuilder.group({
      code: ['', Validators.required, this.tagService.existingTagCodeValidator(this.isAddMode)],
      libelle: ['', Validators.required],
    });

    if (!this.isAddMode) {
      this.tagService.getTag(this.id).then((data: any) => {
        this.tagForm.patchValue(data);
      });
    }
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() { return this.tagForm.controls; }

  onSubmitForm() {
    const formValue = this.tagForm.value;
    const tag = new Tag(
      formValue['code'],
      formValue['libelle']
    );

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
    this.router.navigate(['/tags']);
  }

  onUploadFile(file: File) {
    this.fileObject = new FileUpload(file);

    this.fileIsUploading = true;
    this.filesUploadService.pushFileToStorage(this.fileObject).then((url: any) => {
      this.fileUrl = url;
      this.fileIsUploading = false;
      this.fileUploaded = true;
    }
    );
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