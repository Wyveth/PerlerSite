/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { PerlerTypeService } from './perler-type.service';

describe('Service: PerlerType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerlerTypeService],
    });
  });

  it('should ...', inject([PerlerTypeService], (service: PerlerTypeService) => {
    expect(service).toBeTruthy();
  }));
});
