import { formatDate } from "@angular/common";
import { Base } from "./Base.Model";
export class Contact extends Base {
  key!: string;
  name!: string;
  email!: string;
  subject!: string;
  message!: string;

  constructor(
    name: string,
    email: string,
    subject: string,
    message: string
  ) {
    super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'))
    this.name = name;
    this.email = email;
    this.subject = subject;
    this.message = message;
  }
}