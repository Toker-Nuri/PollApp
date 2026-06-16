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

/**
 * Handles the UI for creating and editing a single question
 * inside the create‑survey page.
 *
 * Inputs:
 * - questionIndex: The index of this question in the survey.
 * - questionGroup: The FormGroup that holds all controls for this question.
 *
 * Outputs:
 * - addOption: Fired when the user adds a new option.
 * - deleteOption: Fired when the user removes an option.
 * - deleteQuestion: Fired when the user deletes this question.
 *
 * Notes:
 * - Uses CreateOption as a child component to manage the option list.
 * - Tracks validation state for the question text using `isVisible`.
 */
export class CreateQuestion {
  isVisible: boolean = false;
  questionIndex = input<number>();
  questionGroup = input<any>();
  addOption = output<void>();
  deleteOption = output<number>();
  deleteQuestion = output<void>();
  @ViewChild('createOption') createOptionComponent!: CreateOption;

  /**
   * Shows or hides the error message for the question text.
   * Called when the user types or leaves the input field.
   */
  showErrorMsg() {
    const control = this.getQuestionControl();
    this.isVisible = !control?.value?.trim();
  }

  /**
   * Resets all validation errors for this question and its options.
   * Called when the form is cleared or reset.
   */
  resetSurveyQuestionErr() {
    this.isVisible = false;
    this.createOptionComponent.resetSurveyOptionErr();
  }

  /**
   * Validates the question text and all option fields at once.
   * Used when the user tries to submit the survey.
   */
  showAllErrors() {
    const control = this.getQuestionControl();
    this.isVisible = !control.value?.trim();

    this.createOptionComponent.showAllErrors();
  }

  /**
   * Returns the FormControl for the question text.
   */
  getTextControl() {
    return this.questionGroup().get('text');
  }

  /**
   * Returns the FormControl for the "allow multiple answers" checkbox.
   */
  get multipleAnswerControl() {
    return this.questionGroup().get('allow_multiple');
  }

  /**
   * Shortcut for accessing the question text control.
   */
  getQuestionControl() {
    return this.questionGroup().get('text');
  }
}
