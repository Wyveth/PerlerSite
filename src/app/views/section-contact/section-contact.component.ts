import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Contact } from 'src/app/api/models/class/contact';
import { ContactService } from 'src/app/api/services/contact.service';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from './../../shared/models/app.resource';
import { MessageService } from 'primeng/api';
import { severity } from 'src/app/shared/enum/severity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-contact',
  templateUrl: './section-contact.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, TextareaModule]
})
export class SectionContactComponent extends BaseComponent implements OnInit {
  contactForm!: UntypedFormGroup;
  loading: boolean = false;

  constructor(
    resources: AppResource,
    private messageService: MessageService,
    private formBuilder: UntypedFormBuilder,
    private contactService: ContactService,
    private router: Router
  ) {
    super(resources);
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  /// Obtenir pour un accès facile aux champs de formulaire
  get f() {
    return this.contactForm.controls;
  }

  onSubmitForm() {
    this.loading = true;
    const formValue = this.contactForm.value;

    const contact = new Contact(
      formValue['name'],
      formValue['email'],
      formValue['subject'],
      formValue['message']
    );

    setTimeout(() => {
      this.loading = false;
    }, 2000);

    try {
      this.contactService.createContact(contact);

      setTimeout(() => {
        this.loading = false;
        this.messageService.add({
          severity: severity.success,
          summary: this.resource.severity.success,
          detail: this.resource.contact.send_message_success
        });
      }, 2000);
    } catch (error) {
      this.loading = false;
      this.messageService.add({
        severity: severity.error,
        summary: this.resource.severity.error,
        detail: this.resource.error.server_error
      });
    }
  }

  onDeleteContact(contact: Contact) {
    this.contactService.removeContact(contact);
  }

  //Error Form
  shouldShowNameError() {
    const name = this.contactForm.controls.name;
    return name.touched && name.hasError('required');
  }

  shouldShowMailError() {
    const email = this.contactForm.controls.email;
    return email.touched && (email.hasError('required') || email.hasError('email'));
  }

  shouldShowSubjectError() {
    const subject = this.contactForm.controls.subject;
    return subject.touched && subject.hasError('required');
  }

  shouldShowMessageError() {
    const message = this.contactForm.controls.message;
    return message.touched && message.hasError('required');
  }
}
