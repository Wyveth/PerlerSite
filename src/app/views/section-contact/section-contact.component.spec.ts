import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { SectionContactComponent } from './section-contact.component';

describe('SectionContactComponent', () => {
  let fixture: ComponentFixture<SectionContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionContactComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(SectionContactComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
