import { Component, inject, output, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { SurveyService } from '../../core/services/survey.service';
import { QuestionService } from '../../core/services/question.service';
import { OptionService } from '../../core/services/option.service';
import { Router } from '@angular/router';
import { CreateSurvey } from '../../features/surveys/create-survey/create-survey.component';
import { CreateQuestion } from '../../features/questions/create-question/create-question.component';
import { ChangeDetectorRef } from '@angular/core';

// seite zum erstellen einer neuen umfrage
// hier werden umfrage, fragen und antworten angelegt
@Component({
  selector: 'app-survey-create-page',
  imports: [ReactiveFormsModule, CreateSurvey, CreateQuestion],
  templateUrl: './survey-create-page.html',
  styleUrl: './survey-create-page.scss',
})
export class SurveyCreatePage {
  surveyService = inject(SurveyService);
  questionService = inject(QuestionService);
  optionService = inject(OptionService);
  router = inject(Router);
  close = output<void>();

  showPublished: boolean = false; // zeigt den "veroeffentlicht" overlay
  isSaving: boolean = false; // zeigt ladeanimation
  newSurveyId: number | null = null; // id der gerade erstellten umfrage

  constructor(private cd: ChangeDetectorRef) {}

  @ViewChild('createSurvey') createSurveyComp!: CreateSurvey;
  @ViewChildren(CreateQuestion) questionComps!: QueryList<CreateQuestion>;

  // das hauptformular fuer die umfrage
  myForm = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required],
    }),
    description: new FormControl(''),
    end_date: new FormControl(''),
    is_published: new FormControl(false),
    category: new FormControl('', {
      validators: [Validators.required],
    }),
    questions: new FormArray([]),
  });

  // beim start erste frage hinzufuegen
  ngOnInit() {
    this.addNewQuestion();
  }

  // zugriff auf die fragen im formular
  get questionsList() {
    return this.myForm.get('questions') as FormArray;
  }

  // eine neue frage hinzufuegen
  addNewQuestion() {
    var question = new FormGroup({
      order_index: new FormControl(this.questionsList.length + 1),
      text: new FormControl('', Validators.required),
      allow_multiple: new FormControl(false),
      options: new FormArray([]),
    });

    this.questionsList.push(question);

    var questionIndex = this.questionsList.length - 1;
    // zwei leere antwortfelder hinzufuegen
    this.addNewOption(questionIndex);
    this.addNewOption(questionIndex);
  }

  // eine frage loeschen oder leeren wenn es die letzte ist
  removeQuestion(index: number) {
    if (this.questionsList.length <= 1) {
      // letzte frage nicht loeschen sondern nur leeren
      var question = this.questionsList.at(index);
      question.get('text')?.setValue('');
      return;
    }

    this.questionsList.removeAt(index);

    // reihenfolge neu berechnen
    this.questionsList.controls.forEach((q, i) => {
      q.get('order_index')?.setValue(i + 1);
    });
  }

  // antwort-array einer frage holen
  getOptionsArray(questionIndex: number) {
    return this.questionsList.at(questionIndex).get('options') as FormArray;
  }

  // neue antwort zu einer frage hinzufuegen (max 6)
  addNewOption(questionIndex: number) {
    var optionsArr = this.getOptionsArray(questionIndex);

    if (optionsArr.length >= 6) {
      return; // maximal 6 antworten erlaubt
    }

    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
    var option = new FormGroup({
      text: new FormControl('', Validators.required),
      order_index: new FormControl(alphabet[optionsArr.length]),
    });

    optionsArr.push(option);
  }

  // eine antwort loeschen oder leeren wenn nur zwei uebrig sind
  removeOption(questionIndex: number, optionIndex: number) {
    var optionsArr = this.getOptionsArray(questionIndex);
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];

    if (optionsArr.length <= 2) {
      // weniger als 2 antworten soll es nicht geben
      var option = optionsArr.at(optionIndex);
      option.get('text')?.setValue('');
      return;
    }

    optionsArr.removeAt(optionIndex);

    // buchstaben neu vergeben
    optionsArr.controls.forEach((o, i) => {
      o.get('order_index')?.setValue(alphabet[i]);
    });
  }

  // umfrage pruefen und abschicken
  async publishSurvey() {
    if (!this.formIsValid()) {
      return;
    }

    this.isSaving = true;

    var formValue = this.prepareData(this.myForm.value);
    formValue.is_published = true;

    // erst umfrage speichern dann fragen und antworten
    var survey = await this.surveyService.saveSurvey(formValue);
    await this.saveAll(formValue.questions, survey.id);

    this.newSurveyId = survey.id;
    this.showDoneScreen();
  }

  // ladeanimation und dann erfolgs-overlay zeigen
  private showDoneScreen() {
    setTimeout(() => {
      this.isSaving = false;
      this.showPublished = true;
      this.cd.detectChanges();

      setTimeout(() => {
        this.goToSurvey(this.newSurveyId!);
      }, 1000);
    }, 350);
  }

  // prueft ob das formular gueltig ist
  private formIsValid(): boolean {
    if (this.myForm.valid) {
      return true;
    }

    this.myForm.markAllAsTouched();
    this.showErrors();
    return false;
  }

  // leere felder auf null setzen fuer die datenbank
  private prepareData(value: any) {
    return {
      ...value,
      end_date: value.end_date || null,
      description: value.description || null,
    };
  }

  // alle fragen und antworten in die datenbank speichern
  private async saveAll(questions: any[], surveyId: number) {
    for (var q of questions) {
      var question = await this.questionService.saveQuestion(q, surveyId);

      for (var o of q.options) {
        await this.optionService.saveOption(o, question.id);
      }
    }
  }

  // erfolgs-overlay schliessen und weiterleiten
  closeDoneScreen() {
    this.showPublished = false;
    this.goToSurvey(this.newSurveyId!);
  }

  // zur umfrage-seite navigieren
  goToSurvey(id: number) {
    this.router.navigate(['/survey', id]);
  }

  // modal schliessen und formular zuruecksetzen
  closeModal() {
    this.myForm.reset();
    this.createSurveyComp.clearTitleError();
    this.createSurveyComp.clearCat();
    this.questionComps.forEach((c) => {
      c.clearErrors();
    });
    this.close.emit();
  }

  // alle fehler auf einmal anzeigen
  showErrors() {
    this.createSurveyComp.showErrors();
    this.questionComps.forEach((c) => {
      c.showErrors();
    });
  }

  // hilfsfunktion um das options-array einer frage zu holen
  getOptionsList(q: AbstractControl): FormArray {
    return q.get('options') as FormArray;
  }

  // datum leeren
  clearDate() {
    this.myForm.get('end_date')!.setValue('');
  }

  // titel leeren
  clearTitle() {
    this.myForm.get('title')!.setValue('');
  }

  // beschreibung leeren
  clearDesc() {
    this.myForm.get('description')!.setValue('');
  }

  // form controls als getter damit wir sie im template nutzen koennen
  get nameControl(): FormControl {
    return this.myForm.get('title') as FormControl;
  }

  get dateControl(): FormControl {
    return this.myForm.get('end_date') as FormControl;
  }

  get infoControl(): FormControl {
    return this.myForm.get('description') as FormControl;
  }

  get catControl(): FormControl {
    return this.myForm.get('category') as FormControl;
  }
}
