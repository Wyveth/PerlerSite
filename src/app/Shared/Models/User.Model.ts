import { formatDate } from "@angular/common";
import { Base } from "./Base.Model";

export class User extends Base {
    key!: string;
    displayName!: string;
    surname!: string;
    name!: string;
    adress!: string;
    zipcode!: string;
    city!: string;
    pictureUrl!: string;
    email!: string;
    admin!: boolean;
    disabled!: boolean;

    constructor(displayName: string, email: string){
        super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'));
        this.displayName = displayName;
        this.email = email;
    }
}