# PollApp

Entwickelt von **Nuri Toker**

Eine Angular-Anwendung zum Erstellen und Verwalten von Umfragen, mit Supabase als Backend.

## Tech Stack

- **Frontend:** Angular 21 mit SSR
- **Backend/DB:** Supabase (PostgreSQL)
- **Styling:** Bootstrap 5 + SCSS

## Lokale Entwicklung

```bash
npm install
ng serve
```

Die App läuft dann unter `http://localhost:4200/`.

## Build

```bash
ng build
```

## Supabase Setup

1. Supabase-Projekt URL und Anon-Key in `src/environments/environment.ts` eintragen
2. Das SQL-Schema aus `supabase/schema.sql` im Supabase SQL-Editor ausführen

## Tests

```bash
ng test
```
