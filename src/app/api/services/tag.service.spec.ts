import { TestBed } from '@angular/core/testing';
import { provideFirebaseTesting } from 'src/testing/test-providers';
import { TagService } from './tag.service';

describe('TagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideFirebaseTesting()]
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(TagService)).toBeTruthy();
  });
});
