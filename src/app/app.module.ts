import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';

import { HttpInterceptorService } from './services/http-interceptor.service';
import { PokemonsComponent } from './pages/pokemons/pokemons.component';
import { PokemonDataPipe } from './pipes/pokemon-data.pipe';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BarChartTypesPokemonComponent } from './components/bar-chart-types-pokemon/bar-chart-types-pokemon.component';
import { PieChartTypesPokemonComponent } from './components/pie-chart-types-pokemon/pie-chart-types-pokemon.component';
import { PokemonsTypesViewComponent } from './pages/pokemons-types-view/pokemons-types-view.component';


@NgModule({
  declarations: [
    AppComponent,
    PokemonsComponent,
    PokemonDataPipe,
    NavbarComponent,
    DashboardComponent,
    BarChartTypesPokemonComponent,
    PieChartTypesPokemonComponent,
    PokemonsTypesViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
