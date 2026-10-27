import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDefaults } from 'src/testing/test-providers';
import { OrdererListComponent } from './orderer-list.component';

describe('OrdererListComponent', () => {
  let fixture: ComponentFixture<OrdererListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdererListComponent],
      providers: provideTestDefaults()
    }).compileComponents();

    fixture = TestBed.createComponent(OrdererListComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
