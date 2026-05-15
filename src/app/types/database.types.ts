export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      surveys: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          survey_id: string;
          text: string;
          type: 'single_choice' | 'multiple_choice' | 'text';
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          survey_id: string;
          text: string;
          type: 'single_choice' | 'multiple_choice' | 'text';
          position?: number;
          created_at?: string;
        };
        Update: {
          text?: string;
          type?: 'single_choice' | 'multiple_choice' | 'text';
          position?: number;
        };
      };
      options: {
        Row: {
          id: string;
          question_id: string;
          text: string;
          position: number;
        };
        Insert: {
          id?: string;
          question_id: string;
          text: string;
          position?: number;
        };
        Update: {
          text?: string;
          position?: number;
        };
      };
      responses: {
        Row: {
          id: string;
          survey_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          survey_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      response_answers: {
        Row: {
          id: string;
          response_id: string;
          question_id: string;
          option_id: string | null;
          text_answer: string | null;
        };
        Insert: {
          id?: string;
          response_id: string;
          question_id: string;
          option_id?: string | null;
          text_answer?: string | null;
        };
        Update: Record<string, never>;
      };
    };
  };
}
