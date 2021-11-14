import { FileUpload } from "./FileUpload.Model";
import { Tag } from "./Tag.Model";

export class Product {
  key!: string;
  title!: string;
  author!: string;
  content!: string;
  pictureUrl!: string;
  tagsKey!: string[];
  
  tags!: Tag[]
  file!: FileUpload;

  constructor(title: string, author: string, content: string) {
    this.title = title;
    this.author = author;
    this.content = content;
  }
}
