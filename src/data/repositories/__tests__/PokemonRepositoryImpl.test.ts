import { PokemonRepositoryImpl } from '../PokemonRepositoryImpl';
import type { PokemonRemoteDataSource } from '../../datasources/remote/PokemonRemoteDataSource';
import type { PokemonLocalDataSource } from '../../datasources/local/PokemonLocalDataSource';
import type { PokemonListDto } from '../../dto/PokemonListDto';
import type { PokemonDetailDto } from '../../dto/PokemonDetailDto';
import type { PokemonSummary } from '../../../domain/entities/Pokemon';

const listDto: PokemonListDto = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

function makeDetailDto(id: number, name: string): PokemonDetailDto {
  return {
    id,
    name,
    height: 7,
    weight: 69,
    base_experience: 64,
    sprites: {
      front_default: null,
      other: {
        'official-artwork': {
          front_default: `https://artwork/${id}.png`,
          front_shiny: null,
        },
      },
    },
    types: [{ slot: 1, type: { name: 'grass', url: '' } }],
    abilities: [{ ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 }],
    stats: [{ stat: { name: 'hp', url: '' }, base_stat: 45, effort: 0 }],
    moves: [],
    game_indices: [],
    held_items: [],
  };
}

function makeLocalSource(overrides: Partial<PokemonLocalDataSource> = {}): PokemonLocalDataSource {
  return {
    getPokemonList: jest.fn(),
    savePokemonList: jest.fn(),
    getPokemonDetail: jest.fn(),
    savePokemonDetail: jest.fn(),
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────
// getPokemonList — happy path
// ─────────────────────────────────────────────────────────────────
describe('PokemonRepositoryImpl.getPokemonList', () => {
  it('writes through to the local datasource after a successful remote fetch', async () => {
    const remote: PokemonRemoteDataSource = {
      fetchPokemonList: jest.fn().mockResolvedValue(listDto),
      fetchPokemonDetail: jest.fn().mockImplementation((idOrName: string | number) => {
        const id = typeof idOrName === 'number' ? idOrName : 1;
        return Promise.resolve(makeDetailDto(id, String(idOrName)));
      }),
    };
    const local = makeLocalSource();

    const repository = new PokemonRepositoryImpl(remote, local);
    const result = await repository.getPokemonList(20, 0);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 1, name: 'bulbasaur', types: ['grass'] });
    expect(local.savePokemonList).toHaveBeenCalledWith(20, 0, result);
    expect(local.savePokemonDetail).toHaveBeenCalledTimes(2);
  });
});

// ─────────────────────────────────────────────────────────────────
// getPokemonList — partial failure (allSettled resilience)
// ─────────────────────────────────────────────────────────────────
describe('PokemonRepositoryImpl.getPokemonList — partial fetch failure', () => {
  it('returns the base entry without types when one detail fetch fails', async () => {
    const remote: PokemonRemoteDataSource = {
      fetchPokemonList: jest.fn().mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
      }),
      fetchPokemonDetail: jest.fn().mockRejectedValue(new Error('Network timeout')),
    };
    const local = makeLocalSource();

    const repository = new PokemonRepositoryImpl(remote, local);
    const result = await repository.getPokemonList(20, 0);

    // Should not throw; fallen-back entry has id/name but empty types
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].types).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────
// getCachedPokemonList
// ─────────────────────────────────────────────────────────────────
describe('PokemonRepositoryImpl.getCachedPokemonList', () => {
  it('returns undefined when no cache entry exists', () => {
    const remote: PokemonRemoteDataSource = {
      fetchPokemonList: jest.fn(),
      fetchPokemonDetail: jest.fn(),
    };
    const local = makeLocalSource({ getPokemonList: jest.fn().mockReturnValue(undefined) });

    const repository = new PokemonRepositoryImpl(remote, local);
    expect(repository.getCachedPokemonList(20, 0)).toBeUndefined();
  });

  it('invalidates a cached page that contains Pokémon with empty types', () => {
    const incompleteList: PokemonSummary[] = [
      { id: 1, name: 'bulbasaur', imageUrl: 'https://img/1.png', types: [] },
    ];
    const local = makeLocalSource({ getPokemonList: jest.fn().mockReturnValue(incompleteList) });
    const remote: PokemonRemoteDataSource = {
      fetchPokemonList: jest.fn(),
      fetchPokemonDetail: jest.fn(),
    };

    const repository = new PokemonRepositoryImpl(remote, local);
    expect(repository.getCachedPokemonList(20, 0)).toBeUndefined();
  });

  it('returns the cached page when all entries have types', () => {
    const completeList: PokemonSummary[] = [
      { id: 1, name: 'bulbasaur', imageUrl: 'https://img/1.png', types: ['grass'] },
    ];
    const local = makeLocalSource({ getPokemonList: jest.fn().mockReturnValue(completeList) });
    const remote: PokemonRemoteDataSource = {
      fetchPokemonList: jest.fn(),
      fetchPokemonDetail: jest.fn(),
    };

    const repository = new PokemonRepositoryImpl(remote, local);
    expect(repository.getCachedPokemonList(20, 0)).toEqual(completeList);
  });
});

// ─────────────────────────────────────────────────────────────────
// getPokemonDetail
// ─────────────────────────────────────────────────────────────────
describe('PokemonRepositoryImpl.getPokemonDetail', () => {
  it('fetches, caches and returns a detail entity', async () => {
    const dto = makeDetailDto(1, 'bulbasaur');
    const remote: PokemonRemoteDataSource = {
      fetchPokemonList: jest.fn(),
      fetchPokemonDetail: jest.fn().mockResolvedValue(dto),
    };
    const local = makeLocalSource();

    const repository = new PokemonRepositoryImpl(remote, local);
    const result = await repository.getPokemonDetail(1);

    expect(result.id).toBe(1);
    expect(result.name).toBe('bulbasaur');
    expect(local.savePokemonDetail).toHaveBeenCalledWith(result);
  });

  it('propagates network errors to the caller', async () => {
    const remote: PokemonRemoteDataSource = {
      fetchPokemonList: jest.fn(),
      fetchPokemonDetail: jest.fn().mockRejectedValue(new Error('404 Not Found')),
    };
    const local = makeLocalSource();

    const repository = new PokemonRepositoryImpl(remote, local);
    await expect(repository.getPokemonDetail(9999)).rejects.toThrow('404 Not Found');
  });
});
