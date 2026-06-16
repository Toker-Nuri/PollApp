import { Component, ViewChild, ElementRef } from '@angular/core';
import { SurveyListComponent } from '../../features/surveys/survey-list/survey-list.component';
import { Dropdown } from '../../shared/components/dropdown/dropdown';
import { Dialog } from '../../shared/components/dialog/dialog';
import { SURVEY_CATEGORIES } from '../../shared/constants/survey-categories';
import { SurveyCreatePage } from '../survey-create/survey-create-page';

/**
 * The main landing page of the app.
 * Displays survey lists, category filters, and the button
 * for opening the create‑survey modal.
 *
 * Notes:
 * - Adds a data attribute to the <body> for page‑specific styling.
 * - Manages the selected category and active filter.
 * - Controls the visibility of the create‑survey modal.
 */
@Component({
  selector: 'app-landing-page',
  imports: [SurveyListComponent, Dropdown, SurveyCreatePage, Dialog],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  activeFilter: 'active' | 'past' = 'active';
  categories = ['All surveys', ...SURVEY_CATEGORIES];
  selectedCategory: string | null = null;
  isCreateSurveyOpen = false;

  @ViewChild('createSurveyModal') modal!: ElementRef<HTMLDialogElement>;

  /**
   * Adds a page identifier to the <body> element.
   * Used for page‑specific styling.
   */
  ngOnInit() {
    document.body.setAttribute('data-page', 'landing');
  }

  /**
   * Removes the page identifier when leaving the page.
   */
  ngOnDestroy() {
    document.body.removeAttribute('data-page');
  }

  /**
   * Opens the create‑survey modal.
   */
  openCreateSurveyModal() {
    this.isCreateSurveyOpen = true;
  }
}
