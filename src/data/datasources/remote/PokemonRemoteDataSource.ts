import type { PokemonDetailDto } from '../../dto/PokemonDetailDto';
import type { PokemonListDto } from '../../dto/PokemonListDto';

export interface PokemonRemoteDataSource {
  fetchPokemonList(limit: number, offset: number): Promise<PokemonListDto>;
  fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetailDto>;
}
