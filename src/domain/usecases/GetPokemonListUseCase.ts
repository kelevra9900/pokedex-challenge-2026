import { injectable } from 'tsyringe';
import type { PokemonRepository } from '../repositories/PokemonRepository';
import type { PokemonSummary } from '../entities/Pokemon';

export interface GetPokemonListParams {
  limit: number;
  offset: number;
}

@injectable()
export class GetPokemonListUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute({ limit, offset }: GetPokemonListParams): Promise<PokemonSummary[]> {
    return this.repository.getPokemonList(limit, offset);
  }
}
