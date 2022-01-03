import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PerlerType } from 'src/app/Shared/Models/PerlerType.Model';
import { PerlerTypeService } from 'src/app/Shared/Services/PerlerType.service';

@Component({
  selector: 'app-perlertype-list',
  templateUrl: './perlertype-list.component.html',
  styleUrls: ['./perlertype-list.component.scss']
})
export class PerlertypeListComponent implements OnInit {
  perlerTypes!: any[];
  perlerTypeSubscription!: Subscription;

  constructor(private perlerTypeService: PerlerTypeService, private router: Router) { }

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
