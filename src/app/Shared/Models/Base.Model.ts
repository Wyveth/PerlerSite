export class Base {
    dateCreation!: String;
    dateModification!: String;

    constructor(dateCreation: String, dateModification: String) {
        this.dateCreation = dateCreation;
        this.dateModification = dateModification;
    }
}
