import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CounterService } from './counter_service';
import { CompA } from './comp-a/comp-a.component';
import { CompB } from './comp-b/comp-b.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CompA, CompB],
  providers: [CounterService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'PollApp';
  counterService = inject(CounterService);
}
