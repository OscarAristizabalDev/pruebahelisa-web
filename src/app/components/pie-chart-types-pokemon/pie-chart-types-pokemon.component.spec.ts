import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartTypesPokemonComponent } from './pie-chart-types-pokemon.component';

describe('PieChartTypesPokemonComponent', () => {
  let component: PieChartTypesPokemonComponent;
  let fixture: ComponentFixture<PieChartTypesPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieChartTypesPokemonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartTypesPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
