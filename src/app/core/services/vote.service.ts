import { Injectable, signal } from '@angular/core';
import { Vote } from '../interfaces/vote.interface';
import { supabase } from './supabase.client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Service for working with votes.
 * Handles loading votes for questions, options, or a whole survey,
 * and inserting new votes into Supabase.
 *
 * The `votes` signal is used on the survey detail page
 * to show the results after the user submits their vote.
 */

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  votes = signal<Vote[]>([]);
  voteChannel: RealtimeChannel | null = null;

  /**
   * Loads all votes for a specific question.
   *
   * @param questionId - The ID of the question to load votes for.
   * @returns A list of votes or an empty array if something failed.
   */
  async getVotesForQuestion(questionId: string) {
    const { data, error } = await supabase.from('votes').select('*').eq('question_id', questionId);
    if (error) {
      console.error('Supabase error at getVotesForQuestion:', error);
      return [];
    }
    return data ?? [];
  }

  /**
   * Loads all votes for a specific option.
   *
   * @param optionId - The ID of the option to load votes for.
   * @returns A list of votes or an empty array if something failed.
   */
  async getVotesForOption(optionId: string): Promise<Vote[]> {
    try {
      let { data: votes, error } = await supabase
        .from('votes')
        .select('*')
        .eq('option_id', optionId);
      if (error) {
        console.error('Supabase error at getVotesForOption:', error);
      }
      return votes ?? [];
    } catch (err) {
      console.error('Unexpected JS runtime error at getVotesForOption:', err);
      return [];
    }
  }

  /**
   * Loads all votes for all questions inside a survey.
   * Updates the `votes` signal with the result.
   *
   * @param surveyId - The ID of the survey to load votes for.
   */
  async getVotesForSurvey(surveyId: string) {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('*, questions!inner(survey_id)')
        .eq('questions.survey_id', surveyId);

      if (error) {
        console.error('getVotesForSurvey error:', error);
        this.votes.set([]);
        return;
      }

      this.votes.set((data as Vote[]) ?? []);
    } catch (err) {
      console.error('Unexpected JS runtime error at getVotesForSurvey:', err);
      this.votes.set([]);
    }
  }

  /**
   * Inserts one or more votes for a question.
   * Called when the user submits their selected options.
   *
   * @param questionId - The question being voted on.
   * @param optionIds - One or multiple option IDs the user selected.
   */
  async insertVote(questionId: string, optionIds: string[]) {
    try {
      const payload = optionIds.map((optionId) => ({
        question_id: questionId,
        option_id: optionId,
      }));
      const { data, error } = await supabase.from('votes').insert(payload).select();
      if (error) {
        console.error('Supabase error at insertVotes:', error);
      }
    } catch (err) {
      console.error('Unexpected JS runtime error at insertVotes', err);
    }
  }
}
