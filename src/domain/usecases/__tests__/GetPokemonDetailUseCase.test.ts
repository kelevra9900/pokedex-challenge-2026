import { GetPokemonDetailUseCase } from '../GetPokemonDetailUseCase';
import type { PokemonRepository } from '../../repositories/PokemonRepository';
import type { PokemonDetail } from '../../entities/Pokemon';

const mockDetail: PokemonDetail = {
  id: 25,
  name: 'pikachu',
  imageUrl: 'https://img/25.png',
  height: 4,
  weight: 60,
  types: ['electric'],
  abilities: ['static', 'lightning-rod'],
  stats: [{ name: 'hp', baseStat: 35 }],
  shinyImageUrl: 'https://img/25-shiny.png',
  baseExperience: 112,
  moves: ['thunder-shock'],
  gameVersions: ['red', 'blue'],
  heldItems: [],
};

function createFakeRepository(detail: PokemonDetail): PokemonRepository {
  return {
    getPokemonList: jest.fn(),
    getCachedPokemonList: jest.fn(),
    getPokemonDetail: jest.fn().mockResolvedValue(detail),
    getCachedPokemonDetail: jest.fn(),
  };
}

describe('GetPokemonDetailUseCase', () => {
  it('delegates idOrName to the repository and returns its result', async () => {
    const repository = createFakeRepository(mockDetail);
    const useCase = new GetPokemonDetailUseCase(repository);

    const result = await useCase.execute(25);

    expect(repository.getPokemonDetail).toHaveBeenCalledWith(25);
    expect(result).toEqual(mockDetail);
  });

  it('accepts a string id (name)', async () => {
    const repository = createFakeRepository(mockDetail);
    const useCase = new GetPokemonDetailUseCase(repository);

    const result = await useCase.execute('pikachu');

    expect(repository.getPokemonDetail).toHaveBeenCalledWith('pikachu');
    expect(result).toEqual(mockDetail);
  });

  it('propagates errors thrown by the repository', async () => {
    const repository: PokemonRepository = {
      getPokemonList: jest.fn(),
      getCachedPokemonList: jest.fn(),
      getPokemonDetail: jest.fn().mockRejectedValue(new Error('Network error')),
      getCachedPokemonDetail: jest.fn(),
    };
    const useCase = new GetPokemonDetailUseCase(repository);

    await expect(useCase.execute(1)).rejects.toThrow('Network error');
  });
});
