import { Component, inject } from '@angular/core';
import { SurveyDetail } from '../../features/surveys/survey-detail/survey-detail.component';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { VoteResults } from '../../features/votes/vote-results/vote-results.component';
import { OptionService } from '../../core/services/option.service';
import { VoteService } from '../../core/services/vote.service';
import { QuestionService } from '../../core/services/question.service';
import { SurveyService } from '../../core/services/survey.service';
import { Dialog } from '../../shared/components/dialog/dialog';
import { SurveyCreatePage } from '../survey-create/survey-create-page';
import lo from '@angular/common/locales/extra/lo';

/**
 * The main container for displaying a full, detailed survey.
 * Loads questions, options, and votes for the selected survey.
 * Handles answer selection, vote submission, and showing results.
 *
 * Notes:
 * - Loads all survey data on init.
 * - Computes whether the survey is expired.
 * - Collects selected answers and submits them at once.
 * - Controls the mobile results panel and the create-survey modal.
 */
@Component({
  selector: 'app-survey-page',
  imports: [SurveyDetail, RouterLink, VoteResults, Dialog, SurveyCreatePage],
  templateUrl: './survey-page.html',
  styleUrl: './survey-page.scss',
})
export class SurveyPage {
  private route = inject(ActivatedRoute);
  questionService = inject(QuestionService);
  optionService = inject(OptionService);
  voteService = inject(VoteService);
  surveyService = inject(SurveyService);
  router = inject(Router);
  questions = this.questionService.questions;
  options = this.optionService.options;
  votes = this.voteService.votes;
  isPastSurvey: boolean = false;
  isCreateSurveyOpen: boolean = false;
  showResultsMobile: boolean = true;
  userHasVoted:boolean = false;
  // Stores selected answers in the voting process: questionId → optionIds[]
  answers = new Map<string, string[]>();

  /**
   * Loads all questions, options, and votes for this survey.
   */
  async ngOnInit() {
    const surveyId = this.route.snapshot.paramMap.get('id')!;
    await this.questionService.getQuestionsForSurvey(surveyId);
    await this.optionService.getOptionsForSurvey(surveyId);
    await this.voteService.getVotesForSurvey(surveyId);
    this.userHasVoted = localStorage.getItem(`survey_voted_${surveyId}`) === "true";
  }

  /**
   * Loads the survey after the view is ready and computes
   * whether the survey is already expired.
   */
  async ngAfterViewInit() {
    const surveyId = this.route.snapshot.paramMap.get('id')!;
    const survey = await this.surveyService.getSingleSurvey(surveyId);
    if (survey) {
      setTimeout(() => {
        this.computeIsPast(survey.end_date);
      });
    }
  }

  /**
   * Checks if the survey end date is before today.
   * Used to disable voting on expired surveys.
   */
  private computeIsPast(endDate: string) {
    if (!endDate) {
      this.isPastSurvey = false;
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    this.isPastSurvey = end < today;
  }

  /**
   * Returns all options that belong to a specific question.
   */
  optionsForQuestion(qId: number | string) {
    return this.options().filter((o) => o.question_id === qId);
  }

  /**
   * Returns all votes that belong to a specific question.
   */
  votesForQuestion(qId: number | string) {
    return this.votes().filter((v) => v.question_id === qId);
  }

  /**
   * Returns true if the survey has at least one vote.
   */
  hasVotes() {
    return this.votes().length > 0;
  }

  /**
   * Checks whether the user has selected any answers locally.
   * Used to show live vote results before the survey is submitted.
   *
   * Returns true if at least one question contains one or more
   * locally selected option IDs.
   */
  hasLocalVotes() {
    for (const optionIds of this.answers.values()) {
      if (optionIds.length > 0) return true;
    }
    return false;
  }

  /**
   * Submits all selected answers to the database.
   * Called when the user clicks "Submit survey".
   */
  async completeSurvey() {
    for (const [questionId, optionIds] of this.answers.entries()) {
      if (optionIds.length > 0) {
        await this.voteService.insertVote(questionId, optionIds);
      }
    }
    const surveyId = this.route.snapshot.paramMap.get('id')!;
    localStorage.setItem(`survey_voted_${surveyId}`, 'true');
    this.router.navigate(['/']);
  }

  /**
   * Updates the stored answers when a question selection changes.
   */
  onSelectionChanged(event: { questionId: string; optionIds: string[] }) {
    this.answers.set(event.questionId, event.optionIds);
  }

  /**
   * Opens the modal for creating a new survey.
   */
  openCreateSurveyModal() {
    this.isCreateSurveyOpen = true;
  }
}
