import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { SectionPortfolioComponent } from './section-portfolio.component';

describe('SectionPortfolioComponent', () => {
  let fixture: ComponentFixture<SectionPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionPortfolioComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(SectionPortfolioComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
