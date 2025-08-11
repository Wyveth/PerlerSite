/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OrdererListComponent } from './orderer-list.component';

describe('OrdererListComponent', () => {
  let component: OrdererListComponent;
  let fixture: ComponentFixture<OrdererListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdererListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdererListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
