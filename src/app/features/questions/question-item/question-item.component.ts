import { Component, inject, signal, input, output } from '@angular/core';
import { Question } from '../../../core/interfaces/question.interface';
import { OptionService } from '../../../core/services/option.service';
import { OptionItem } from '../../options/option-item/option-item.component';
import { Option } from '../../../core/interfaces/option.interface';
import { supabase } from '../../../core/services/supabase.client';
import { RealtimeChannel } from '@supabase/supabase-js';

// zeigt eine einzelne frage mit allen antworten an
@Component({
  selector: 'app-question-item',
  imports: [OptionItem],
  templateUrl: './question-item.component.html',
  styleUrl: './question-item.component.scss',
})
export class QuestionItem {
  question = input.required<Question>();
  optionService = inject(OptionService);
  options = signal<Option[]>([]); // antworten fuer diese frage
  private optionChannel: RealtimeChannel | null = null;
  isPastSurvey = input<boolean>(false);
  selectedOptions = signal<string[]>([]); // ausgewaehlte antworten
  selectedChange = output<{ questionId: string; optionIds: string[] }>();

  // beim start antworten laden und echtzeit starten
  async ngOnInit() {
    var initialOptions = await this.optionService.loadOptions(this.question().id);
    this.options.set(initialOptions);
    this.startRealtimeSync();
  }

  // channel beim beenden aufraumen
  ngOnDestroy() {
    this.stopRealtimeSync();
  }

  // echtzeit-updates fuer neue antworten starten
  startRealtimeSync() {
    if (this.optionChannel) {
      this.stopRealtimeSync();
    }

    // auf neue antworten in der datenbank hoeren
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
          // neue antwort zur liste hinzufuegen
          var newOption = payload.new as Option;
          this.options.update((current) => [...current, newOption]);
        },
      )
      .subscribe();
  }

  // echtzeit-updates stoppen
  stopRealtimeSync() {
    if (this.optionChannel) {
      supabase.removeChannel(this.optionChannel);
      this.optionChannel = null;
    }
  }

  // prueft ob mehrere antworten erlaubt sind
  multipleChoice(): boolean {
    return this.question().allow_multiple === true;
  }

  // antwort wurde angeklickt
  optionClick(optionId: string) {
    if (this.multipleChoice()) {
      // mehrere antworten erlaubt - toggle
      this.selectedOptions.update((list) => {
        if (list.includes(optionId)) {
          return list.filter((id) => id !== optionId);
        } else {
          return [...list, optionId];
        }
      });
    } else {
      // nur eine antwort erlaubt
      this.selectedOptions.set([optionId]);
    }

    this.selectedChange.emit({
      questionId: this.question().id,
      optionIds: this.selectedOptions(),
    });
  }
}
