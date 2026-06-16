import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a number as a percentage string.
 * Rounds the value to the given number of decimals.
 *
 * Usage:
 * {{ value | percentage }}
 * {{ value | percentage:1 }}
 *
 * Notes:
 * - Returns "0%" when the value is null or undefined.
 * - Does not multiply by 100; expects the input to already be a percentage value.
 */
@Pipe({
  name: 'percentage',
  standalone: true,
})
export class PercentagePipe implements PipeTransform {
  transform(value: number, decimals: number = 0): string {
    if (value === null || value === undefined) {
      return '0%';
    }
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(value * factor) / factor;
    return `${rounded}%`;
  }
}
