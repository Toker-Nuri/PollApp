import { Component, input, output } from '@angular/core';

/**
 * Reusable dialog (modal) component.
 * Opens and closes based on the `open` input.
 *
 * Inputs:
 * - open: Controls whether the dialog is visible.
 *
 * Outputs:
 * - openChange: Emits true/false when the dialog is opened or closed.
 *
 * Notes:
 * - Locks the page scroll when the dialog is open.
 * - Only handles UI state; the parent controls when it opens or closes.
 */
@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.scss'],
})
export class Dialog {
  open = input<boolean>(false);
  openChange = output<boolean>();

  /**
   * Closes the dialog and notifies the parent.
   */
  close() {
    this.openChange.emit(false);
  }

  /**
   * Locks or unlocks page scrolling based on dialog visibility.
   */
  ngOnChanges() {
    if (this.open()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
