import { TestBed } from '@angular/core/testing';
import { provideFirebaseTesting } from 'src/testing/test-providers';
import { ProductService } from './product.service';

describe('ProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideFirebaseTesting()]
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(ProductService)).toBeTruthy();
  });
});
