import { formatDate } from '@angular/common';
import { Base } from './base';
import { FileUpload } from './file-upload';

export class User extends Base {
  key!: string;
  displayName!: string;
  surname!: string;
  name!: string;
  adress!: string;
  zipcode!: string;
  city!: string;
  pictureUrl!: string | string[] | null;
  email!: string;
  admin!: boolean;
  disabled!: boolean;

  constructor(
    displayName: string,
    email: string,
    surname: string = '',
    name: string = '',
    adress: string = '',
    zipcode: string = '',
    city: string = '',
    pictureUrl: string | string[] | null = null,
    admin: boolean = false,
    disabled: boolean = false
  ) {
    super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'));
    this.displayName = displayName;
    this.email = email;
    this.surname = surname;
    this.name = name;
    this.adress = adress;
    this.zipcode = zipcode;
    this.city = city;
    this.pictureUrl = pictureUrl;
    this.admin = admin;
    this.disabled = disabled;
  }
}
