import { formatDate } from "@angular/common";
import { Base } from "./Base.Model";
import { FileUpload } from "./FileUpload.Model";
import { Tag } from "./Tag.Model";

export class Product extends Base {
  key!: string;
  title!: string;
  titleContent!: string;
  content!: string;
  author!: string;
  size!: string;
  time!: string;
  date!: string;
  pictureUrl!: string;
  tagsKey!: string[];
  
  tags!: Tag[]
  file!: FileUpload;

  constructor(title: string, titleContent: string, content: string, author: string, size: string, time: string, date: string) {
    super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'));
    this.title = title;
    this.titleContent = titleContent;
    this.content = content;
    this.author = author;
    this.size = size;
    this.time = time;
    this.date = date;
  }
}
