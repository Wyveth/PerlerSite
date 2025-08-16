import { Directive, OnInit } from '@angular/core';
import { Resource } from 'src/app/resources/resource';
import { AppResource } from '../../models/app.resource';

@Directive()
export abstract class BaseComponent {
  protected resource!: Resource;

  constructor(protected appResource: AppResource) {
    // ⚠️ Si le service n’a pas encore chargé, resource sera null
    this.resource = this.appResource.getAllResources();
  }
}
