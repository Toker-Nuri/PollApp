import { Component, input } from '@angular/core';
import { PercentagePipe } from '../../../shared/pipes/percentage-pipe';
import { Question } from '../../../core/interfaces/question.interface';
import { Option } from '../../../core/interfaces/option.interface';
import { Vote } from '../../../core/interfaces/vote.interface';

/**
 * Displays the vote results for a single question.
 * Shows each option with its percentage and total vote count.
 *
 * Inputs:
 * - options: The list of options belonging to the question.
 * - localVotes: Temporary votes selected by the user but not yet submitted.
 * - votes: All votes for this question, coming from Supabase (real votes).
 * - question: The question data (optional).
 *
 * Notes:
 * - getTotalVotes() returns real votes + local preview votes.
 * - getVotesPerOption() counts real votes + local preview votes for each option.
 * - Used on the survey detail page to show both live preview and final results.
 */
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
  localVotes = input<string[]>([]);

  /**
   * Returns the total number of votes for this question.
   * It returns real votes + local preview votes.
   */
  getTotalVotes() {
    return this.votes().length + this.localVotes().length;
  }

  /**
   * Counts how many votes belong to a specific answer option.
   * Counts real votes + local preview votes for each option.
   */
  getVotesPerOption(optionId: string) {
    const real = this.votes().filter((v) => v.option_id === optionId).length;
    const local = this.localVotes().filter((id) => id === optionId).length;
    return real + local;
  }

  /**
   * Calculates the percentage of votes for a specific option.
   * Returns 0 if there are no votes.
   */
  computeVotesToPercentages(optionId: string) {
    if (this.getTotalVotes() === 0) {
      return 0;
    }
    return (this.getVotesPerOption(optionId) / this.getTotalVotes()) * 100;
  }
}
