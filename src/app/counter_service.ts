import { Injectable } from '@angular/core';

@Injectable()
export class CounterService {
  count = 0;

  increment() {
    this.count++;
  }
}
