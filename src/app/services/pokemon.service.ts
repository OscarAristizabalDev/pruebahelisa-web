import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { DataPokemon } from '../entities/data-pokemon';
import { Pokemon } from '../entities/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  // Variables para indicar el limite y el rango
  private offset = 0;
  private limit = 30;
  private offsetDashboard = 0;
  private limitDashboard = 100;
  // Se indica en false la variebla cargagando
  public cargando = false;

  constructor(private http: HttpClient) { }
  /**
   * Permite enviar los params por la url 
   */
  get params(){
    return{
      offset: this.offset.toString(),
      limit: this.limit.toString()
    }
  }

  /**
   * Permite enviar los params por la url para la consulta de los todos los tipos de pokemon
   */
  get paramsDashboard(){
    return{
      offset: this.offsetDashboard.toString(),
      limit: this.limitDashboard.toString()
    }
  }

  /**
   * Permite consultar los pokemos por intervalo y limite
   */
  public getAll():Observable<DataPokemon>{
    // Si esta cargando no permite hacer mas peticiones
    if(this.cargando){
      return of();
    }
    // pasa al true el carge de información
    this.cargando = true;
    // Se realiza la petición al API para consultar los pokemos
    return this.http.get<DataPokemon>(environment.apiUrl+`/pokemon?`, {
      params: this.params
    })
    .pipe(
      tap(() => {
        // Se aumenta el rango de consulta de los pokemones
        this.offset += 30;
        // Se pasa a false el carge de información
        this.cargando = false;
      })
    )
  }

  /**
   * Permite consultar la información de un Pokemon
   * @param url 
   */
  public getPokemon(url: string){
    return this.http.get(url);
  } 
  /**
   * Permite consultar los puntos de encuentro de un pokemon
   * @param idPokemon 
   */
  public getEncountersPokemon(idPokemon: string){
    return this.http.get(environment.apiUrl+`/pokemon/${idPokemon}/encounters`);
  }

  /**
   * Permite consultar las estadisticas de un pokemon
   * @param idPokemon 
   */
  public getStatisticsPokemon(idPokemon: string){
    return this.http.get(environment.apiUrl+`/pokemon/${idPokemon}/`);
  }

  /**
   * Permite consultar todos los tipos de pokemones
   */
  public getAllTypesPokemon(){
    // Se realiza la petición al API para consultar los pokemos
    return this.http.get(environment.apiUrl+`/type/?`, {
      params: this.paramsDashboard
    })
  }
  
  /**
   * Permite consultar la información por tipo de pokemon
   * @param nameTipoPokemon 
   */
  public getPokemonesType(nameTipoPokemon: string){
    return this.http.get(environment.apiUrl+`/type/${nameTipoPokemon}/`);
  }

}
