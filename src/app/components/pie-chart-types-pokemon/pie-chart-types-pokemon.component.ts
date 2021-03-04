import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Type } from 'src/app/entities/type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pie-chart-types-pokemon',
  templateUrl: './pie-chart-types-pokemon.component.html',
  styleUrls: ['./pie-chart-types-pokemon.component.scss']
})
export class PieChartTypesPokemonComponent implements OnInit {

  // variable para indicar las opciones del gráfico
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          //const label = ctx.chart.data.labels[ctx.dataIndex];
          //return label;
        },
      },
    }
  };
  // Variables para indicar las demás configuraciones del gráfico
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: [
      '#B4F2DA', '#B4EBF2', '#BBB4F2',
      '#F2B4CC', '#CCF2B4', '#BBF4F2',
      '#9DE198', '#B798E1', '#98E1DC',
      '#A898E1', '#5B9468', '#5B9394',
      '#945B88', '#8D945B', '#946C5B',
      '#945B5D', '#645B94', 'rgba(0,0,255,0.3)',
      'rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)'],
    },
  ];
  // Variable para los tipos de pokemones
  public types : Array<Type>;

  constructor(private pokemonsService: PokemonService, private router: Router) {
    // Se instacia el array de tipos de pokemones
    this.types = [];
  }

  ngOnInit(): void {
    // Se consultan los tipos de pokemones
    this.getTypesPokemon();
  }

  getTypesPokemon(){
    // Se realiza la peticion al servicio para traer todos los tipos de pokemones
    this.pokemonsService.getAllTypesPokemon().subscribe(async (resp: any) =>{
      // Se guarda la respuesta en la variables
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
            // Se envian los labels al gráfico
            this.pieChartLabels.push(respuesta[i].name);
            // Se envian los datos al gráfico
            this.pieChartData.push(data.pokemon.length);
            // Se envian los colores a la grafica
            //this.chartColors.push({backgroundColor: ['#F5FFFB']});
        });
      }
    });
  }
  /**
   * Permite identificar el label en el que se dio click
   * @param e 
   */
  public chartClicked(e: any): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      
      if ( activePoints.length > 0) {
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        const value = chart.data.datasets[0].data[clickedElementIndex];
        console.log(clickedElementIndex, label, value)
        // Se redirecciona la vista de pokemones por tipo
        this.router.navigate(['/pokemones/type/',label]);
      }
    }
  }
}
