import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { PerlertypeFormComponent } from './perlertype-form.component';

describe('PerlertypeFormComponent', () => {
  let fixture: ComponentFixture<PerlertypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerlertypeFormComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(PerlertypeFormComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
