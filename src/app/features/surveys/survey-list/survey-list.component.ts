import { Component, inject, input } from '@angular/core';
import { SurveyService } from '../../../core/services/survey.service';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Survey } from '../../../core/interfaces/survey.interface';

// zeigt eine liste von umfragen an
// man kann filtern sortieren und begrenzen
@Component({
  selector: 'app-survey-list',
  imports: [RouterLink, NgClass],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss',
})
export class SurveyListComponent {
  surveyService = inject(SurveyService);
  allSurveys = this.surveyService.surveys;
  filter = input<string | undefined>();
  limit = input<number | undefined>();
  sort = input<string | undefined>();
  secondaryStyle = input(false);
  category = input<string | null>();

  // beim laden alle umfragen holen
  ngOnInit() {
    this.surveyService.loadSurveys();
  }

  // umfragen nach status filtern (aktiv, abgelaufen, etc)
  private applyFilter(list: Survey[]) {
    var today = this.stripTime(new Date());

    var gefiltert = list.filter((s) => {
      var hatEnddatum = !!s.end_date;
      var end = null;
      if (hatEnddatum) {
        end = new Date(s.end_date);
      }

      if (this.filter() === 'ending-soon') {
        // nur umfragen die noch nicht abgelaufen sind und ein enddatum haben
        return hatEnddatum && end! >= today;
      }

      if (this.filter() === 'active') {
        // umfragen ohne enddatum oder mit zukuenftigem enddatum
        return !hatEnddatum || end! >= today;
      }

      if (this.filter() === 'past') {
        // nur abgelaufene umfragen
        return hatEnddatum && end! < today;
      }

      return true;
    });

    return gefiltert;
  }

  // umfragen sortieren
  private applySort(list: Survey[]) {
    if (this.sort() === 'soonest-first') {
      return list.sort((a, b) => {
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
      });
    }
    return list;
  }

  // liste auf eine bestimmte anzahl begrenzen
  private applyLimit(list: Survey[]) {
    if (this.limit) {
      return list.slice(0, this.limit());
    }
    return list;
  }

  // uhrzeit aus einem datum entfernen damit vergleiche klappen
  private stripTime(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // nach kategorie filtern
  private filterCategory(list: Survey[]) {
    var cat = this.category();
    if (!cat || cat === 'All surveys') {
      return list;
    }
    return list.filter((s) => s.category === cat);
  }

  // alle filter und sortierungen anwenden und liste zurueckgeben
  getSurveys() {
    var list = [...this.allSurveys()];
    list = this.applyFilter(list);
    list = this.filterCategory(list);
    list = this.applySort(list);
    list = this.applyLimit(list);
    return list;
  }

  // berechnet wie viele tage noch uebrig sind
  getDaysLeft(serverDate: string) {
    if (!serverDate) {
      return 'No end date.';
    }

    var surveyDate = new Date(serverDate);
    var today = new Date();
    var diff = surveyDate.getTime() - today.getTime();
    var tage = Math.ceil(diff / 86400000);

    if (tage < 0) {
      return 'Survey expired';
    }

    if (tage === 0) {
      return 'Ends today';
    }

    return `Ends in ${tage} days.`;
  }
}
