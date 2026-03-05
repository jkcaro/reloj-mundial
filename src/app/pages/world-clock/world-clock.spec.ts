import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorldClockComponent } from './world-clock';

describe('WorldClockComponent', () => {
  let component: WorldClockComponent;
  let fixture: ComponentFixture<WorldClockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldClockComponent], // standalone => va en imports
    }).compileComponents();

    fixture = TestBed.createComponent(WorldClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
