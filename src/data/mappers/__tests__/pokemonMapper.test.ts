import {
  mapPokemonDetailDtoToEntity,
  mapPokemonListDtoToEntities,
} from '../pokemonMapper';
import type { PokemonListDto } from '../../dto/PokemonListDto';
import type { PokemonDetailDto } from '../../dto/PokemonDetailDto';

const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

/** Minimal valid PokemonDetailDto factory */
function makeDetailDto(overrides: Partial<PokemonDetailDto> = {}): PokemonDetailDto {
  return {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    base_experience: 64,
    sprites: {
      front_default: 'https://sprites/1-front.png',
      other: {
        'official-artwork': {
          front_default: 'https://artwork/1.png',
          front_shiny: 'https://artwork/1-shiny.png',
        },
      },
    },
    types: [
      { slot: 1, type: { name: 'grass', url: '' } },
      { slot: 2, type: { name: 'poison', url: '' } },
    ],
    abilities: [
      { ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 },
      { ability: { name: 'chlorophyll', url: '' }, is_hidden: true, slot: 3 },
    ],
    stats: [
      { stat: { name: 'hp', url: '' }, base_stat: 45, effort: 0 },
      { stat: { name: 'attack', url: '' }, base_stat: 49, effort: 0 },
    ],
    moves: [
      { move: { name: 'tackle', url: '' } },
      { move: { name: 'growl', url: '' } },
    ],
    game_indices: [
      { game_index: 1, version: { name: 'red', url: '' } },
      { game_index: 1, version: { name: 'blue', url: '' } },
    ],
    held_items: [
      {
        item: { name: 'oran-berry', url: '' },
        version_details: [{ rarity: 50, version: { name: 'sword', url: '' } }],
      },
    ],
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────
// mapPokemonListDtoToEntities
// ─────────────────────────────────────────────────────────────────
describe('mapPokemonListDtoToEntities', () => {
  it('extracts id from the trailing segment of the URL', () => {
    const dto: PokemonListDto = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };
    const [entity] = mapPokemonListDtoToEntities(dto);
    expect(entity.id).toBe(1);
  });

  it('builds the official-artwork sprite URL from the extracted id', () => {
    const dto: PokemonListDto = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }],
    };
    const [entity] = mapPokemonListDtoToEntities(dto);
    expect(entity.imageUrl).toBe(`${SPRITE_BASE}/4.png`);
  });

  it('sets types to an empty array (will be hydrated by repository)', () => {
    const dto: PokemonListDto = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
    };
    const [entity] = mapPokemonListDtoToEntities(dto);
    expect(entity.types).toEqual([]);
  });

  it('maps multiple results preserving order', () => {
    const dto: PokemonListDto = {
      count: 3,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
      ],
    };
    const entities = mapPokemonListDtoToEntities(dto);
    expect(entities.map((e) => e.id)).toEqual([1, 2, 3]);
    expect(entities.map((e) => e.name)).toEqual(['bulbasaur', 'ivysaur', 'venusaur']);
  });
});

// ─────────────────────────────────────────────────────────────────
// mapPokemonDetailDtoToEntity
// ─────────────────────────────────────────────────────────────────
describe('mapPokemonDetailDtoToEntity', () => {
  it('maps id, name, height and weight correctly', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto());
    expect(entity.id).toBe(1);
    expect(entity.name).toBe('bulbasaur');
    expect(entity.height).toBe(7);
    expect(entity.weight).toBe(69);
  });

  it('prefers official-artwork sprite for imageUrl', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto());
    expect(entity.imageUrl).toBe('https://artwork/1.png');
  });

  it('falls back to front_default when official-artwork is absent', () => {
    const dto = makeDetailDto({
      sprites: {
        front_default: 'https://sprites/1-front.png',
        other: { 'official-artwork': { front_default: null, front_shiny: null } },
      },
    });
    const entity = mapPokemonDetailDtoToEntity(dto);
    expect(entity.imageUrl).toBe('https://sprites/1-front.png');
  });

  it('falls back to generated sprite URL when both artwork and front_default are null', () => {
    const dto = makeDetailDto({
      sprites: {
        front_default: null,
        other: { 'official-artwork': { front_default: null, front_shiny: null } },
      },
    });
    const entity = mapPokemonDetailDtoToEntity(dto);
    expect(entity.imageUrl).toBe(`${SPRITE_BASE}/1.png`);
  });

  it('maps shinyImageUrl from front_shiny when present', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto());
    expect(entity.shinyImageUrl).toBe('https://artwork/1-shiny.png');
  });

  it('sets shinyImageUrl to front_default when front_shiny is null', () => {
    const dto = makeDetailDto({
      sprites: {
        front_default: 'https://sprites/1-front.png',
        other: { 'official-artwork': { front_default: 'https://artwork/1.png', front_shiny: null } },
      },
    });
    const entity = mapPokemonDetailDtoToEntity(dto);
    expect(entity.shinyImageUrl).toBe('https://sprites/1-front.png');
  });

  it('maps types in slot order', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto());
    expect(entity.types).toEqual(['grass', 'poison']);
  });

  it('maps abilities including hidden ones', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto());
    expect(entity.abilities).toEqual(['overgrow', 'chlorophyll']);
  });

  it('maps base stats correctly', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto());
    expect(entity.stats).toEqual([
      { name: 'hp', baseStat: 45 },
      { name: 'attack', baseStat: 49 },
    ]);
  });

  it('maps baseExperience', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto());
    expect(entity.baseExperience).toBe(64);
  });

  it('maps baseExperience to null when absent in DTO', () => {
    const dto = makeDetailDto({ base_experience: undefined as unknown as null });
    const entity = mapPokemonDetailDtoToEntity(dto);
    expect(entity.baseExperience).toBeNull();
  });

  it('maps moves (up to 8), filtering out null names', () => {
    const dto = makeDetailDto({
      moves: [
        { move: { name: 'tackle', url: '' } },
        { move: { name: null as unknown as string, url: '' } },
        { move: { name: 'growl', url: '' } },
      ],
    });
    const entity = mapPokemonDetailDtoToEntity(dto);
    expect(entity.moves).toEqual(['tackle', 'growl']);
  });

  it('returns empty moves array when dto.moves is empty', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto({ moves: [] }));
    expect(entity.moves).toEqual([]);
  });

  it('slices moves to a maximum of 8', () => {
    const manyMoves = Array.from({ length: 12 }, (_, i) => ({
      move: { name: `move-${i}`, url: '' },
    }));
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto({ moves: manyMoves }));
    expect(entity.moves).toHaveLength(8);
  });

  it('maps game versions (up to 6)', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto());
    expect(entity.gameVersions).toEqual(['red', 'blue']);
  });

  it('slices game versions to a maximum of 6', () => {
    const manyIndices = Array.from({ length: 10 }, (_, i) => ({
      game_index: i,
      version: { name: `version-${i}`, url: '' },
    }));
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto({ game_indices: manyIndices }));
    expect(entity.gameVersions).toHaveLength(6);
  });

  it('maps held items with rarity from first version_details entry', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto());
    expect(entity.heldItems).toEqual([{ name: 'oran-berry', rarity: 50 }]);
  });

  it('defaults held item rarity to 0 when version_details is empty', () => {
    const dto = makeDetailDto({
      held_items: [{ item: { name: 'berry', url: '' }, version_details: [] }],
    });
    const entity = mapPokemonDetailDtoToEntity(dto);
    expect(entity.heldItems).toEqual([{ name: 'berry', rarity: 0 }]);
  });

  it('returns empty heldItems array when held_items is empty', () => {
    const entity = mapPokemonDetailDtoToEntity(makeDetailDto({ held_items: [] }));
    expect(entity.heldItems).toEqual([]);
  });
});
