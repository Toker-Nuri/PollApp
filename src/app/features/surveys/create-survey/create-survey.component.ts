import { Component, output, input } from '@angular/core';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { DeleteBtn } from '../../../shared/components/delete-btn/delete-btn';
import { SURVEY_CATEGORIES } from '../../../shared/constants/survey-categories';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

/**
 * Handles the UI for creating the basic survey information:
 * title, description, end date, and category.
 *
 * Inputs:
 * - titleControl: FormControl for the survey title.
 * - datumControl: FormControl for the survey end date.
 * - descriptionControl: FormControl for the survey description.
 * - categoryControl: FormControl for the survey category.
 *
 * Outputs:
 * - clearSurveyName: Fired when the user clears the title field.
 * - clearSurveyDatum: Fired when the user clears the date field.
 * - clearSurveyDesctiption: Fired when the user clears the description field.
 *
 * Notes:
 * - Tracks validation errors for title and category.
 * - Does not save anything to the database.
 * - Only manages form controls and UI state.
 */
@Component({
  selector: 'app-create-survey',
  imports: [Dropdown, DeleteBtn, ReactiveFormsModule],
  templateUrl: './create-survey.component.html',
  styleUrl: './create-survey.component.scss',
})
export class CreateSurvey {
  categories = SURVEY_CATEGORIES;
  selectedCategory: string | null = null;
  isVisible: boolean = false;
  categoryErrorVisible: boolean = false;
  today = new Date().toISOString().split('T')[0];
  categoryControl = input<FormControl>();
  clearSurveyName = output<void>();
  titleControl = input.required<FormControl>();
  clearSurveyDatum = output<void>();
  datumControl = input.required<FormControl>();
  clearSurveyDesctiption = output<void>();
  descriptionControl = input.required<FormControl>();

  /**
   * Shows or hides the error message for the title field.
   * Called when the user types or leaves the input.
   */
  showErrorMsg() {
    const control = this.titleControl();
    this.isVisible = !control?.value?.trim();
  }

  /**
   * Resets the title error state.
   * Called when the title field is cleared.
   */
  resetSurveyNameErr() {
    this.isVisible = false;
  }

  /**
   * Resets the selected category and hides the category error.
   */
  resetCategory() {
    this.selectedCategory = '';
    this.categoryErrorVisible = false;
  }

  /**
   * Updates the selected category and hides the error if a value is chosen.
   */
  onCategorySelected(value: string | null) {
    this.selectedCategory = value;
    if (value) {
      this.categoryErrorVisible = false;
    }
  }

  /**
   * Validates all fields at once.
   * Used when the user tries to submit the survey.
   */
  showAllErrors() {
    const title = this.titleControl();
    const category = this.categoryControl();
    this.isVisible = !title?.value?.trim();
    this.categoryErrorVisible = !category?.value?.trim();
  }
}
