/**
 * Creates the main Supabase client used in the whole app.
 * We use this to transfer data to Supabase database (fetch, insert, update, etc).
 *
 * Note:
 * - This client is created once here.
 * - Other services import it and reuse the same instance.
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://quqaywthqwomidlluiqz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWF5d3RocXdvbWlkbGx1aXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTY3MjEsImV4cCI6MjA5NjU3MjcyMX0.-F7a40cIxq4fDgJr9Ak9ahfpyi_1rDmlTUB0PKa7NUw',
);
export { supabase };
