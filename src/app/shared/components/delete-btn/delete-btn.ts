import { Component, output } from '@angular/core';

/**
 * Reusable delete button component.
 * Emits a delete event when clicked.
 *
 * Notes:
 * - Used across the app for clearing inputs or removing items.
 * - Contains only UI and an output event.
 */
@Component({
  selector: 'app-delete-btn',
  imports: [],
  templateUrl: './delete-btn.html',
  styleUrl: './delete-btn.scss',
})
export class DeleteBtn {
  /**
   * Fired when the delete button is clicked.
   */
  delete = output<void>();
}
