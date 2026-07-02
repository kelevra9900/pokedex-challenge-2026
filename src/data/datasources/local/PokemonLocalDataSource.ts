import type { PokemonDetail, PokemonSummary } from '../../../domain/entities/Pokemon';

export interface PokemonLocalDataSource {
  getPokemonList(limit: number, offset: number): PokemonSummary[] | undefined;
  savePokemonList(limit: number, offset: number, pokemons: PokemonSummary[]): void;
  getPokemonDetail(idOrName: string | number): PokemonDetail | undefined;
  savePokemonDetail(pokemon: PokemonDetail): void;
}
