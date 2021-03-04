import { PokemonDataPipe } from './pokemon-data.pipe';

describe('PokemonDataPipe', () => {
  it('create an instance', () => {
    const pipe = new PokemonDataPipe();
    expect(pipe).toBeTruthy();
  });
});
