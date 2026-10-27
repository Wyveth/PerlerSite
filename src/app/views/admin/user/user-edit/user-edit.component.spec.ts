import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { UserEditComponent } from './user-edit.component';

describe('UserEditComponent', () => {
  let fixture: ComponentFixture<UserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
