import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ability } from 'src/app/entities/ability';
import { Encounter } from 'src/app/entities/encounter';
import { Pokemon } from 'src/app/entities/pokemon';
import { Statistic } from 'src/app/entities/statistic';
import { Type } from 'src/app/entities/type';
import { PokemonService } from 'src/app/services/pokemon.service';
import { NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

declare var jQuery: any

@Component({
  selector: 'app-pokemons-types-view',
  templateUrl: './pokemons-types-view.component.html',
  styleUrls: ['./pokemons-types-view.component.scss']
})
export class PokemonsTypesViewComponent implements OnInit {

  // Variable para almacenar el listado de pokemons
  pokemones : Array<Pokemon>;
  // Variable para almacenar el nombre del pokemon seleccionado
  nombrePokemon: string;
  // Variable para almacenar la imagen del pokemon seleccionado
  imagenPokemon: string
  // Variable para guardar los lugares de encuentro del pokemon
  encountersPokemon: Array<Encounter>;
  // Variable para guardar las estidisticas de un pokemon
  statisticsPokemon: Array<Statistic>; 

  constructor(private pokemonsService: PokemonService ,private modalService: NgbModal, private activatedRoute: ActivatedRoute, private router: Router) {
    // Se instancia el array de pokemones
    this.pokemones = [];
     // Se inicializa el nombre del pokemon en vacio
     this.nombrePokemon = "";
     // Se inicializa la imagen del pokemon en vacio
     this.imagenPokemon = "";
     // Se inicializa el array de lugares de encuentros del pokemon
     this.encountersPokemon = [];
     // Se inicializa el array de estadisticas del pokemon
     this.statisticsPokemon = [];
    // Permite recibir los parametros enviados por la url
    this.activatedRoute.params.subscribe(params => {
      // Se valida que venga el id del usuario por la url
      if(typeof params.name !== 'undefined'){
        // Se consultan las publicaciones del usuario 
        this.loadPokemones(params.name);
      }
    }) 

  }

  ngOnInit(): void {
  }

  /**
   * Permite consultar el listado de pokemones por tipo
   * @param tipoPokemon 
   */
  private loadPokemones(nameTipoPokemon: string){
    // Se abre el loader
    jQuery.fancybox.showLoading();
    // Se realiza la solicitud al servicio para consultar los pokemones por tipoo
    this.pokemonsService.getPokemonesType(nameTipoPokemon).subscribe((resp: any) => {
      // Se guarda la información de los pokemones en la variable respuesta
      let respuesta= resp.pokemon;
      // Se itera todo el array con la información de pokemones por tipo
      for (let i = 0; i < respuesta.length; i++) {
        // Se realiza la peticion al servicio para consultar la información del pokemon
        this.pokemonsService.getPokemon(respuesta[i].pokemon.url).subscribe((data: any) => {
          // Por cada iteración se crea un nuevo pokemon
          let pokemon = new Pokemon();
          pokemon.id = data.id
          pokemon.name = data.name;
          pokemon.weight = data.weight;
          pokemon.height = data.height;
          pokemon.imagenSvg = data.sprites.other['dream_world'].front_default;
          pokemon.imagenDefect =  data.sprites.other['official-artwork'].front_default;
          pokemon.abilitiesConc = "";
          // Se recorren el array de habilitades del pokemon
          for (let i = 0; i < data.abilities.length; i++) {
            // Se instancia un objeto de tipo habilidad
            let abilityPokemon = new Ability();
            // Se guarda el nombre del pokemon
            abilityPokemon.name = data.abilities[i]['ability'].name;
            // Se concatenan las habilidades del pokemon
            pokemon.abilitiesConc =  pokemon.abilitiesConc +", " +  data.abilities[i]['ability'].name;
            // Se guardan las habilides del pokemon
            pokemon.abilities.push(abilityPokemon);
          }
          // se recorre el array de tipos del pokemon
          for (let i = 0; i < data.types.length; i++) {
            // Se instancia un nuevo objeto de typo pokemon
            let typePokemon = new Type();
            // Se guarda el nombre del pokemon
            typePokemon.name = data.types[i]['type'].name;
            // Se concatena los tipos del pokemon
            pokemon.typesConc = pokemon.typesConc+data.types[i]['type'].name
            // Se guardan los typos del pokemon
            pokemon.types.push(typePokemon);
          }
          // Se envia el pokemon al array
          this.pokemones.push(pokemon);
          // Se cierra el loader
          jQuery.fancybox.hideLoading();
        }, (error) => {
          jQuery.fancybox.hideLoading();
        });
      }
    });
  }
  /**
   * Permite consultar los puntos de encuentro de un pokemon y sus estadisticas
   * @param idPokemon 
   * @param namePokemon 
   */
  public getStatisticsEncountersPokemon(idPokemon: string, namePokemon: string, imagenPokemon: string,modalDetallePokemon:any){
    // Se muestra el loader
    jQuery.fancybox.showLoading();
    // Se guarda el nombre del pokemon
    this.nombrePokemon = namePokemon;
    // Se guarda la imagen del pokemon
    this.imagenPokemon = imagenPokemon;
    // Se consultan las estadisticas del pokemon
    this.getStatisticsPokemon(idPokemon);
    // Se consultas los puntos de encuentro del pokemon
    this.getEncountersPokemon(idPokemon, modalDetallePokemon); 
  }

  /**
   * Permite consultar los lugares de encuentro del pokemon
   * @param idPokemon 
   * @param namePokemon 
   * @param detallePokemon 
   */
  public getEncountersPokemon(idPokemon: string, modalDetallePokemon:any){
    // Se inicializa el array de lugares de encuentro del pokemon
    this.encountersPokemon = [];
    // Se realiza la peticion al servicio para consultar los puntos de encuentro del pokemon
    this.pokemonsService.getEncountersPokemon(idPokemon).subscribe((data : any) =>{
      // Se guarda la respuesta en la variable encounters
      let encounters = data;
      // Se itera la respuesta
      for (let j = 0; j < encounters.length; j++) {
        // Se crea un nuevo objeto de tipo encounter
        let encounter = new Encounter();
        // Se accede al listado actual de pokemones
        encounter.name = encounters[j].location_area.name;
        // se envian los puntos de encuentro al pokemon actual
        this.encountersPokemon.push(encounter);
      }
      // Se abre la modal
      this.modalService.open(modalDetallePokemon, { size: 'lg', backdropClass: 'light-blue-backdrop'});
      // Se cierra el loader
      jQuery.fancybox.hideLoading();
    });
  }

  /**
   * Permite consultar los estadisticas del pokemon
   * @param idPokemon 
   */
  public getStatisticsPokemon(idPokemon: string){
    // Se inicializa el array de estadisticas del pokemon
    this.statisticsPokemon = [];
    // Se realiza la peticion al servicio para consultar las estadisticas del pokemon
    this.pokemonsService.getStatisticsPokemon(idPokemon).subscribe((resp: any) => {
      // Se guarda la respuesta en la variables statistics
      let statistics = resp;
      // Se itera la respuesta
      for (let i = 0; i < statistics.stats.length; i++) {
        // Se crea un nuevo objeto de tipo estadistica
        let statistic = new Statistic();       
        // Se guarda el base_stat del pokemon
        statistic.baseStat = statistics.stats[i].base_stat;
        // Se guarda el nombre de la estadistica del pokemon
        statistic.name = statistics.stats[i].stat.name;
        // Se calcula el currentRate del pokemon
        statistic.currentRate = statistic.baseStat / 10; 
        // Se guardan las estidisticas del pokemon
        this.statisticsPokemon.push(statistic);
      }
    })
  }

}
