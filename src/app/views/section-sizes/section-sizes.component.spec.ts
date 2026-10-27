import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { SectionSizesComponent } from './section-sizes.component';

describe('SectionSizesComponent', () => {
  let fixture: ComponentFixture<SectionSizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionSizesComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(SectionSizesComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
