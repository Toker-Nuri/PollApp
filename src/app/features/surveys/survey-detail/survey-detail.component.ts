import { Component, inject, input, output } from '@angular/core';
import { SurveyService } from '../../../core/services/survey.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { QuestionItem } from '../../questions/question-item/question-item.component';

/**
 * Displays the full details of a single survey.
 * Loads the survey data and its questions based on the route ID.
 *
 * Inputs:
 * - isPastSurvey: If true, the survey is read‑only and cannot be answered.
 *
 * Outputs:
 * - selectionChanged: Emits the selected option IDs for each question.
 *
 * Notes:
 * - Loads survey details and questions on init.
 * - Uses signals from SurveyService and QuestionService for reactive updates.
 */
@Component({
  selector: 'app-survey-detail',
  imports: [QuestionItem],
  templateUrl: './survey-detail.component.html',
  styleUrl: './survey-detail.component.scss',
})
export class SurveyDetail {
  surveyService = inject(SurveyService);
  questionService = inject(QuestionService);
  surveyDetails = this.surveyService.singleSurvey;
  surveyQuestions = this.questionService.questions;
  private route = inject(ActivatedRoute);
  isPastSurvey = input<boolean>(false);
  selectionChanged = output<{ questionId: string; optionIds: string[] }>();

  /**
   * Loads the survey and its questions using the ID from the route.
   */
  ngOnInit() {
    let currentId = String(this.route.snapshot.paramMap.get('id'));
    if (currentId) {
      this.surveyService.getSingleSurvey(currentId);
      this.questionService.getQuestionsForSurvey(currentId);
    }
  }

  /**
   * Returns a readable label for the publish state.
   * Used to show "Published" or "Draft" in the UI.
   */
  getPublishLabel(): string {
    return this.surveyDetails()?.is_published ? 'Published' : 'Draft';
  }

  /**
   * Formats the survey end date into a German date format (DD.MM.YYYY).
   */
  formatEndDate() {
    const serverDate = this.surveyDetails()?.end_date;
    if (!serverDate) {
      return null;
    };
    const date = new Date(serverDate);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }
}
