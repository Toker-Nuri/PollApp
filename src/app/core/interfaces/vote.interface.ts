// eine abgegebene stimme von einem nutzer
export interface Vote {
  id: string;
  created_at: string;
  question_id: string; // fuer welche frage wurde gestimmt
  option_id: string; // fuer welche antwort wurde gestimmt
}
