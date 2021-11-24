import { formatDate } from "@angular/common";
import { Base } from "./Base.Model";

export class Comment extends Base {
    key!: string;
    stars!: number;
    name!: string;
    subject!: string;
    message!: string;
  
    constructor(
      stars: number,
      name: string,
      subject: string,
      message: string
    ) {
      super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'))
      this.stars = stars;
      this.name = name;
      this.subject = subject;
      this.message = message;
    }
  }