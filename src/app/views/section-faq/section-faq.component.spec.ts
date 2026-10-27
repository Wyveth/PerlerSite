import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { SectionFaqComponent } from './section-faq.component';

describe('SectionFaqComponent', () => {
  let fixture: ComponentFixture<SectionFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionFaqComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(SectionFaqComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
