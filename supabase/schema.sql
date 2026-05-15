-- ============================================================
-- PollApp Schema – Nuri Toker
-- Im Supabase SQL-Editor ausführen
-- ============================================================

-- Surveys
create table if not exists public.surveys (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Questions
create table if not exists public.questions (
  id         uuid primary key default gen_random_uuid(),
  survey_id  uuid not null references public.surveys(id) on delete cascade,
  text       text not null,
  type       text not null check (type in ('single_choice', 'multiple_choice', 'text')),
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

-- Options (Antwortmöglichkeiten für single/multiple choice)
create table if not exists public.options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  text        text not null,
  position    integer not null default 0
);

-- Responses (eine Einreichung einer Umfrage)
create table if not exists public.responses (
  id         uuid primary key default gen_random_uuid(),
  survey_id  uuid not null references public.surveys(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Response Answers (einzelne Antworten je Frage)
create table if not exists public.response_answers (
  id          uuid primary key default gen_random_uuid(),
  response_id uuid not null references public.responses(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  option_id   uuid references public.options(id) on delete set null,
  text_answer text
);

-- Indizes für Performance
create index if not exists idx_questions_survey_id on public.questions(survey_id);
create index if not exists idx_options_question_id on public.options(question_id);
create index if not exists idx_responses_survey_id on public.responses(survey_id);
create index if not exists idx_response_answers_response_id on public.response_answers(response_id);

-- Auto-Update von updated_at bei surveys
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_survey_updated on public.surveys;
create trigger on_survey_updated
  before update on public.surveys
  for each row execute procedure public.handle_updated_at();

-- Row Level Security aktivieren
alter table public.surveys enable row level security;
alter table public.questions enable row level security;
alter table public.options enable row level security;
alter table public.responses enable row level security;
alter table public.response_answers enable row level security;

-- Öffentliche Lese-Policies (Umfragen sind öffentlich lesbar)
create policy "Surveys sind öffentlich lesbar"
  on public.surveys for select using (true);

create policy "Questions sind öffentlich lesbar"
  on public.questions for select using (true);

create policy "Options sind öffentlich lesbar"
  on public.options for select using (true);

-- Jeder darf Responses und Answers einreichen
create policy "Jeder darf antworten"
  on public.responses for insert with check (true);

create policy "Jeder darf Antworten einreichen"
  on public.response_answers for insert with check (true);

-- Schreib-Policies (z.B. nur authentifizierte Nutzer dürfen Surveys anlegen)
create policy "Authentifizierte Nutzer dürfen Surveys erstellen"
  on public.surveys for insert with check (auth.role() = 'authenticated');

create policy "Authentifizierte Nutzer dürfen Surveys bearbeiten"
  on public.surveys for update using (auth.role() = 'authenticated');

create policy "Authentifizierte Nutzer dürfen Questions erstellen"
  on public.questions for insert with check (auth.role() = 'authenticated');

create policy "Authentifizierte Nutzer dürfen Options erstellen"
  on public.options for insert with check (auth.role() = 'authenticated');
