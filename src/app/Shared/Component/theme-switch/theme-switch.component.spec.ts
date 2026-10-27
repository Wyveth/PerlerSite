import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { ThemeSwitchComponent } from './theme-switch.component';

describe('ThemeSwitchComponent', () => {
  let fixture: ComponentFixture<ThemeSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSwitchComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSwitchComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
