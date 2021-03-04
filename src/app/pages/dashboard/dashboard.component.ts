import { Component, NgModule, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Type } from 'src/app/entities/type';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}
}
