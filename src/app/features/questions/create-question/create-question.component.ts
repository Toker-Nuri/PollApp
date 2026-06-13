import { Component, input, output, ViewChild } from '@angular/core';
import { DeleteBtn } from '../../../shared/components/delete-btn/delete-btn';
import { CreateOption } from '../../options/create-option/create-option.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-question',
  imports: [DeleteBtn, CreateOption, ReactiveFormsModule],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.scss',
})

// formular fuer eine einzelne frage in der umfrage
export class CreateQuestion {
  errorVisible: boolean = false; // zeigt fehler wenn frage leer ist
  questionIndex = input<number>();
  questionGroup = input<any>();
  addOption = output<void>();
  deleteOption = output<number>();
  deleteQuestion = output<void>();
  @ViewChild('createOption') optionComp!: CreateOption;

  // fehler anzeigen wenn fragefeld leer ist
  checkQuestion() {
    var control = this.getTextField();
    this.errorVisible = !control?.value?.trim();
  }

  // alle fehler fuer diese frage zuruecksetzen
  clearErrors() {
    this.errorVisible = false;
    this.optionComp.clearErrors();
  }

  // alle fehler auf einmal anzeigen (beim absenden)
  showErrors() {
    var control = this.getTextField();
    this.errorVisible = !control.value?.trim();
    this.optionComp.showErrors();
  }

  // gibt das textfeld der frage zurueck
  getTextField() {
    return this.questionGroup().get('text');
  }

  // gibt das checkbox control zurueck
  get multipleControl() {
    return this.questionGroup().get('allow_multiple');
  }
}
