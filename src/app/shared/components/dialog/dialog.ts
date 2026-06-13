import { Component, input, output } from '@angular/core';

// ein dialog/modal fenster
// wird geoeffnet oder geschlossen je nach dem "open" input
@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.scss'],
})
export class Dialog {
  open = input<boolean>(false);
  openChange = output<boolean>();

  // dialog schliessen und dem parent bescheid geben
  closeDialog() {
    this.openChange.emit(false);
  }

  // wenn sich open aendert soll scrollen blockiert werden
  ngOnChanges() {
    if (this.open()) {
      // scrollen verhindern wenn dialog offen ist
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
