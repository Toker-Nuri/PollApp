import { Injectable, signal } from '@angular/core';
import { Question } from '../interfaces/question.interface';
import { supabase } from './supabase.client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Service for working with questions inside a survey.
 * Stores all loaded questions in a signal and provides
 * functions for loading and inserting questions.
 */

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  questions = signal<Question[]>([]);
  questionChannel: RealtimeChannel | null = null;

  /**
   * Loads all questions that belong to a specific survey.
   * Updates the `questions` signal with the result.
   *
   * @param surveyId - The ID of the survey to load questions for.
   */
  async getQuestionsForSurvey(surveyId: string) {
    try {
      let { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('survey_id', surveyId);
      if (error) console.error('getQuestionsForSurvey error:', error);
      this.questions.set(questions ?? ([] as Question[]));
    } catch (err) {
      console.error('Unexpected error in getQuestionsForSurvey', err);
    }
  }

  /**
   * Inserts a new question into Supabase.
   * The question is linked to a survey using the surveyId.
   *
   * @param question - The form data for the new question.
   * @param surveyId - The ID of the survey this question belongs to.
   * @returns The newly created question or undefined if something failed.
   */
  async insertQuestion(question: any, surveyId: number) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert({
          survey_id: surveyId,
          order_index: question.order_index,
          text: question.text,
          allow_multiple: question.allow_multiple,
        })
        .select();
      if (error) {
        console.error('Supabase error at insertQuestion:', error);
      }
      return data?.[0];
    } catch (err) {
      console.error('Unexpected JS runtime error insertQuestion:', err);
    }
  }
}
