import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// hier wird die angular app gestartet
bootstrapApplication(App, appConfig).catch((err) => console.log('Fehler beim starten:', err));
