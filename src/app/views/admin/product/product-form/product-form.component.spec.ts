import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { ProductFormComponent } from './product-form.component';

describe('ProductFormComponent', () => {
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
