import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { SectionWelcomeComponent } from './section-welcome.component';

describe('SectionWelcomeComponent', () => {
  let fixture: ComponentFixture<SectionWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionWelcomeComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(SectionWelcomeComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
