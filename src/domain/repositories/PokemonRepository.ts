import type { PokemonDetail, PokemonSummary } from '../entities/Pokemon';

export interface PokemonRepository {
  getPokemonList(limit: number, offset: number): Promise<PokemonSummary[]>;
  getCachedPokemonList(limit: number, offset: number): PokemonSummary[] | undefined;
  getPokemonDetail(idOrName: string | number): Promise<PokemonDetail>;
  getCachedPokemonDetail(idOrName: string | number): PokemonDetail | undefined;
}
