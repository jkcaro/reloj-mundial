import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldClockComponent } from './world-clock';
import { obtenerHoraZona } from './js/reloj';

describe('WorldClock', () => {
  let component: WorldClockComponent;
  let fixture: ComponentFixture<WorldClockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldClockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorldClockComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read the current time in the selected time zone', () => {
    const ahora = new Date();
    const esperado = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Madrid',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(ahora);

    const h = Number(esperado.find((p) => p.type === 'hour')?.value ?? 0);
    const m = Number(esperado.find((p) => p.type === 'minute')?.value ?? 0);
    const s = Number(esperado.find((p) => p.type === 'second')?.value ?? 0);

    const actual = obtenerHoraZona('Europe/Madrid');

    expect(actual.h).toBe(h);
    expect(actual.m).toBe(m);
    expect(actual.s).toBeGreaterThanOrEqual(0);
  });
});
