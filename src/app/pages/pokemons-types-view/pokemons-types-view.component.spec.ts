import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonsTypesViewComponent } from './pokemons-types-view.component';

describe('PokemonsTypesViewComponent', () => {
  let component: PokemonsTypesViewComponent;
  let fixture: ComponentFixture<PokemonsTypesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonsTypesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonsTypesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
