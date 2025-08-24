import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { PerlerType } from 'src/app/api/models/class/perler-type';
import { PerlerTypeService } from 'src/app/api/services/perler-type.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  ImageOverlayComponent,
  OverlayButton
} from 'src/app/shared/component/image-overlay/image-overlay.component';
import { FormatPipe } from 'src/app/shared/pipe/format.pipe';
import { AppResource } from 'src/app/shared/models/app.resource';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { severity } from 'src/app/shared/enum/severity';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-perlertype-list',
  templateUrl: './perlertype-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    ButtonModule,
    ImageOverlayComponent,
    FormatPipe
  ]
})
export class PerlertypeListComponent extends BaseComponent {
  perlerTypesWithButtons$: Observable<{ perlerType: PerlerType; buttons: OverlayButton[] }[]>;

  constructor(
    resource: AppResource,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private perlerTypeService: PerlerTypeService,
    private router: Router
  ) {
    super(resource);

    this.perlerTypesWithButtons$ = this.perlerTypeService.perlerTypes$.pipe(
      map(perlerTypes =>
        perlerTypes.map(perlerType => ({
          perlerType,
          buttons: [
            {
              icon: 'pi pi-pencil',
              label: this.resource.button.edit,
              color: 'p-button-warn',
              command: () => this.onEdit(perlerType.key)
            },
            {
              icon: 'pi pi-trash',
              label: this.resource.button.delete,
              color: 'p-button-danger',
              command: (event?: Event) => this.onDelete(event, perlerType)
            }
          ]
        }))
      )
    );
  }

  onNew() {
    this.router.navigate(['perler-types', 'new']);
  }

  onEdit(key: string) {
    this.router.navigate(['perler-types', 'edit', key]);
  }

  onDelete(event: Event | undefined, perlerType: PerlerType) {
    event?.stopPropagation();
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: this.resource.generic.delete_confirm_m.format(
        this.resource.perler_type.title.toLowerCase(),
        perlerType.libelle
      ),
      header: this.resource.generic.attention,
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: this.resource.button.cancel,
      rejectButtonProps: {
        label: this.resource.button.cancel,
        severity: severity.secondary,
        outlined: true
      },
      acceptButtonProps: {
        label: this.resource.button.delete,
        severity: severity.error
      },

      accept: () => {
        this.perlerTypeService.removePerlerType(perlerType);
        this.messageService.add({
          severity: severity.info,
          summary: this.resource.generic.confirm,
          detail: this.resource.generic.delete_success_m.format(
            this.resource.perler_type.title.toLowerCase(),
            perlerType.libelle
          )
        });
      },
      reject: () => {
        this.messageService.add({
          severity: severity.secondary,
          summary: this.resource.generic.cancel,
          detail: this.resource.generic.delete_cancelled
        });
      }
    });
  }

  activeOverlayIndex: number | null = null;

  toggleOverlay(index: number) {
    this.activeOverlayIndex = this.activeOverlayIndex === index ? null : index;
  }
}
