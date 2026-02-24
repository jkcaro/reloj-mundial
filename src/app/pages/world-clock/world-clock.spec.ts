import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldClock } from './world-clock';

describe('WorldClock', () => {
  let component: WorldClock;
  let fixture: ComponentFixture<WorldClock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldClock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorldClock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
