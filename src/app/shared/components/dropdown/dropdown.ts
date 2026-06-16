import { Component, ElementRef, HostListener, input, output, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Reusable dropdown component.
 * Displays a list of options and lets the user pick one.
 *
 * Inputs:
 * - label: Text shown above the dropdown.
 * - options: The list of selectable values.
 * - value: The currently selected value.
 * - control: Optional FormControl to sync the selection with a form.
 *
 * Outputs:
 * - valueChange: Emits the selected option when the user picks one.
 *
 * Notes:
 * - Handles opening/closing the dropdown.
 * - Closes automatically when clicking outside.
 * - Updates the connected FormControl if provided.
 */
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
  isCategoriesOpen = false;
  control = input<FormControl>();

  /**
   * Toggles the dropdown open/closed.
   */
  toggleDropdown() {
    this.isCategoriesOpen = !this.isCategoriesOpen;
  }

  /**
   * Opens the dropdown without letting the click
   * bubble up to the document click listener.
   */
  onTriggerClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggleDropdown();
  }

  /**
   * Closes the dropdown when clicking anywhere outside of it.
   */
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = this.dropdownRef()?.nativeElement.contains(target);
    if (!clickedInside) {
      this.isCategoriesOpen = false;
    }
  }

  /**
   * Selects an option, emits the value, and updates the FormControl if present.
   */
  select(option: string) {
    this.valueChange.emit(option);
    const control = this.control();
    if (control) {
      control.setValue(option);
      control.markAsDirty();
      control.markAsTouched();
    }
    this.isCategoriesOpen = false;
  }
}
