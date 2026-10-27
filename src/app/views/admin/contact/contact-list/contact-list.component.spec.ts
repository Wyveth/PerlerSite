import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { ContactListComponent } from './contact-list.component';

describe('ContactListComponent', () => {
  let fixture: ComponentFixture<ContactListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactListComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
