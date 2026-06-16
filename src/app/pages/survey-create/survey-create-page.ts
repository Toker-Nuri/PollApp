import { Component, inject, output, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { SurveyService } from '../../core/services/survey.service';
import { QuestionService } from '../../core/services/question.service';
import { OptionService } from '../../core/services/option.service';
import { Router } from '@angular/router';
import { CreateSurvey } from '../../features/surveys/create-survey/create-survey.component';
import { CreateQuestion } from '../../features/questions/create-question/create-question.component';
import { ChangeDetectorRef } from '@angular/core';

/**
 * Full page for creating a new survey.
 * Handles the entire form: survey info, questions, and options.
 * Also manages validation, saving to the database, and redirecting.
 *
 * Notes:
 * - Builds a nested FormGroup with questions and options.
 * - Inserts survey → questions → options in the correct order.
 * - Shows a “published” overlay after successful creation.
 * - Resets all custom validation errors when closing the modal.
 */
@Component({
  selector: 'app-survey-create-page',
  imports: [ReactiveFormsModule, CreateSurvey, CreateQuestion],
  templateUrl: './survey-create-page.html',
  styleUrl: './survey-create-page.scss',
})
export class SurveyCreatePage {
  surveyService = inject(SurveyService);
  questionService = inject(QuestionService);
  optionService = inject(OptionService);
  router = inject(Router);
  close = output<void>();
  isPublishedOverlayOpen: boolean = false;
  isSubmittingSurvey: boolean = false;
  lastCreatedSurveyId: number | null = null;
  constructor(private cd: ChangeDetectorRef) {}
  @ViewChild('createSurvey') createSurveyComponent!: CreateSurvey;
  @ViewChildren(CreateQuestion) questionComponents!: QueryList<CreateQuestion>;

  /**
   * Main form for creating a survey.
   * Contains survey info + a FormArray of questions.
   */
  surveyForm = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required],
    }),
    description: new FormControl(''),
    end_date: new FormControl(''),
    is_published: new FormControl(false),
    category: new FormControl('', {
      validators: [Validators.required],
    }),
    questions: new FormArray([]),
  });

  /**
   * Adds the first question field when the page loads.
   */
  ngOnInit() {
    this.addQuestion();
  }

  /**
   * Shortcut to access the questions FormArray.
   */
  get questionsArr() {
    return this.surveyForm.get('questions') as FormArray;
  }

  /**
   * Adds a new question to the form, with two empty options.
   */
  addQuestion() {
    const question = new FormGroup({
      order_index: new FormControl(this.questionsArr.length + 1),
      text: new FormControl('', Validators.required),
      allow_multiple: new FormControl(false),
      options: new FormArray([]),
    });
    this.questionsArr.push(question);
    const questionIndex = this.questionsArr.length - 1;
    this.addOption(questionIndex);
    this.addOption(questionIndex);
  }

  /**
   * Deletes a question or clears the input, it if it's the last one.
   * Also recalculates the order index of the questions.
   */
  deleteQuestion(index: number) {
    if (this.questionsArr.length <= 1) {
      const question = this.questionsArr.at(index);
      question.get('text')?.setValue('');
      return;
    }
    this.questionsArr.removeAt(index);
    this.questionsArr.controls.forEach((q, i) => {
      q.get('order_index')?.setValue(i + 1);
    });
  }

  /**
   * Returns the options FormArray for a specific question.
   */
  getOptionsArr(questionIndex: number) {
    return this.questionsArr.at(questionIndex).get('options') as FormArray;
  }

  /**
   * Adds a new option to a question (max 6 answer options).
   */
  addOption(questionIndex: number) {
    const optionsArr = this.getOptionsArr(questionIndex);
    if (optionsArr.length >= 6) return;
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
    const option = new FormGroup({
      text: new FormControl('', Validators.required),
      order_index: new FormControl(alphabet[optionsArr.length]),
    });
    optionsArr.push(option);
  }

  /**
   * Deletes an option or clears it if only two remain.
   * Also recalculates the order_index of the options.
   */
  deleteOption(questionIndex: number, optionIndex: number) {
    const optionsArr = this.getOptionsArr(questionIndex);
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
    if (optionsArr.length <= 2) {
      const option = optionsArr.at(optionIndex);
      option.get('text')?.setValue('');
      return;
    }
    optionsArr.removeAt(optionIndex);
    optionsArr.controls.forEach((o, i) => {
      o.get('order_index')?.setValue(alphabet[i]);
    });
  }

  /**
   * Validates the form and submits the survey if valid.
   * Inserts survey → questions → options.
   */
  async submitSurvey() {
    if (!this.canSubmitSurvey()) return;
    this.isSubmittingSurvey = true;
    const formValue = this.normalizeSurveyPayload(this.surveyForm.value);
    formValue.is_published = true;
    const survey = await this.surveyService.insertSurvey(formValue);
    await this.insertQuestionsAndOptions(formValue.questions, survey.id);
    this.lastCreatedSurveyId = survey.id;
    this.showOverlays();
  }

  /**
   * Displays the two overlays at the end,
   * the survey submitting overlay and the published overlay
   */
  private showOverlays() {
    setTimeout(() => {
      this.isSubmittingSurvey = false;
      this.isPublishedOverlayOpen = true;
      this.cd.detectChanges();
      setTimeout(() => {
        this.redirectToSurveyDetails(this.lastCreatedSurveyId!);
      }, 1000);
    }, 350);
  }

  /**
   * Checks if the form is valid.
   * Shows custom errors if invalid.
   */
  private canSubmitSurvey(): boolean {
    if (this.surveyForm.valid) return true;
    this.surveyForm.markAllAsTouched();
    this.showAllCustomErrors();
    return false;
  }

  /**
   * Normalizes empty fields to null for Supabase.
   */
  private normalizeSurveyPayload(value: any) {
    return {
      ...value,
      end_date: value.end_date || null,
      description: value.description || null,
    };
  }

  /**
   * Inserts all questions and their options into the database.
   */
  private async insertQuestionsAndOptions(questions: any[], surveyId: number) {
    for (const q of questions) {
      const question = await this.questionService.insertQuestion(q, surveyId);

      for (const o of q.options) {
        await this.optionService.insertOptions(o, question.id);
      }
    }
  }

  /**
   * Closes the "published" overlay and redirects to the new survey.
   */
  closePublishedOverlay() {
    this.isPublishedOverlayOpen = false;
    this.redirectToSurveyDetails(this.lastCreatedSurveyId!);
  }

  /**
   * Navigates to the survey detail page.
   */
  redirectToSurveyDetails(id: number) {
    this.router.navigate(['/survey', id]);
  }

  /**
   * Resets the form and all custom validation errors.
   * Called when closing the create-survey modal.
   */
  closeCreateSurveyModal() {
    this.surveyForm.reset();
    this.createSurveyComponent.resetSurveyNameErr();
    this.createSurveyComponent.resetCategory();
    this.questionComponents.forEach((cmp) => {
      cmp.resetSurveyQuestionErr();
    });
    this.close.emit();
  }

  /**
   * Shows all custom validation errors for survey + questions.
   */

  showAllCustomErrors() {
    this.createSurveyComponent.showAllErrors();
    this.questionComponents.forEach((cmp) => {
      cmp.showAllErrors();
    });
  }

  /**
   * Returns the options FormArray for a question FormGroup.
   */
  getOptions(q: AbstractControl): FormArray {
    return q.get('options') as FormArray;
  }

  /**
   * Clears the end date field.
   */
  onClearSurveyDatum() {
    this.surveyForm.get('end_date')!.setValue('');
  }

  /**
   * Clears the title field.
   */
  onClearSurveyName() {
    this.surveyForm.get('title')!.setValue('');
  }

  /**
   * Clears the description field.
   */
  onClearSurveyDescription() {
    this.surveyForm.get('description')!.setValue('');
  }

  // -----------------------------
  // Helpers for accessing controls
  // -----------------------------

  get titleControl(): FormControl {
    return this.surveyForm.get('title') as FormControl;
  }

  get datumControl(): FormControl {
    return this.surveyForm.get('end_date') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.surveyForm.get('description') as FormControl;
  }

  get categoryControl(): FormControl {
    return this.surveyForm.get('category') as FormControl;
  }
}
