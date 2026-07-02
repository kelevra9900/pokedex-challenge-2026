import { GetPokemonListUseCase } from '../GetPokemonListUseCase';
import type { PokemonRepository } from '../../repositories/PokemonRepository';
import type { PokemonSummary } from '../../entities/Pokemon';

function createFakeRepository(list: PokemonSummary[]): PokemonRepository {
  return {
    getPokemonList: jest.fn().mockResolvedValue(list),
    getCachedPokemonList: jest.fn(),
    getPokemonDetail: jest.fn(),
    getCachedPokemonDetail: jest.fn(),
  };
}

describe('GetPokemonListUseCase', () => {
  it('delegates limit/offset params to the repository and returns its result', async () => {
    const expected: PokemonSummary[] = [
      { id: 1, name: 'bulbasaur', imageUrl: 'https://x/1.png', types: ['grass'] },
    ];
    const repository = createFakeRepository(expected);
    const useCase = new GetPokemonListUseCase(repository);

    const result = await useCase.execute({ limit: 20, offset: 0 });

    expect(repository.getPokemonList).toHaveBeenCalledWith(20, 0);
    expect(result).toEqual(expected);
  });
});
