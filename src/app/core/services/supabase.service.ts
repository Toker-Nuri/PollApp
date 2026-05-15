import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import type { Database } from '../../types/database.types';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly platformId = inject(PLATFORM_ID);
  private _client: SupabaseClient<Database> | null = null;

  get client(): SupabaseClient<Database> {
    if (!this._client) {
      this._client = createClient<Database>(
        environment.supabase.url,
        environment.supabase.anonKey,
        { auth: { persistSession: isPlatformBrowser(this.platformId) } }
      );
    }
    return this._client;
  }

  get surveys() {
    return this.client.from('surveys');
  }

  get questions() {
    return this.client.from('questions');
  }

  get options() {
    return this.client.from('options');
  }

  get responses() {
    return this.client.from('responses');
  }

  get responseAnswers() {
    return this.client.from('response_answers');
  }
}
