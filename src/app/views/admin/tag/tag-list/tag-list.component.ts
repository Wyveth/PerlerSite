import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { TagService } from 'src/app/api/services/tag.service';
import { Tag } from 'src/app/api/models/class/tag';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  ImageOverlayComponent,
  OverlayButton
} from 'src/app/shared/component/image-overlay/image-overlay.component';
import { FormatPipe } from 'src/app/shared/pipe/format.pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { severity } from 'src/app/shared/enum/severity';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
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
export class TagListComponent extends BaseComponent {
  tagsWithButtons$: Observable<{ tag: Tag; buttons: OverlayButton[] }[]>;

  constructor(
    resource: AppResource,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private tagService: TagService,
    private router: Router
  ) {
    super(resource);

    this.tagsWithButtons$ = this.tagService.tags$.pipe(
      map(tags =>
        tags.map(tag => ({
          tag,
          buttons: [
            {
              icon: 'pi pi-pencil',
              label: this.resource.button.edit,
              color: 'p-button-warn',
              command: () => this.onEdit(tag.key)
            },
            {
              icon: 'pi pi-trash',
              label: this.resource.button.delete,
              color: 'p-button-danger',
              command: (event?: Event) => this.onDelete(event, tag)
            }
          ]
        }))
      )
    );
  }

  onNew() {
    this.router.navigate([this.resource.router.routes.tags, this.resource.router.new]);
  }

  onEdit(key: string) {
    this.router.navigate([this.resource.router.routes.tags, this.resource.router.edit, key]);
  }

  onDelete(event: Event | undefined, tag: Tag) {
    event?.stopPropagation();
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: this.resource.generic.delete_confirm_m.format(
        this.resource.tag.title.toLowerCase(),
        tag.libelle
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
        this.tagService.removeTag(tag);
        this.messageService.add({
          severity: severity.info,
          summary: this.resource.generic.confirm,
          detail: this.resource.generic.delete_success_m.format(
            this.resource.tag.title.toLowerCase(),
            tag.libelle
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
