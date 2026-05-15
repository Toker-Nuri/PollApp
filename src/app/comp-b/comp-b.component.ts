import { Component, inject } from '@angular/core';
import { CounterService } from '../counter_service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comp-b',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comp-b.component.html',
  styleUrls: ['./comp-b.component.scss'],
  providers: [CounterService],
})
export class CompB {
  counterService = inject(CounterService);
}
