import { formatDate } from "@angular/common";
import { Base } from "./Base.Model";

export class User extends Base {
    key!: string;
    pseudo!: string;
    surname!: string;
    name!: string;
    adress!: string;
    zipcode!: string;
    city!: string;
    pictureUrl!: string;
    email!: string;
    admin!: boolean;
    statut!:boolean;

    constructor(pseudo: string, email: string){
        super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'));
        this.pseudo = pseudo;
        this.email = email;
    }
}