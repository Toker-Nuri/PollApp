// verbindung zur datenbank herstellen
// diesen client benutzen wir ueberall in der app

import { createClient } from '@supabase/supabase-js';

// hier wird der supabase client erstellt
var db = createClient(
  'https://quqaywthqwomidlluiqz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWF5d3RocXdvbWlkbGx1aXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTY3MjEsImV4cCI6MjA5NjU3MjcyMX0.-F7a40cIxq4fDgJr9Ak9ahfpyi_1rDmlTUB0PKa7NUw',
);

console.log('datenbank verbindung hergestellt');

export { db as supabase };
