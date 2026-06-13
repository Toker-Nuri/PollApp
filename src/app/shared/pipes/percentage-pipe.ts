import { Pipe, PipeTransform } from '@angular/core';

// diese pipe wandelt eine zahl in einen prozentwert um
// zum beispiel: 75 wird zu "75%"
@Pipe({
  name: 'percentage',
  standalone: true,
})
export class PercentagePipe implements PipeTransform {
  transform(value: number, decimals: number = 0): string {
    // wenn kein wert da ist einfach 0% zurueckgeben
    if (value === null || value === undefined) {
      return '0%';
    }

    // wir runden den wert auf die gewuenschten dezimalstellen
    var factor = Math.pow(10, decimals);
    var rounded = Math.round(value * factor) / factor;

    return `${rounded}%`;
  }
}
