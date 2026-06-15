import { Component, input, output } from '@angular/core';
import { DeleteBtn } from '../../../shared/components/delete-btn/delete-btn';
import { FormArray, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';

// komponente fuer die antwortmoeglichkeiten einer frage
@Component({
  selector: 'app-create-option',
  imports: [DeleteBtn, ReactiveFormsModule],
  templateUrl: './create-option.component.html',
  styleUrl: './create-option.component.scss',
})
export class CreateOption {
  isVisible: boolean = false;
  questionIndex = input<number>();
  addOption = output<number>();
  options = input<FormArray>();
  deleteOption = output<number>();
  optionErrors: boolean[] = []; // fehler fuer jede antwort

  // text des antwortfeldes holen
  getOptionText(o: AbstractControl) {
    return o.get('text') as FormControl;
  }

  // index in buchstaben umwandeln (0=A, 1=B usw)
  toLetter(i: number): string {
    return String.fromCharCode(65 + i);
  }

  // fehler fuer eine bestimmte antwort pruefen
  checkOption(index: number) {
    var control = this.options()?.controls[index].get('text');
    this.optionErrors[index] = !control?.value?.trim();
  }

  // antwort loeschen und fehler-array aktualisieren
  removeAnswer(i: number) {
    this.deleteOption.emit(i);
    this.optionErrors.splice(i, 1);
  }

  // alle fehler auf einmal anzeigen
  showErrors() {
    this.optionErrors =
      this.options()?.controls.map((c) => {
        return !c.get('text')?.value?.trim();
      }) || [];
  }

  // alle fehler zuruecksetzen
  clearErrors() {
    this.optionErrors = [];
  }
}
