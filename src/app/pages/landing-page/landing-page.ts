import { Component, ViewChild, ElementRef } from '@angular/core';
import { SurveyListComponent } from '../../features/surveys/survey-list/survey-list.component';
import { Dropdown } from '../../shared/components/dropdown/dropdown';
import { Dialog } from '../../shared/components/dialog/dialog';
import { SURVEY_CATEGORIES } from '../../shared/constants/survey-categories';
import { SurveyCreatePage } from '../survey-create/survey-create-page';

// die startseite der app
// zeigt alle umfragen und einen button zum erstellen
@Component({
  selector: 'app-landing-page',
  imports: [SurveyListComponent, Dropdown, SurveyCreatePage, Dialog],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  currentFilter: 'active' | 'past' = 'active'; // aktiver oder vergangene umfragen
  categories = ['All surveys', ...SURVEY_CATEGORIES];
  chosenCategory: string | null = null; // ausgewaehlte kategorie
  modalOpen = false; // ist das erstellen-modal offen?

  @ViewChild('createSurveyModal') modal!: ElementRef<HTMLDialogElement>;

  // seiten-identifier fuer css setzen
  ngOnInit() {
    document.body.setAttribute('data-page', 'landing');
  }

  // seiten-identifier wieder entfernen
  ngOnDestroy() {
    document.body.removeAttribute('data-page');
  }

  // modal zum erstellen einer umfrage oeffnen
  openModal() {
    this.modalOpen = true;
  }
}
