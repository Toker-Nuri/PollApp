import { Component, ElementRef, HostListener, input, output, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

// dropdown komponente zum auswaehlen einer kategorie oder option
@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  label = input<string>('');
  options = input<string[]>([]);
  value = input<string | null>(null);
  valueChange = output<string>();
  dropdownRef = viewChild<ElementRef>('dropdownRef');
  isOpen = false; // ist das dropdown gerade offen?
  control = input<FormControl>();

  // dropdown oeffnen oder schliessen
  toggle() {
    this.isOpen = !this.isOpen;
  }

  // button wurde geklickt - event nicht weiter propagieren
  onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggle();
  }

  // wenn man ausserhalb klickt soll das dropdown schliessen
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    var target = event.target as HTMLElement;
    var clickedInside = this.dropdownRef()?.nativeElement.contains(target);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  // eine option wurde ausgewaehlt
  choose(option: string) {
    this.valueChange.emit(option);
    var ctrl = this.control();
    if (ctrl) {
      ctrl.setValue(option);
      ctrl.markAsDirty();
      ctrl.markAsTouched();
    }
    this.isOpen = false;
  }
}
