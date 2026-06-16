import { Component, input, output } from '@angular/core';
import { DeleteBtn } from '../../../shared/components/delete-btn/delete-btn';
import { FormArray, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';

/**
 * Handles the UI for creating and editing answer options inside a question.
 * Used on the create‑survey page.
 *
 * Inputs:
 * - questionIndex: The index of the question this option belongs to.
 * - options: The FormArray that holds all option controls for this question.
 * - isVisible: Used to show or hide validation messages.
 *
 * Outputs:
 * - addOption: Fired when the user clicks the "add option" button.
 * - deleteOption: Fired when the user removes an option.
 *
 * Notes:
 * - Tracks validation errors for each option using `optionErrors`.
 * - Does not save anything to the database directly.
 * - Only manages form controls and emits events to the parent component.
 */

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
  optionErrors: boolean[] = [];

  /**
   * Returns the "text" FormControl from an option FormGroup.
   * Used to read or validate the option text.
   */
  getTextControl(o: AbstractControl) {
    return o.get('text') as FormControl;
  }

  /**
   * Converts an index (0,1,2...) into a letter (A,B,C...).
   * Used to label options visually.
   */
  getLetter(i: number): string {
    return String.fromCharCode(65 + i);
  }

  /**
   * Checks if a single option text is empty.
   * Updates the error state for that specific option.
   */
  showErrorMsg(index: number) {
    const control = this.options()?.controls[index].get('text');
    this.optionErrors[index] = !control?.value?.trim();
  }

  /**
   * Emits an event to add a new option to the parent component.
   * Also adds a new error entry so the new field starts as "invalid".
   */
  onAddOption() {
    this.addOption.emit(this.questionIndex()!);
    this.optionErrors.push(true);
  }

  /**
   * Emits an event to delete an option.
   * Also removes the matching error entry.
   */
  onDeleteOption(i: number) {
    this.deleteOption.emit(i);
    this.optionErrors.splice(i, 1);
  }

  /**
   * Validates all option fields at once.
   * Used when the user tries to submit the survey.
   */
  showAllErrors() {
    this.optionErrors =
      this.options()?.controls.map((c) => {
        return !c.get('text')?.value?.trim();
      }) || [];
  }
  /**
   * Resets all option error states.
   * Called when the form is cleared or reset.
   */
  resetSurveyOptionErr() {
    this.optionErrors = [];
  }
}
