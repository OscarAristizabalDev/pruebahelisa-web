import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokemonData'
})
export class PokemonDataPipe implements PipeTransform {

  constructor(){}

  transform(url: string): string {
    return ""
  }
}
