import { Component, inject, input, output } from '@angular/core';
import { SurveyService } from '../../../core/services/survey.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { QuestionItem } from '../../questions/question-item/question-item.component';

// zeigt die details einer einzelnen umfrage an
// laedt umfrage und fragen beim start
@Component({
  selector: 'app-survey-detail',
  imports: [QuestionItem],
  templateUrl: './survey-detail.component.html',
  styleUrl: './survey-detail.component.scss',
})
export class SurveyDetail {
  surveyService = inject(SurveyService);
  questionService = inject(QuestionService);
  survey = this.surveyService.currentSurvey; // die aktuelle umfrage
  questions = this.questionService.questions; // alle fragen dazu
  private route = inject(ActivatedRoute);
  surveyEnded = input<boolean>(false); // ist die umfrage abgelaufen?
  selectionChanged = output<{ questionId: string; optionIds: string[] }>();

  // umfrage und fragen laden wenn die seite startet
  ngOnInit() {
    var currentId = String(this.route.snapshot.paramMap.get('id'));
    if (currentId) {
      this.surveyService.loadOneSurvey(currentId);
      this.questionService.loadQuestions(currentId);
    }
  }

  // gibt "Published" oder "Draft" zurueck
  getStatusText(): string {
    var umfrage = this.survey();
    if (umfrage?.is_published) {
      return 'Published';
    }
    return 'Draft';
  }

  // enddatum im deutschen format zurueckgeben (TT.MM.JJJJ)
  getEndDate() {
    var serverDate = this.survey()?.end_date;

    if (!serverDate) {
      return null;
    }

    var date = new Date(serverDate);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }
}
