import { TestBed } from '@angular/core/testing';
import { provideFirebaseTesting } from 'src/testing/test-providers';
import { FileUploadService } from './upload-file.service';

describe('FileUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideFirebaseTesting()]
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(FileUploadService)).toBeTruthy();
  });
});
