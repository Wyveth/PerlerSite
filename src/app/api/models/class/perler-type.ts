import { formatDate } from '@angular/common';
import { Base } from './base';

export class PerlerType extends Base {
  key!: string;
  reference!: string;
  libelle!: string;
  color!: string;

  constructor(reference: string, libelle: string, color: string) {
    super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'));
    this.reference = reference;
    this.libelle = libelle;
    this.color = color;
  }
}
