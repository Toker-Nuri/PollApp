import { Component, output, input } from '@angular/core';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { DeleteBtn } from '../../../shared/components/delete-btn/delete-btn';
import { SURVEY_CATEGORIES } from '../../../shared/constants/survey-categories';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// hier wird das formular fuer eine neue umfrage angezeigt
// titel beschreibung datum und kategorie
@Component({
  selector: 'app-create-survey',
  imports: [Dropdown, DeleteBtn, ReactiveFormsModule],
  templateUrl: './create-survey.component.html',
  styleUrl: './create-survey.component.scss',
})
export class CreateSurvey {
  categories = SURVEY_CATEGORIES;
  selectedCategory: string | null = null;
  isVisible: boolean = false; // zeigt titelfehlermeldung an
  categoryErrorVisible: boolean = false; // zeigt kategoriefehler an
  today = new Date().toISOString().split('T')[0]; // heutiges datum fuer min-datum

  // formcontrols vom parent
  categoryControl = input<FormControl>();
  clearSurveyName = output<void>();
  titleControl = input.required<FormControl>();
  clearSurveyDatum = output<void>();
  datumControl = input.required<FormControl>();
  clearSurveyDesctiption = output<void>();
  descriptionControl = input.required<FormControl>();

  // fehler fuer das titelfeld zeigen oder verstecken
  checkTitle() {
    var control = this.titleControl();
    this.isVisible = !control?.value?.trim();
  }

  // titelfehler zuruecksetzen
  clearTitleError() {
    this.isVisible = false;
  }

  // kategorie zuruecksetzen
  clearCat() {
    this.selectedCategory = '';
    this.categoryErrorVisible = false;
  }

  // wenn eine kategorie ausgewaehlt wurde
  categoryPicked(value: string | null) {
    this.selectedCategory = value;
    if (value) {
      this.categoryErrorVisible = false;
    }
  }

  // alle fehler auf einmal anzeigen (beim absenden)
  showErrors() {
    var title = this.titleControl();
    var category = this.categoryControl();
    this.isVisible = !title?.value?.trim();
    this.categoryErrorVisible = !category?.value?.trim();
  }
}
