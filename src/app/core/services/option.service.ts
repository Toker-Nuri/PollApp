import { Injectable, signal } from '@angular/core';
import { Option } from '../interfaces/option.interface';
import { supabase } from './supabase.client';

// der service fuer antwortmoeglichkeiten
@Injectable({
  providedIn: 'root',
})
export class OptionService {
  // alle antworten gespeichert als signal
  options = signal<any[]>([]);

  // antworten fuer eine frage laden
  async loadOptions(questionId: string): Promise<any[]> {
    try {
      var result = await supabase
        .from('options')
        .select('*')
        .eq('question_id', questionId)
        .order('order_index', { ascending: true });

      var data = result.data;
      var error = result.error;

      if (error) {
        console.log('fehler beim laden der antworten:', error);
        return [];
      }

      if (data == null) {
        return [];
      }

      return data;
    } catch (err) {
      console.log('unerwarteter fehler in loadOptions:', err);
      return [];
    }
  }

  // alle antworten fuer eine komplette umfrage laden
  async loadAllOptions(surveyId: string): Promise<void> {
    try {
      var result = await supabase
        .from('options')
        .select('*, questions!inner(survey_id)')
        .eq('questions.survey_id', surveyId)
        .order('order_index', { ascending: true });

      var data = result.data;
      var error = result.error;

      if (error) {
        console.log('fehler in loadAllOptions:', error);
        this.options.set([]);
        return;
      }

      if (data == null) {
        this.options.set([]);
        return;
      }

      this.options.set(data as Option[]);
    } catch (err) {
      console.log('unerwarteter fehler in loadAllOptions:', err);
      this.options.set([]);
    }
  }

  // eine neue antwort speichern
  async saveOption(option: any, questionId: number) {
    try {
      var result = await supabase
        .from('options')
        .insert({
          question_id: questionId,
          text: option.text,
          order_index: option.order_index,
        })
        .select();

      var data = result.data;
      var error = result.error;

      if (error) {
        console.log('fehler beim speichern der antwort:', error);
      }

      return data?.[0];
    } catch (err) {
      console.log('unerwarteter fehler in saveOption', err);
    }
  }
}
