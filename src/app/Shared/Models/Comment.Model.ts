import { formatDate } from "@angular/common";
import { Base } from "./Base.Model";

export class Comment extends Base {
    key!: string;
    note!: number;
    comment!: string;
    productKey!: string;

    constructor(note: number, comment: string, productKey: string){
        super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'));
        this.note = note;
        this.comment = comment;
        this.productKey = productKey;
    }
}
