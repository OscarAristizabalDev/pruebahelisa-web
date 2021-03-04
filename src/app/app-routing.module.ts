import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PokemonsTypesViewComponent } from './pages/pokemons-types-view/pokemons-types-view.component';
import { PokemonsComponent } from './pages/pokemons/pokemons.component';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'pokemones', component: PokemonsComponent},
  {path: 'pokemones/type/:name', component: PokemonsTypesViewComponent},
  {path: 'pokemones/type', component: DashboardComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
