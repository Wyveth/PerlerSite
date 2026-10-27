import { TestBed } from '@angular/core/testing';
import { provideFirebaseTesting } from 'src/testing/test-providers';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideFirebaseTesting()]
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(CommentService)).toBeTruthy();
  });
});
