import { formatDate } from '@angular/common';
import { Base } from './base';
import { FileUpload } from './file-upload';
import { Tag } from './tag';
import { parseTime } from 'src/app/Shared/utils/parseTime';
import { parseSize } from 'src/app/Shared/utils/parseSize';

export class Product extends Base {
  key!: string;
  title!: string;
  titleContent!: string;
  content!: string;
  author!: string;
  size!: string;
  size_h!: string;
  size_w!: string;
  time!: string;
  time_h!: string;
  time_m!: string;
  date!: string;
  pictureUrl!: string | string[] | null;
  tagsKey!: KeyValue[];
  perlerTypesKey!: KeyValue[];

  /** Disponibilité : quantité en stock et fabrication sur demande, par taille de perle */
  stockMidi?: number;
  stockMini?: number;
  onDemandMidi?: boolean;
  onDemandMini?: boolean;

  tagsVisu!: string;
  tags!: Tag[];
  file!: FileUpload;

  isNew?: boolean; // facultatif
  filterClasses?: string; // facultatif

  constructor(
    title: string,
    titleContent: string,
    content: string,
    author: string,
    size: string,
    time: string,
    date: string
  ) {
    super(formatDate(new Date(), 'dd/MM/yyyy', 'en'), formatDate(new Date(), 'dd/MM/yyyy', 'en'));
    this.title = title;
    this.titleContent = titleContent;
    this.content = content;
    this.author = author;
    this.size = size;
    const sizeParts = parseSize(size);
    this.size_h = sizeParts.height.toString();
    this.size_w = sizeParts.width.toString();
    this.time = time;
    const timeParts = parseTime(time);
    this.time_h = timeParts.hours.toString();
    this.time_m = timeParts.minutes.toString();
    this.date = date;
  }
}

export interface KeyValue {
  item_text: string;
  item_id: string;
}
