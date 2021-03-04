import { Ability } from "./ability";
import { Type } from "./type";

export class Pokemon {
    id: string;
    name: string;
    height: number;
    weight: number;
    abilities: Array<Ability>;
    abilitiesConc: string;
    types: Array<Type>;
    typesConc: string;
    imagenSvg: string;
    imagenDefect: string;

    constructor(){
        this.id = "";
        this.name = "";
        this.height = 0;
        this.weight = 0;
        this.abilities = [];
        this.abilitiesConc = "";
        this.types = [];
        this.typesConc = "";
        this.imagenSvg = "";
        this.imagenDefect = "";
    }
}

