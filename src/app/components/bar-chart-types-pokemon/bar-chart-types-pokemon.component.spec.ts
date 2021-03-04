import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartTypesPokemonComponent } from './bar-chart-types-pokemon.component';

describe('BarChartTypesPokemonComponent', () => {
  let component: BarChartTypesPokemonComponent;
  let fixture: ComponentFixture<BarChartTypesPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarChartTypesPokemonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartTypesPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
