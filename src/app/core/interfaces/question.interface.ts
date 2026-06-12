// eine frage gehoert zu einer umfrage
export interface Question {
  id: string;
  created_at: string;
  survey_id: string; // zu welcher umfrage gehoert die frage
  text: string; // der fragetext
  allow_multiple: boolean; // kann man mehrere antworten waehlen?
  order_index: number; // reihenfolge der fragen
}
