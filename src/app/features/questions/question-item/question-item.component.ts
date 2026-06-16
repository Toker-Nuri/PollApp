import { Component, inject, signal, input, output } from '@angular/core';
import { Question } from '../../../core/interfaces/question.interface';
import { OptionService } from '../../../core/services/option.service';
import { OptionItem } from '../../options/option-item/option-item.component';
import { Option } from '../../../core/interfaces/option.interface';
import { supabase } from '../../../core/services/supabase.client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Displays a single question with all its answer options.
 * Handles option selection and sends the selected option IDs
 * back to the parent component.
 *
 * Inputs:
 * - question: The question data (text, allow_multiple, id).
 * - isPastSurvey: If true, the question is read‑only.
 *
 * Outputs:
 * - selectedChange: Emits the question ID and the selected option IDs.
 *
 * Notes:
 * - Loads options for this question on init.
 * - Listens for new option inserts in realtime (only for this question).
 * - Manages selected options using a signal.
 */

@Component({
  selector: 'app-question-item',
  imports: [OptionItem],
  templateUrl: './question-item.component.html',
  styleUrl: './question-item.component.scss',
})
export class QuestionItem {
  question = input.required<Question>();
  optionService = inject(OptionService);
  options = signal<Option[]>([]);
  private optionChannel: RealtimeChannel | null = null;
  isPastSurvey = input<boolean>(false);
  selectedOptions = signal<string[]>([]);
  selectedChange = output<{ questionId: string; optionIds: string[] }>();

  /**
   * Loads the initial options for this question
   * and starts listening for new option inserts.
   */
  async ngOnInit() {
    const initialOptions = await this.optionService.getOptionsForQuestion(this.question().id);
    this.options.set(initialOptions);
    this.listenForOptionInserts();
  }

  /**
   * Cleans up the realtime subscription when the component is destroyed.
   */
  ngOnDestroy() {
    this.stopListeningForOptionInsert();
  }

  /**
   * Subscribes to realtime option inserts for this specific question.
   * Adds new options to the `options` signal.
   */
  listenForOptionInserts() {
    if (this.optionChannel) {
      this.stopListeningForOptionInsert();
    }
    this.optionChannel = supabase
      .channel(`options-insert-${this.question().id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'options',
          filter: `question_id=eq.${this.question().id}`,
        },
        (payload) => {
          const newOption = payload.new as Option;
          this.options.update((current) => [...current, newOption]);
        },
      )
      .subscribe();
  }

  /**
   * Stops the realtime listener for option inserts.
   * Prevents memory leaks when the component is removed.
   */
  stopListeningForOptionInsert() {
    if (this.optionChannel) {
      supabase.removeChannel(this.optionChannel);
      this.optionChannel = null;
    }
  }

  /**
   * Returns true if the question allows selecting multiple options.
   */
  isMultipleAllowed(): boolean {
    return this.question().allow_multiple === true;
  }

  /**
   * Handles option clicks.
   * Updates the selected options and emits the change to the parent.
   */
  onOptionClicked(optionId: string) {
    if (this.isMultipleAllowed()) {
      this.selectedOptions.update((list) =>
        list.includes(optionId) ? list.filter((id) => id !== optionId) : [...list, optionId],
      );
    } else {
      this.selectedOptions.set([optionId]);
    }
    this.selectedChange.emit({
      questionId: this.question().id,
      optionIds: this.selectedOptions(),
    });
  }
}
