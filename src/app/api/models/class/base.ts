export class Base {
  dateCreation!: string;
  dateModification!: string;

  constructor(dateCreation: string, dateModification: string) {
    this.dateCreation = dateCreation;
    this.dateModification = dateModification;
  }
}
