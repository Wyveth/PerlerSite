/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { FileUploadService } from './upload-file.service';

describe('Service: UploadFile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileUploadService]
    });
  });

  it('should ...', inject([FileUploadService], (service: FileUploadService) => {
    expect(service).toBeTruthy();
  }));
});
