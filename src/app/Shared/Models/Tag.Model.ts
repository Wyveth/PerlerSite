import { formatDate } from "@angular/common";
import { Base } from "./Base.Model";
import { FileUpload } from "./FileUpload.Model";

export class Tag extends Base {
  key!: string;
  code!: string;
  libelle!: string;
  pictureUrl!: string;
  
  file!: FileUpload;

  constructor(
    code: string,
    libelle: string
  ) {
    super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'))
    this.code = code;
    this.libelle = libelle;
  }
}