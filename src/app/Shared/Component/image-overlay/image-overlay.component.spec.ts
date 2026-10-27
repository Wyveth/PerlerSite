import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { ImageOverlayComponent } from './image-overlay.component';

describe('ImageOverlayComponent', () => {
  let fixture: ComponentFixture<ImageOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageOverlayComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(ImageOverlayComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
