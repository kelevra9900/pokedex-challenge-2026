export interface PokemonDetailDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
  types: { slot: number; type: { name: string; url: string } }[];
  abilities: { ability: { name: string; url: string }; is_hidden: boolean; slot: number }[];
  stats: { base_stat: number; effort: number; stat: { name: string; url: string } }[];
  moves: { move?: { name: string | null; url: string } }[];
  game_indices: { game_index: number; version: { name: string; url: string } }[];
  held_items: {
    item: { name: string; url: string };
    version_details: { rarity: number; version: { name: string; url: string } }[];
  }[];
}
