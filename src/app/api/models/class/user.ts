import { formatDate } from "@angular/common";
import { Base } from "./base";
import { FileUpload } from "./file-upload";

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
    file!: FileUpload;

    constructor(displayName: string, email: string){
        super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'));
        this.displayName = displayName;
        this.email = email;
    }
}