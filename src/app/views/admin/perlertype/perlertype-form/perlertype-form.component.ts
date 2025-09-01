import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { PerlerType } from 'src/app/api/models/class/perler-type';
import { PerlerTypeService } from 'src/app/api/services/perler-type.service';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { severity } from 'src/app/shared/enum/severity';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-perlertype-form',
  templateUrl: './perlertype-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    InputTextModule,
    ColorPickerModule,
    FloatLabelModule,
    ButtonModule
  ]
})
export class PerlertypeFormComponent extends BaseComponent implements OnInit {
  perlerTypeForm!: UntypedFormGroup;
  id!: string;
  isAddMode!: boolean;
  perlerType: PerlerType = new PerlerType('', '', '');

  constructor(
    resources: AppResource,
    private formBuilder: UntypedFormBuilder,
    private perlerTypeService: PerlerTypeService,
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
    this.perlerTypeForm = this.formBuilder.group({
      reference: [
        '',
        Validators.required,
        this.perlerTypeService.existingPerlerTypeRefValidator(this.isAddMode)
      ],
      libelle: ['', Validators.required],
      color: ['', Validators.required]
    });

    if (!this.isAddMode) {
      this.perlerTypeService.getPerlerType(this.id).then((data: any) => {
        this.perlerTypeForm.patchValue(data);
      });
    }
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() {
    return this.perlerTypeForm.controls;
  }

  onSubmitForm() {
    const formValue = this.perlerTypeForm.value;
    const perlerType = new PerlerType(
      formValue['reference'],
      formValue['libelle'],
      formValue['color']
    );

    try {
      if (this.isAddMode) {
        this.perlerTypeService.createPerlerType(perlerType);
      } else {
        this.perlerTypeService.updatePerlerType(this.id, perlerType);
      }

      this.messageService.add({
        severity: severity.success,
        summary: this.resource.generic.success,
        detail: this.isAddMode
          ? this.resource.generic.create_success_m.format(
              this.resource.perler_type.title.toLowerCase(),
              perlerType.reference + ' - ' + perlerType.libelle
            )
          : this.resource.generic.edit_success_m.format(
              this.resource.perler_type.title.toLowerCase(),
              perlerType.reference + ' - ' + perlerType.libelle
            )
      });

      this.router.navigate([this.resource.router.routes.perlertypes]);
    } catch (error) {
      this.messageService.add({
        severity: severity.error,
        summary: this.resource.generic.error,
        detail: this.resource.error.default
      });
      console.error('❌ Erreur lors de la création/modification du type de perle:', error);
    }
  }

  /*Validation Erreur*/
  shouldShowReferenceError() {
    const reference = this.perlerTypeForm.controls.reference;
    return (
      reference.touched &&
      (reference.hasError('required') || reference.hasError('perlerTypeRefExists'))
    );
  }

  shouldShowLibelleError() {
    const libelle = this.perlerTypeForm.controls.libelle;
    return libelle.touched && libelle.hasError('required');
  }

  shouldShowColorError() {
    const color = this.perlerTypeForm.controls.color;
    return color.touched && color.hasError('required');
  }
  /* Fin Validation Error */
}
