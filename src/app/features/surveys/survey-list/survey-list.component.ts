import { Component, inject, input } from '@angular/core';
import { SurveyService } from '../../../core/services/survey.service';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Survey } from '../../../core/interfaces/survey.interface';

/**
 * Displays a list of surveys with optional filtering, sorting, and limiting.
 * Used on multiple pages (landing page, category pages, etc.).
 *
 * Inputs:
 * - filter: Filters surveys by status ("ending-soon", "active", "past").
 * - limit: Limits how many surveys are shown.
 * - sort: Sorts surveys (e.g. "soonest-first").
 * - secondaryStyle: Enables an alternate card style.
 * - category: Filters surveys by category name.
 *
 * Notes:
 * - Loads all surveys on init.
 * - Uses several small helper functions to filter and sort the list.
 */

@Component({
  selector: 'app-survey-list',
  imports: [RouterLink, NgClass],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss',
})
export class SurveyListComponent {
  surveyService = inject(SurveyService);
  surveyList = this.surveyService.surveys;
  filter = input<string | undefined>();
  limit = input<number | undefined>();
  sort = input<string | undefined>();
  secondaryStyle = input(false);
  category = input<string | null>();

  /**
   * Loads all surveys when the component starts.
   */
  ngOnInit() {
    this.surveyService.getAllSurveys();
  }

  /**
   * Filters surveys based on the selected filter type.
   * - "ending-soon" → surveys that haven't expired
   * - "active" → same as ending-soon
   * - "past" → surveys that already expired
   */
  private filterSurveys(list: Survey[]) {
    const today = this.normalize(new Date());
    return list.filter((s) => {
      const hasEndDate = !!s.end_date;
      const end = hasEndDate ? new Date(s.end_date) : null;

      switch (this.filter()) {
        case 'ending-soon':
          // Only surveys WITH an end date in the future
          return hasEndDate && end! >= today;

        case 'active':
          // Surveys with NO end date OR end date in the future
          return !hasEndDate || end! >= today;

        case 'past':
          // Only surveys WITH an end date in the past
          return hasEndDate && end! < today;

        default:
          return true;
      }
    });
  }

  /**
   * Sorts surveys based on the selected sort option.
   * Currently supports:
   * - "soonest-first" → earliest end date first
   */
  private sortSurveys(list: Survey[]) {
    if (this.sort() === 'soonest-first') {
      return list.sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
    }
    return list;
  }

  /**
   * Limits how many surveys are shown.
   * Used for sections like "Ending soon (3 items)".
   */
  private limitSurveys(list: Survey[]) {
    return this.limit ? list.slice(0, this.limit()) : list;
  }

  /**
   * Normalizes a date to remove the time part.
   * Makes date comparisons easier.
   */
  private normalize(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Filters surveys by category.
   * If category is "All surveys", nothing is filtered.
   */
  private filterByCategory(list: Survey[]) {
    const category = this.category();
    if (!category || category === 'All surveys') {
      return list;
    }
    return list.filter((s) => s.category === category);
  }

  /**
   * Runs all filters, sorting, and limiting in order.
   * Returns the final list that the template displays.
   */
  getfilteredSurveys() {
    let list = [...this.surveyList()];
    list = this.filterSurveys(list);
    list = this.filterByCategory(list);
    list = this.sortSurveys(list);
    list = this.limitSurveys(list);
    return list;
  }

  /**
   * Calculates how many days are left until a survey expires.
   * Returns a readable message for the UI.
   */
  calculateRemainingDays(serverDate: string) {
     if (!serverDate) {
    return 'No end date.';
  }
    const surveyDate = new Date(serverDate);
    const today = new Date();
    const remainingDays = (surveyDate.getTime() - today.getTime()) / 86400000;
    const roundUpDays = Math.ceil(remainingDays);
    if (roundUpDays < 0) {
      return 'Survey expired';
    }
    if (roundUpDays === 0) {
      return 'Ends today';
    } else {
      return `Ends in ${roundUpDays} days.`;
    } 
  }
}
