import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PerlerType } from 'src/app/Shared/Models/PerlerType.Model';
import { PerlerTypeService } from 'src/app/Shared/Services/PerlerType.service';

@Component({
  selector: 'app-perlertype-form',
  templateUrl: './perlertype-form.component.html',
  styleUrls: ['./perlertype-form.component.scss']
})
export class PerlertypeFormComponent implements OnInit {
  perlerTypeForm!: FormGroup;

  id!: string;
  isAddMode!: boolean;
  perlerType: PerlerType = new PerlerType('', '', '');

  constructor(private formBuilder: FormBuilder,
    private perlerTypeService: PerlerTypeService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.initForm();
  }

  initForm() {
    this.perlerTypeForm = this.formBuilder.group({
      code: ['', Validators.required, this.perlerTypeService.existingPerlerTypeRefValidator(this.isAddMode)],
      libelle: ['', Validators.required],
    });

    if (!this.isAddMode) {
      this.perlerTypeService.getPerlerType(this.id).then((data: any) => {
        this.perlerTypeForm.patchValue(data);
      });
    }
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() { return this.perlerTypeForm.controls; }

  onSubmitForm() {
    const formValue = this.perlerTypeForm.value;
    const perlerType = new PerlerType(
      formValue['reference'],
      formValue['libelle'],
      formValue['color']
    );

    if (this.isAddMode) {
      this.perlerTypeService.createPerlerType(perlerType);
    } else {
      this.perlerTypeService.updatePerlerType(this.id, perlerType);
    }
    this.router.navigate(['/perlerTypes']);
  }

  /*Validation Erreur*/
  shouldShowCodeError() {
    const reference = this.perlerTypeForm.controls.code;
    return reference.touched && (reference.hasError('required') || reference.hasError('perlerTypeRefExists'));
  }

  shouldShowLibelleError() {
    const libelle = this.perlerTypeForm.controls.libelle;
    return libelle.touched && libelle.hasError('required');
  }

  shouldShowColorError() {
    const color = this.perlerTypeForm.controls.libelle;
    return color.touched && color.hasError('required');
  }
  /* Fin Validation Error */
}
