// das hier ist das datenmodell fuer eine umfrage
export interface Survey {
  id: string;
  created_at: string; // wann wurde sie erstellt
  title: string; // der titel der umfrage
  description: string;
  category: string; // die kategorie
  end_date: string; // bis wann laeuft die umfrage
  is_published: boolean; // true = sichtbar fuer alle
}
