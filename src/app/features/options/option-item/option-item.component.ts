import { Component, inject, input, output, signal } from '@angular/core';
import { Option } from '../../../core/interfaces/option.interface';
import { VoteService } from '../../../core/services/vote.service';

/**
 * Displays a single option inside a question.
 * This component is used on the left side of the survey page.
 *
 * Inputs:
 * - option: The option data (text, id, order_index).
 * - questionId: The ID of the question this option belongs to.
 * - isPastSurvey: If true, the option is disabled and cannot be clicked.
 * - isChecked: Used to show the selected state in the UI.
 *
 * Outputs:
 * - clicked: Emits the option ID when the user selects this option.
 *
 * Notes:
 * - The component does not insert votes directly.
 * - The parent component handles the actual vote submission.
 */

@Component({
  selector: 'app-option-item',
  imports: [],
  templateUrl: './option-item.component.html',
  styleUrl: './option-item.component.scss',
})
export class OptionItem {
  option = input.required<Option>();
  isPastSurvey = input<boolean>(false);
  voteService = inject(VoteService);
  questionId = input.required<string>();
  isChecked = input<boolean>(false);
  clicked = output<string>();

  /**
   * Emits the selected option ID to the parent component.
   * Called when the user clicks on an option.
   */
  submitVote(optionId: string) {
    this.clicked.emit(optionId);
  }
}
