/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SectionFaqComponent } from './section-faq.component';

describe('SectionResumeComponent', () => {
  let component: SectionFaqComponent;
  let fixture: ComponentFixture<SectionFaqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionFaqComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
