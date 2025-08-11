export class FileUpload {
  key!: string;
  name!: string;
  url!: string;
  size!: string;
  type!: string;
  file: File;

  constructor(file: File) {
    this.file = file;
  }
}
