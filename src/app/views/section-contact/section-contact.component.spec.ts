/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SectionContactComponent } from './section-contact.component';

describe('SectionContactComponent', () => {
  let component: SectionContactComponent;
  let fixture: ComponentFixture<SectionContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionContactComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
