import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type Clock = { city: string; tz: string; time: string };

@Component({
  selector: 'app-world-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-clock.html',
  styleUrl: './world-clock.scss',
})
export class WorldClockComponent implements OnInit, OnDestroy {

  clocks: Clock[] = [
    { city: 'Madrid', tz: 'Europe/Madrid', time: '' },
    { city: 'Bogotá', tz: 'America/Bogota', time: '' },
    { city: 'New York', tz: 'America/New_York', time: '' },
    { city: 'Tokyo', tz: 'Asia/Tokyo', time: '' },
  ];

  private timerId: any;

  ngOnInit(): void {
    this.updateTimes();
    this.timerId = setInterval(() => this.updateTimes(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }

  private updateTimes(): void {
    const now = new Date();
    this.clocks = this.clocks.map(c => ({
      ...c,
      time: new Intl.DateTimeFormat('es-ES', {
        timeZone: c.tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now),
    }));
  }
}
