import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Moods } from './moods';

describe('Moods', () => {
  let component: Moods;
  let fixture: ComponentFixture<Moods>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moods]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Moods);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
