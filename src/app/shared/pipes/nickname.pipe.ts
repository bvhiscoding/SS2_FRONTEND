import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nickname',
})
export class NicknamePipe implements PipeTransform {
  transform(value: string): string {
    // if value is empty, return empty string, if value is more than 20 char long, return first 20 char with '...' at the end, else return value
    return value
      ? value.length > 30
        ? '(' + value.slice(0, 30) + '...)'
        : '(' + value + ')'
      : '';
  }
}
