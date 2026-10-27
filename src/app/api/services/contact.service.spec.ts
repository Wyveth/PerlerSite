import { TestBed } from '@angular/core/testing';
import { provideFirebaseTesting } from 'src/testing/test-providers';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideFirebaseTesting()]
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(ContactService)).toBeTruthy();
  });
});
