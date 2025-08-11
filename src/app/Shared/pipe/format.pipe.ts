import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format',
})
export class FormatPipe implements PipeTransform {
  transform(template: string, ...values: (string | number)[]): string {
    if (!template) return '';
    return template.replace(/{(\d+)}/g, (match, index) => {
      return values[index] !== undefined ? values[index].toString() : match;
    });
  }
}
