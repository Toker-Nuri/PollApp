import { Injectable, signal } from '@angular/core';
import { Question } from '../interfaces/question.interface';
import { supabase } from './supabase.client';
import { RealtimeChannel } from '@supabase/supabase-js';

// dieser service laedt und speichert fragen
@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  // alle fragen fuer die aktuelle umfrage
  questions = signal<any[]>([]);
  questionChannel: RealtimeChannel | null = null;

  // fragen fuer eine bestimmte umfrage laden
  async loadQuestions(surveyId: string) {
    try {
      var result = await supabase
        .from('questions')
        .select('*')
        .eq('survey_id', surveyId);

      var data = result.data;
      var error = result.error;

      if (error) {
        console.log('fehler beim laden der fragen:', error);
      }

      if (data == null) {
        data = [];
      }

      this.questions.set(data);
    } catch (err) {
      console.log('unerwarteter fehler in loadQuestions', err);
    }
  }

  // eine neue frage speichern
  async saveQuestion(question: any, surveyId: number) {
    try {
      var result = await supabase
        .from('questions')
        .insert({
          survey_id: surveyId,
          order_index: question.order_index,
          text: question.text,
          allow_multiple: question.allow_multiple,
        })
        .select();

      var data = result.data;
      var error = result.error;

      if (error) {
        console.log('fehler beim speichern der frage:', error);
      }

      return data?.[0];
    } catch (err) {
      console.log('unerwarteter fehler in saveQuestion:', err);
    }
  }
}
