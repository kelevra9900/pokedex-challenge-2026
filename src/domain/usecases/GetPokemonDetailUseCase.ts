import { injectable } from 'tsyringe';
import type { PokemonRepository } from '../repositories/PokemonRepository';
import type { PokemonDetail } from '../entities/Pokemon';

@injectable()
export class GetPokemonDetailUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute(idOrName: string | number): Promise<PokemonDetail> {
    return this.repository.getPokemonDetail(idOrName);
  }
}
