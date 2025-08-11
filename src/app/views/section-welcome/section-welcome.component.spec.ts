/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SectionWelcomeComponent } from './section-welcome.component';

describe('SectionWelcomeComponent', () => {
  let component: SectionWelcomeComponent;
  let fixture: ComponentFixture<SectionWelcomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionWelcomeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
