// eine antwortmoeglichkeit fuer eine frage
export interface Option {
  id: string;
  created_at: string;
  question_id: string; // zu welcher frage gehoert die antwort
  text: string; // der text der antwortmoeglichkeit
  order_index: string; // reihenfolge (a, b, c...)
}
