import { Routes } from '@angular/router';
import { LandingPage } from '../app/pages/landing-page/landing-page';
import { SurveyPage } from '../app/pages/survey-page/survey-page'


export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'survey/:id',
    component: SurveyPage,
  },
];
