/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { UtilsService } from './utils.service';

describe('Service: GenerateKey', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilsService],
    });
  });

  it('should ...', inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));
});
