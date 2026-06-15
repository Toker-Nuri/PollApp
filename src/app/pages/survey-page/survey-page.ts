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

// die detailseite einer einzelnen umfrage
// hier kann man abstimmen und ergebnisse sehen
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

  // referenzen auf die signale aus den services
  questions = this.questionService.questions;
  options = this.optionService.options;
  votes = this.voteService.votes;

  surveyEnded: boolean = false; // ist die umfrage abgelaufen?
  modalOpen: boolean = false; // ist das erstellen-modal offen?
  showResults: boolean = true; // ergebnisse auf mobil anzeigen?
  alreadyVoted: boolean = false; // hat der user schon gestimmt?

  // hier speichern wir was der user ausgewaehlt hat
  // key = frageId, value = liste von antwort-ids
  selectedAnswers = new Map<string, string[]>();

  // beim laden der seite alle daten holen
  async ngOnInit() {
    var surveyId = this.route.snapshot.paramMap.get('id')!;
    await this.questionService.loadQuestions(surveyId);
    await this.optionService.loadAllOptions(surveyId);
    await this.voteService.loadVotes(surveyId);

    // pruefen ob der user bereits abgestimmt hat
    this.alreadyVoted = localStorage.getItem(`survey_voted_${surveyId}`) === 'true';
  }

  // nach dem laden der view die umfrage holen und pruefen ob abgelaufen
  async ngAfterViewInit() {
    var surveyId = this.route.snapshot.paramMap.get('id')!;
    var survey = await this.surveyService.loadOneSurvey(surveyId);

    if (survey) {
      setTimeout(() => {
        this.checkIfEnded(survey.end_date);
      });
    }
  }

  // pruefen ob das enddatum in der vergangenheit liegt
  private checkIfEnded(endDate: string) {
    if (!endDate) {
      this.surveyEnded = false;
      return;
    }

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    this.surveyEnded = end < today;
  }

  // antworten fuer eine bestimmte frage zurueckgeben
  getOptionsForQ(qId: number | string) {
    return this.options().filter((o) => o.question_id === qId);
  }

  // stimmen fuer eine bestimmte frage zurueckgeben
  getVotesForQ(qId: number | string) {
    return this.votes().filter((v) => v.question_id === qId);
  }

  // gibt es irgendwelche stimmen in der datenbank?
  hasAnyVotes() {
    return this.votes().length > 0;
  }

  // hat der user lokal schon etwas ausgewaehlt?
  hasLocalAnswers() {
    for (var optionIds of this.selectedAnswers.values()) {
      if (optionIds.length > 0) {
        return true;
      }
    }
    return false;
  }

  // alle antworten in die datenbank speichern und weiterleiten
  async submitAnswers() {
    for (var [questionId, optionIds] of this.selectedAnswers.entries()) {
      if (optionIds.length > 0) {
        await this.voteService.saveVote(questionId, optionIds);
      }
    }

    // merken dass der user abgestimmt hat
    var surveyId = this.route.snapshot.paramMap.get('id')!;
    localStorage.setItem(`survey_voted_${surveyId}`, 'true');

    // zur startseite zurueck navigieren
    this.router.navigate(['/']);
  }

  // wenn der user eine antwort auswaehlt speichern wir das hier
  onAnswerChanged(event: { questionId: string; optionIds: string[] }) {
    this.selectedAnswers.set(event.questionId, event.optionIds);
  }

  // das erstellen-modal oeffnen
  openModal() {
    this.modalOpen = true;
  }
}
