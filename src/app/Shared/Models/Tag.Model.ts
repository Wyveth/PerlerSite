export class Tag {
  key!: string;
  code!: string;
  libelle!: string;
  
  constructor(
    code: string,
    libelle: string
  ) {
    this.code = code;
    this.libelle = libelle;
  }
}