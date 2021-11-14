import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from 'src/app/Shared/Models/Tag.Model';
import { TagService } from 'src/app/Shared/Services/tag.service';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss']
})
export class TagFormComponent implements OnInit {
  tagForm!: FormGroup;

  id!: string;
  isAddMode!: boolean;
  tag: Tag = new Tag('','');

  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    if (!this.isAddMode) {
      this.tagService.getTag(this.id).then((data: any) => {
        this.tagForm.patchValue(data);
      });
    }

    this.initForm();
  }

  initForm() {
    this.tagForm = this.formBuilder.group({
      code: ['', Validators.required, this.tagService.existingTagCodeValidator(this.isAddMode)],
      libelle: ['', Validators.required],
    });
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() { return this.tagForm.controls; }

  onSubmitForm() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.tagForm.invalid) {
      return;
    }

    const formValue = this.tagForm.value;
    const tag = new Tag(
      formValue['code'],
      formValue['libelle']
    );

    this.loading = true;
    if (this.isAddMode) {
      this.tagService.createTag(tag);
    } else {
      this.tagService.updateTag(this.id, tag);
    }
    this.router.navigate(['/tags']);
  }

  /*Validation Erreur*/
  shouldShowCodeRequiredError() {
    const code = this.tagForm.controls.code;
    return code.touched && code.hasError('required');
  }

  shouldShowCodeUniqueError() {
    const code = this.tagForm.controls.code;
    return code.touched && code.hasError('tagCodeExists');
  }

  shouldShowLibelleRequiredError() {
    const libelle = this.tagForm.controls.libelle;
    return libelle.touched && libelle.hasError('required');
  }
  /* Fin Validation Error */

  validTagCode: ValidatorFn = (control) => {
    let quest = false;
    /* Is not valid. */
    this.tagService.isTagCodeAvailable(control.value, this.isAddMode).then((bool: boolean) => {
      quest = bool;
    });

    if(quest){
      /* Is valid. */
      return null;
    }
    else{
      return {
        'validTagCode': {
            reason: 'Tag Code invalide',
            value: control.value
        }
      };
    }
  };
}