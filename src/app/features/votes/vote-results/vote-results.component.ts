import { Component, input } from '@angular/core';
import { PercentagePipe } from '../../../shared/pipes/percentage-pipe';
import { Question } from '../../../core/interfaces/question.interface';
import { Option } from '../../../core/interfaces/option.interface';
import { Vote } from '../../../core/interfaces/vote.interface';

// zeigt die ergebnisse einer frage als balken an
@Component({
  selector: 'app-vote-results',
  imports: [PercentagePipe],
  standalone: true,
  templateUrl: './vote-results.component.html',
  styleUrl: './vote-results.component.scss',
})
export class VoteResults {
  options = input.required<Option[]>();
  votes = input.required<Vote[]>();
  question = input<Question | null>(null);
  localVotes = input<string[]>([]); // noch nicht gespeicherte stimmen

  // wie viele stimmen gibt es insgesamt
  totalVotes() {
    var echteStimmen = this.votes().length;
    var lokaleStimmen = this.localVotes().length;
    return echteStimmen + lokaleStimmen;
  }

  // wie viele stimmen hat eine bestimmte antwort
  votesForOption(optionId: string) {
    var real = this.votes().filter((v) => v.option_id === optionId).length;
    var local = this.localVotes().filter((id) => id === optionId).length;
    return real + local;
  }

  // prozentwert fuer eine antwort berechnen
  toPercent(optionId: string) {
    if (this.totalVotes() === 0) {
      return 0;
    }
    return (this.votesForOption(optionId) / this.totalVotes()) * 100;
  }
}
