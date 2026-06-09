import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// das ist die haupt-komponente der app
// alle anderen seiten werden hier reingeladen
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('PollApp');
}
