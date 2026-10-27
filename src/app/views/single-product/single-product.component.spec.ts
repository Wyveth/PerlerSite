import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { SingleProductComponent } from './single-product.component';

describe('SingleProductComponent', () => {
  let fixture: ComponentFixture<SingleProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleProductComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(SingleProductComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
