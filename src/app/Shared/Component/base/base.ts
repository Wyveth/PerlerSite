import { AppResource } from 'src/app/shared/models/app.resource';
import { Resource } from 'src/app/resources/resource';

export class Base {
  public resource: Resource;

  constructor(protected resources: AppResource) {
    this.resource = resources['resource'];
  }
}
