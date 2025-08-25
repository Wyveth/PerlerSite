export class FileUpload {
  key!: string;
  name!: string;
  url!: string;
  size!: string;
  type!: string;
  file: File;
  isNew?: boolean;

  constructor(file: File) {
    this.file = file;
  }
}
