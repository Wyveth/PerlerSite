import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { PerlerType } from 'src/app/api/models/class/perler-type';
import { PerlerTypeService } from 'src/app/api/services/perler-type.service';

@Component({
  selector: 'app-perlertype-list',
  templateUrl: './perlertype-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent]
})
export class PerlertypeListComponent implements OnInit {
  perlerTypes!: any[];
  perlerTypeSubscription!: Subscription;

  constructor(
    private perlerTypeService: PerlerTypeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.perlerTypeSubscription = this.perlerTypeService.perlerTypesSubject.subscribe(
      (perlerTypes: any[]) => {
        this.perlerTypes = perlerTypes;
      }
    );
    this.perlerTypeService.emitPerlerTypes();
  }

  onNewPerlerType() {
    this.router.navigate(['/perlerTypes', 'new']);
  }

  onEditPerlerType(key: string) {
    this.router.navigate(['/perlerTypes', 'edit', key]);
  }

  onDeletePerlerType(perlerType: PerlerType) {
    this.perlerTypeService.removePerlerType(perlerType);
  }

  ngOnDestroy() {
    this.perlerTypeSubscription.unsubscribe();
  }
}
