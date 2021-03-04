import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Ability } from 'src/app/entities/ability';
import { DataPokemon } from 'src/app/entities/data-pokemon';
import { Encounter } from 'src/app/entities/encounter';
import { Pokemon } from 'src/app/entities/pokemon';
import { Result } from 'src/app/entities/result';
import { Type } from 'src/app/entities/type';
import { PokemonService } from 'src/app/services/pokemon.service';
import { NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Statistic } from 'src/app/entities/statistic';

declare var jQuery: any

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.scss']
})
export class PokemonsComponent implements OnInit {

  // variable para el objeto result 
  result: Result;
  // variable para el objeto dataPokemon
  public dataPokemon: DataPokemon;
  // Lista de pokemones
  pokemones: Array<Pokemon>;
  // Variable para el objeto de lugar de encuentro pokemon
  encounterPokemon: Encounter;
  // Variable para almacenar el nombre del pokemon seleccionado
  nombrePokemon: string;
  // Variable para almacenar la imagen del pokemon seleccionado
  imagenPokemon: string
  // Variable para guardar los lugares de encuentro del pokemon
  encountersPokemon: Array<Encounter>;
  // Variable para guardar las estidisticas de un pokemon
  statisticsPokemon: Array<Statistic>; 
  // Variable para guardar los tipos de pokemon
  tipos: any= [];

  // Se captura el evento del scroll
  @HostListener('window:scroll',['$event'])
  onScroll(){
    // Se captura la posición del scroll
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + 1000;
    // Se captura el tamaña maximo del scroll
    const max = (document.documentElement.scrollHeight || document.body.scrollHeight);
    // Si la posición supera el tamaño maximo
    if(pos > max){
      // Si esta cargando no permite que vuelva a cargar datos
      if(this.pokemonsService.cargando){return;}
      // Se realiza nuevamente la consulta de los pokemones
      this.getAll();
    }
  }

  // Se hace referencia al contenedor principal de los pokemones
  @ViewChildren('pokemons')
  pokemon!: QueryList<ElementRef>;

  ngAfterViewInit():void{
    // Se obtiene cada uno de los contenedores que estan en el viewChildren
    this.pokemon.changes.subscribe((pokemones: QueryList<ElementRef>) => { pokemones.forEach(div =>{
      // Se pinta el card de cada pokemon
      this.pintarDiv(div); 
      });
    });
    // Se generan los tipos de pokemones
    this.generarTiposPokemon();
    // Se generan los colores aleatorios para los tipos de pokemones
    this.generarColorAleatorio();

  }

  constructor(public pokemonsService: PokemonService, private modalService: NgbModal, config: NgbModalConfig) 
  {
    // Se instancia el objeto dataPokemon
    this.dataPokemon = new DataPokemon;
    // Se instancia el objeto resulta
    this.result = new Result;
    // Se instancia el array de pokemones
    this.pokemones = [];
    // Se instancia el objeto encuentro pokemon
    this.encounterPokemon = new Encounter();
    // Se inicializa el nombre del pokemon en vacio
    this.nombrePokemon = "";
    // Se inicializa la imagen del pokemon en vacio
    this.imagenPokemon = "";
    // Se inicializa el array de lugares de encuentros del pokemon
    this.encountersPokemon = [];
    // Se inicializa el array de estadisticas del pokemon
    this.statisticsPokemon = [];
    
  }

  ngOnInit(): void {
    this.getAll();
  }
  /**
   * Permite consultar el nombre y la URL de los pokemones
   */
  public getAll(){
    // Se abre el loader
    jQuery.fancybox.showLoading();
    // Se realiza la solicitud al servicio para consultar los pokemones
    this.pokemonsService.getAll().subscribe(resp => {
      // Se almacena la respuesta
      let respuesta = resp.results;
      // Se guarda la cantidad de pokemones
      this.dataPokemon.count = resp.count;
      // Se itera todo el array de results
      for (let i = 0; i < respuesta.length; i++) {
        // Se instancia un nuevo objeto result
        this.result = new Result;
        // Se asginan los valores
        this.result.name = respuesta[i].name;
        this.result.url = respuesta[i].url;
        // Se envia los result a al array de resultados del objeto data pokemon
        this.dataPokemon.results.push(this.result);
        // Se realiza la peticion al servicio para consultar la información del pokemon
        this.pokemonsService.getPokemon(respuesta[i].url).subscribe((data: any) => {
          // Se instacia un nuevo pokemon
          let pokemon = new Pokemon();
          // Se asignan los valores al pokemon
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
          this.dataPokemon.pokemones.push(pokemon);
          // Se cierra el loader
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
        // Se guarda el nombre del punto de encuentro del pokemon
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

  /**
   * Permite pintar los div de los pokemones por grupo
   */
  public pintarDiv(div:any){
    // Se iteran los tipos de pokemones
    for (let i = 0; i < this.tipos.length; i++) {
      // Si el nombre del tipo de pokemon es igual al id del elemento que se esta iterando 
      if(this.tipos[i].name == div.nativeElement.id){
        // Se le asigna un mismo colocor a esos div con el mismo tipo de pokemon
        div.nativeElement.style.background = '#'+this.tipos[i].color;
      }
    }
  }

  /**
   * Permite generar un color aleatorio
   */
  public generarColorAleatorio(){
    // Se iteran los tipos de pokemones
    for (let i = 0; i < this.tipos.length; i++) {
      // Se asinga un color aleatoria a cada tipo de pokemon
      this.tipos[i].color =  Math.floor(Math.random()*16777215).toString(16);
    }
  }

  /**
   * Permite generar un arreglo con las combinaciones de los pokemones
   */
  public generarTiposPokemon()
  {
    this.tipos = [
      {name:"grasspoison", "color": ""},
      {name:"fire", "color": ""},
      {name:"water", "color": ""},
      {name:"bugpoison", "color": ""},
      {name:"fireflying", "color": ""},
      {name:"ground", "color": ""},
      {name:"poison", "color": ""},
      {name:"normalflying", "color": ""},
      {name:"electric", "color": ""},
      {name:"normal", "color": ""},
      {name:"bug", "color": ""},
      {name:"bugflying", "color": ""},
      {name:"normalflying", "color": ""},
      {name:"poisonground", "color": ""},
      {name:"normalfairy", "color": ""},
      {name:"poisonflying", "color": ""},
      {name:"buggrass", "color": ""},
      {name:"fairy", "color": ""},
      {name:"fighting", "color": ""},
      {name:"psychic", "color": ""},
      {name:"rockground", "color": ""},
      {name:"waterice", "color": ""},
      {name:"electricsteel", "color": ""},
      {name:"waterpsychic", "color": ""},
      {name:"grasspsychic", "color": ""},
      {name:"ghostpoison", "color": ""},
      {name:"groundrock", "color": ""},
      {name:"psychicfire", "color": ""},
      {name:"dragonflying", "color": ""},
      {name:"icepsychic", "color": ""},
      {name:"waterfighting", "color": ""},
      {name:"waterpoison", "color": ""},
      {name:"psychicfairy", "color": ""},
      {name:"grass", "color": ""},
      {name:"electricflying", "color": ""},
      {name:"dragon", "color": ""},
      {name:"rockwater", "color": ""},
      {name:"iceflying", "color": ""},
      {name:"rockflying", "color": ""},
      {name:"waterflying", "color": ""},
      {name:"psychicflying", "color": ""},
      {name:"waterflying", "color": ""},
      {name:"waterelectric", "color": ""},
      {name:"rock", "color": ""},
      {name:"grassflying", "color": ""},
      {name:"fairyflying", "color": ""},
      {name:"waterfairy", "color": ""},
      {name:"dark", "color": ""},
      {name:"bugsteel", "color": ""},
      {name:"ghost", "color": ""},
      {name:"waterdragon", "color": ""},
      {name:"waterground", "color": ""},
      {name:"darkflying", "color": ""},
      {name:"groundflying", "color": ""},
      {name:"steelground", "color": ""},
      {name:"darkfire", "color": ""},
      {name:"firerock", "color": ""},
      {name:"darkice", "color": ""},
      {name:"darkice", "color": ""},
      {name:"normalpsychic", "color": ""},
      {name:"steelflying", "color": ""},
      {name:"firefighting", "color": ""},
      {name:"bugrock", "color": ""},
      {name:"iceground", "color": ""},
      {name:"waterrock", "color": ""},
      {name:"bugfighting", "color": ""},
      {name:"rockdark", "color": ""},
      {name:"watergrass", "color": ""},
      {name:"psychicgrass", "color": ""},
      {name:"grassdark", "color": ""},
      {name:"grassfighting", "color": ""},
      {name:"bugwater", "color": ""},
      {name:"bugghost", "color": ""},
      {name:"bugground", "color": ""},
      {name:"darkghost", "color": ""},
      {name:"fightingpsychic", "color": ""},
      {name:"steelrock", "color": ""},
      {name:"grounddragon", "color": ""},
      {name:"waterdark", "color": ""},
      {name:"steelfairy", "color": ""},
      {name:"fireground", "color": ""},
    ]
  }

}
