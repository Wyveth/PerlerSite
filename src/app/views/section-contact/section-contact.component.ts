import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Contact } from 'src/app/api/models/class/contact';
import { ContactService } from 'src/app/api/services/contact.service';

@Component({
    selector: 'app-section-contact',
    templateUrl: './section-contact.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class SectionContactComponent implements OnInit {
  contactForm!: UntypedFormGroup;
  loading: boolean = false;
  errorSent: boolean = false;
  successSent: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, private contactService: ContactService) { }

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
  get f() { return this.contactForm.controls; }

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
        this.successSent = true;
      }, 2000);
    } catch (error) {
      this.loading = false;
      this.errorSent = true;
    }
  }

  onDeleteContact(contact: Contact) {
    this.contactService.removeContact(contact);
  }

  //Error Form
  shouldShowNameError(){
    const name = this.contactForm.controls.name;
    return name.touched && name.hasError('required');
  }

  shouldShowMailError(){
    const email = this.contactForm.controls.email;
    return email.touched && (email.hasError('required') || email.hasError('email'));
  }

  shouldShowSubjectError(){
    const subject = this.contactForm.controls.subject;
    return subject.touched && subject.hasError('required');
  }

  shouldShowMessageError(){
    const message = this.contactForm.controls.message;
    return message.touched && message.hasError('required');
  }
}
