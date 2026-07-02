export interface PokemonSummary {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}

export interface PokemonStat {
  name: string;
  baseStat: number;
}

export interface PokemonDetail extends PokemonSummary {
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
  shinyImageUrl: string | null;
  baseExperience: number | null;
  moves: string[];
  gameVersions: string[];
  heldItems?: {name: string; rarity: number}[];
}
