import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { PerlertypeListComponent } from './perlertype-list.component';

describe('PerlertypeListComponent', () => {
  let fixture: ComponentFixture<PerlertypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerlertypeListComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(PerlertypeListComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
