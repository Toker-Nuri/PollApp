import { Component, inject } from '@angular/core';
import { CounterService } from '../counter_service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comp-a',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comp-a.component.html',
  styleUrls: ['./comp-a.component.scss'],
  providers: [CounterService],
})
export class CompA {
  counterService = inject(CounterService);
}
