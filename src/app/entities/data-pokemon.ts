import { Pokemon } from "./pokemon";
import { Result } from "./result";

export class DataPokemon {
    count: number;
    results: Array<Result>;
    pokemones: Array<Pokemon>;

    constructor(){
        this.count = 0;
        this.results = [];
        this.pokemones = [];
    }
}
