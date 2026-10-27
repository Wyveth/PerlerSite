import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { TagFormComponent } from './tag-form.component';

describe('TagFormComponent', () => {
  let fixture: ComponentFixture<TagFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagFormComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(TagFormComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
