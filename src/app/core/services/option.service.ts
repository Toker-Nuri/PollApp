import { Injectable, signal } from '@angular/core';
import { Option } from '../interfaces/option.interface';
import { supabase } from './supabase.client';

/**
 * Service for working with answer options.
 * Handles loading options for a question or a whole survey,
 * and inserting new options into Supabase.
 */

@Injectable({
  providedIn: 'root',
})
export class OptionService {
  options = signal<Option[]>([]);

  /**
   * Loads all options that belong to a specific question.
   * Returns the list directly (does not update the signal).
   *
   * @param questionId - The ID of the question to load options for.
   * @returns A list of options or an empty array if something failed.
   */
  async getOptionsForQuestion(questionId: string): Promise<Option[]> {
    try {
      const { data, error } = await supabase
        .from('options')
        .select('*')
        .eq('question_id', questionId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('getOptionsForQuestion error:', error);
        return [];
      }

      return data ?? [];
    } catch (err) {
      console.error('Unexpected error in getOptionsForQuestion:', err);
      return [];
    }
  }

  /**
   * Loads all options for all questions inside a survey.
   * Updates the `options` signal with the result.
   * Used on the survey detail page to show all results.
   *
   * @param surveyId - The ID of the survey to load options for.
   */
  async getOptionsForSurvey(surveyId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('options')
        .select('*, questions!inner(survey_id)')
        .eq('questions.survey_id', surveyId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('getOptionsForSurvey error:', error);
        this.options.set([]);
        return;
      }

      this.options.set((data as Option[]) ?? []);
    } catch (err) {
      console.error('Unexpected error in getOptionsForSurvey:', err);
      this.options.set([]);
    }
  }

  /**
   * Inserts a new option for a specific question.
   *
   * @param option - The form data for the new option.
   * @param questionId - The ID of the question this option belongs to.
   * @returns The newly created option or undefined if something failed.
   */
  async insertOptions(option: any, questionId: number) {
    try {
      const { data, error } = await supabase
        .from('options')
        .insert({
          question_id: questionId,
          text: option.text,
          order_index: option.order_index,
        })
        .select();
      if (error) {
        console.error('Supabase error at insertOptions:', error);
      }
      return data?.[0];
    } catch (err) {
      console.error('Unexpected JS runtime error at insertOptions', err);
    }
  }
}
