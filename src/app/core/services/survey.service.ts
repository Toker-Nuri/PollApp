import { Injectable, signal } from '@angular/core';
import { Survey } from '../interfaces/survey.interface';
import { supabase } from './supabase.client';
import { RealtimeChannel } from '@supabase/supabase-js';

// dieser service ist zustaendig fuer alle umfragen
// hier laden und speichern wir umfragen

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  // hier speichern wir alle umfragen
  surveys = signal<any[]>([]);
  // die aktuell geoeffnete umfrage
  currentSurvey = signal<Survey | null>(null);
  surveyChannel: RealtimeChannel | null = null;

  constructor() {
    // beim start alle umfragen laden
    this.loadSurveys();
  }

  // alle umfragen aus der datenbank holen
  async loadSurveys() {
    try {
      var result = await supabase.from('surveys').select('*');
      var data = result.data;
      var error = result.error;

      if (error) {
        console.log('Fehler beim laden der umfragen:', error);
      }

      if (data == null) {
        data = [];
      }

      this.surveys.set(data);
    } catch (err) {
      console.log('unerwarteter fehler in loadSurveys', err);
    }
  }

  // eine einzelne umfrage anhand der id laden
  async loadOneSurvey(id: string) {
    try {
      var result = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single();

      var data = result.data;
      var error = result.error;

      if (error) {
        console.log('Fehler beim laden der umfrage:', error);
      }

      this.currentSurvey.set(data);
      return data;
    } catch (err) {
      console.log('unerwarteter fehler in loadOneSurvey:', err);
      return null;
    }
  }

  // neue umfrage in der datenbank speichern
  async saveSurvey(survey: any) {
    try {
      var result = await supabase
        .from('surveys')
        .insert({
          title: survey.title,
          description: survey.description,
          category: survey.category,
          end_date: survey.end_date,
          is_published: survey.is_published,
        })
        .select();

      var data = result.data;
      var error = result.error;

      if (error) {
        console.log('Fehler beim speichern der umfrage:', error);
        return;
      }

      console.log('umfrage gespeichert!');
      return data?.[0];
    } catch (err) {
      console.log('unerwarteter fehler in saveSurvey:', err);
    }
  }
}
