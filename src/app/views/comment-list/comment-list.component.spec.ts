import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { CommentListComponent } from './comment-list.component';

describe('CommentListComponent', () => {
  let fixture: ComponentFixture<CommentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentListComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(CommentListComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
