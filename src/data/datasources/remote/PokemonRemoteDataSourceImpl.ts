import type { AxiosInstance } from 'axios';
import type { PokemonRemoteDataSource } from './PokemonRemoteDataSource';
import type { PokemonDetailDto } from '../../dto/PokemonDetailDto';
import type { PokemonListDto } from '../../dto/PokemonListDto';

export class PokemonRemoteDataSourceImpl implements PokemonRemoteDataSource {
  constructor(private readonly http: AxiosInstance) {}

  async fetchPokemonList(limit: number, offset: number): Promise<PokemonListDto> {
    const { data } = await this.http.get<PokemonListDto>('/pokemon', {
      params: { limit, offset },
    });
    return data;
  }

  async fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetailDto> {
    const { data } = await this.http.get<PokemonDetailDto>(`/pokemon/${idOrName}`);
    return data;
  }
}
