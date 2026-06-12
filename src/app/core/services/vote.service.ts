import { Injectable, signal } from '@angular/core';
import { Vote } from '../interfaces/vote.interface';
import { supabase } from './supabase.client';
import { RealtimeChannel } from '@supabase/supabase-js';

// dieser service verwaltet alle stimmen/votes
@Injectable({
  providedIn: 'root',
})
export class VoteService {
  // alle stimmen als signal gespeichert
  votes = signal<any[]>([]);
  voteChannel: RealtimeChannel | null = null;

  // stimmen fuer eine bestimmte frage laden
  async loadVotesForQuestion(questionId: string) {
    var result = await supabase
      .from('votes')
      .select('*')
      .eq('question_id', questionId);

    var data = result.data;
    var error = result.error;

    if (error) {
      console.log('fehler in loadVotesForQuestion:', error);
      return [];
    }

    if (data == null) {
      return [];
    }

    return data;
  }

  // stimmen fuer eine bestimmte antwort laden
  async loadVotesForOption(optionId: string): Promise<any[]> {
    try {
      var result = await supabase
        .from('votes')
        .select('*')
        .eq('option_id', optionId);

      var data = result.data;
      var error = result.error;

      if (error) {
        console.log('fehler in loadVotesForOption:', error);
      }

      if (data == null) {
        return [];
      }

      return data;
    } catch (err) {
      console.log('unerwarteter fehler in loadVotesForOption:', err);
      return [];
    }
  }

  // alle stimmen fuer eine ganze umfrage laden
  async loadVotes(surveyId: string) {
    try {
      var result = await supabase
        .from('votes')
        .select('*, questions!inner(survey_id)')
        .eq('questions.survey_id', surveyId);

      var data = result.data;
      var error = result.error;

      if (error) {
        console.log('fehler in loadVotes:', error);
        this.votes.set([]);
        return;
      }

      if (data == null) {
        this.votes.set([]);
        return;
      }

      this.votes.set(data as Vote[]);
    } catch (err) {
      console.log('unerwarteter fehler in loadVotes:', err);
      this.votes.set([]);
    }
  }

  // stimme abgeben fuer eine oder mehrere antworten
  async saveVote(questionId: string, optionIds: string[]) {
    try {
      // fuer jede ausgewaehlte antwort einen eintrag erstellen
      var payload = [];
      for (var i = 0; i < optionIds.length; i++) {
        payload.push({
          question_id: questionId,
          option_id: optionIds[i],
        });
      }

      var result = await supabase.from('votes').insert(payload).select();
      var error = result.error;

      if (error) {
        console.log('fehler beim speichern der stimme:', error);
      }
    } catch (err) {
      console.log('unerwarteter fehler in saveVote', err);
    }
  }
}
