import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Type } from 'src/app/entities/type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bar-chart-types-pokemon',
  templateUrl: './bar-chart-types-pokemon.component.html',
  styleUrls: ['./bar-chart-types-pokemon.component.scss']
})
export class BarChartTypesPokemonComponent implements OnInit {

  // variable para indicar la opciones del gráfico
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  // variables para indicar los demás parametrizaciones del gráfico
  public barChartLabels: Label[] = ['Cantidad'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [
    {data:[], label:''}
  ];
  public barChartColors: Color[] = [
    { backgroundColor: '#B4F2DA' },
    { backgroundColor:  '#B4EBF2' },
    { backgroundColor: '#BBB4F2' },
    { backgroundColor: '#F2B4CC' },
    { backgroundColor: '#CCF2B4' },
    { backgroundColor: '#BBF4F2' },
    { backgroundColor: '#9DE198' },
    { backgroundColor: '#B798E1' },
    { backgroundColor: '#98E1DC' },
    { backgroundColor: '#A898E1' },
    { backgroundColor: '#5B9468' },
    { backgroundColor: '#5B9394' },
    { backgroundColor: '#945B88' },
    { backgroundColor: '#8D945B' },
    { backgroundColor: '#946C5B' },
    { backgroundColor: '#945B5D' },
    { backgroundColor: '#645B94' },
    { backgroundColor: 'rgba(0,0,255,0.3)' },
    { backgroundColor: 'rgba(255,0,0,0.3)' },
    { backgroundColor: 'rgba(0,255,0,0.3)' },
  ]
  // Variable para los tipos de pokemones
  public types : Array<Type>;

  constructor(private pokemonsService: PokemonService, private router:Router) {
    // Se instacia el array de tipos de pokemones
    this.types = [];
  }

  ngOnInit(): void {
    // Se consultan los tipos de pokemones
    this.getTypesPokemon();
  }
  /**
   * Permite consultar los tipos de pokemones registrados
   */
  getTypesPokemon(){
    // Se realiza la peticion al servicio para traer todos los tipos de pokemones
    this.pokemonsService.getAllTypesPokemon().subscribe(async (resp: any) =>{
      // Se guarda la respuesta en la variable
      let respuesta = resp.results;
      // Se itera la respuesta que viene siendo los tipos de pokemones existentes
      for (let i = 0; i < respuesta.length; i++) {
        // Se crea una instancia de tipopokemon
        let tipoPokemon = new Type();
        // Se realiza la petición al servicio para trear la cantidad por tipo de pokemon
        this.pokemonsService.getPokemonesType(respuesta[i].name).subscribe((data:any) => {
            // Se guarda el nombre del tipo de pokemon
            tipoPokemon.name = data.name;
            // Se guarda la cantidad que tiene el tipo de pokemon
            tipoPokemon.cantidad += data.pokemon.length;
            // Se envian los datos al gráfico de barras
            this.barChartData.push({data : [data.pokemon.length],label:data.name});
            // Se envian los colores a la grafica
            this.barChartColors.push({backgroundColor:'#F5FFFB'});
        });
      }
    });
  }

  /**
   * Permite identificar el label en el que se dio click
   * @param e 
   */
  public chartClicked(e:any): void {
    if(e.active.length > 0){
      var points = [];
      var pointSelected = e.active[0]._chart.tooltip._model.caretY;
      var legends = e.active[0]._chart.legend.legendItems;

      for (var i = 0; i < e.active.length; ++i) {
        points.push(e.active[i]._model.y);
      }
      
      let position = points.indexOf(pointSelected);
      let label = legends[position+1].text
      // Se redirecciona la vista de pokemones por tipo
      this.router.navigate(['/pokemones/type/',label]);
    }
  }

}
