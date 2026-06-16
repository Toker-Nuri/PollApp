import { Injectable, signal } from '@angular/core';
import { Survey } from '../interfaces/survey.interface';
import { supabase } from './supabase.client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Service for working with surveys.
 * This handles loading all surveys, loading one survey,
 * and adding new surveys to Supabase.
 *
 * The service also keeps two signals:
 * - surveys: the full list of surveys
 * - singleSurvey: one survey used on the details page
 *
 * The service loads all surveys automatically when the app starts.
 */

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  surveys = signal<Survey[]>([]);
  singleSurvey = signal<Survey | null>(null);
  surveyChannel: RealtimeChannel | null = null;

  constructor() {
    this.getAllSurveys();
  }

  /**
   * Loads all surveys from Supabase.
   * Updates the `surveys` signal with the result.
   * Logs any errors to the console.
   */
  async getAllSurveys() {
    try {
      let { data: surveys, error } = await supabase.from('surveys').select('*');
      if (error) console.error('Supabase error at getAllSurveys:', error);
      this.surveys.set(surveys ?? ([] as Survey[]));
    } catch (err) {
      console.error('Unexpected JS runtime error at getAllSurveys', err);
    }
  }

  /**
   * Loads a single survey by its ID.
   * Updates the `singleSurvey` signal so the details page can use it.
   *
   * @param id - The ID of the survey to load.
   * @returns The survey data or null if something failed.
   */
  async getSingleSurvey(id: string) {
    try {
      let { data: surveys, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.error('Supabase error at getSingleSurvey:', error);
      this.singleSurvey.set(surveys);
      return surveys;
    } catch (err) {
      console.error('Unexpected JS runtime error in getSingleSurvey:', err);
      return null;
    }
  }

  /**
   * Inserts a new survey into Supabase.
   * Only the needed fields are sent to the database.
   *
   * @param survey - The form data from the create-survey page.
   * @returns The newly created survey or undefined if something failed.
   */
  async insertSurvey(survey: any) {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .insert({
          title: survey.title,
          description: survey.description,
          category: survey.category,
          end_date: survey.end_date,
          is_published: survey.is_published,
        })
        .select();
      if (error) {
        console.error('Supabase error at insertSurvey:', error);
        return;
      }
      return data?.[0];
    } catch (err) {
      console.error('Unexpected JS runtime error at insertSurvey:', err);
    }
  }
}
