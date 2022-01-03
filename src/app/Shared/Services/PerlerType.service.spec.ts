/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PerlerTypeService } from './PerlerType.service';

describe('Service: PerlerType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerlerTypeService]
    });
  });

  it('should ...', inject([PerlerTypeService], (service: PerlerTypeService) => {
    expect(service).toBeTruthy();
  }));
});
