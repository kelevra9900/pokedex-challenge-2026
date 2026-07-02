import type { PokemonDetail, PokemonSummary } from '../../domain/entities/Pokemon';
import type { PokemonDetailDto } from '../dto/PokemonDetailDto';
import type { PokemonListDto } from '../dto/PokemonListDto';

const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

function extractIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

// The list endpoint only returns { name, url } per entry, so id and sprite are
// derived from the trailing id segment of the url as a placeholder. The repository
// hydrates each entry with its type(s) via a per-item detail fetch afterwards.
export function mapPokemonListDtoToEntities(dto: PokemonListDto): PokemonSummary[] {
  return dto.results.map((result) => {
    const id = extractIdFromUrl(result.url);
    return { id, name: result.name, imageUrl: `${SPRITE_BASE}/${id}.png`, types: [] };
  });
}

export function mapPokemonDetailDtoToEntity(dto: PokemonDetailDto): PokemonDetail {
  return {
    id: dto.id,
    name: dto.name,
    imageUrl:
      dto.sprites.other?.['official-artwork']?.front_default ??
      dto.sprites.front_default ??
      `${SPRITE_BASE}/${dto.id}.png`,
    height: dto.height,
    weight: dto.weight,
    types: dto.types.map((t) => t.type.name),
    abilities: dto.abilities.map((a) => a.ability.name),
    stats: dto.stats.map((s) => ({ name: s.stat.name, baseStat: s.base_stat })),
    shinyImageUrl:
      dto.sprites.other?.['official-artwork']?.front_shiny ?? dto.sprites.front_default ?? null,
    baseExperience: dto.base_experience ?? null,
    moves: dto.moves
      ? dto.moves
          .slice(0, 8)
          .map((m) => m.move?.name)
          .filter((name): name is string => typeof name === 'string')
      : [],
    gameVersions: dto.game_indices ? dto.game_indices.slice(0, 6).map((gi) => gi.version.name) : [],
    heldItems: dto.held_items
      ? dto.held_items.map((hi) => ({
          name: hi.item.name,
          rarity: hi.version_details?.[0]?.rarity ?? 0,
        }))
      : [],
  };
}
