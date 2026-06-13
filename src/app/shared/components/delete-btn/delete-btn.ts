import { Component, output } from '@angular/core';

// einfacher loeschen-button der ein event ausgibt wenn man draufklickt
@Component({
  selector: 'app-delete-btn',
  imports: [],
  templateUrl: './delete-btn.html',
  styleUrl: './delete-btn.scss',
})
export class DeleteBtn {
  // wird ausgeloest wenn der button geklickt wird
  delete = output<void>();
}
