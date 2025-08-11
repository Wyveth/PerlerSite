/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PerlertypeFormComponent } from './perlertype-form.component';

describe('PerlertypeFormComponent', () => {
  let component: PerlertypeFormComponent;
  let fixture: ComponentFixture<PerlertypeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PerlertypeFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerlertypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
