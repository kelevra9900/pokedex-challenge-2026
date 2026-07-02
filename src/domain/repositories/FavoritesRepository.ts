/**
 * FavoritesRepository
 *
 * Domain contract for persisting and querying the user's favourite Pokémon.
 * Intentionally kept narrow: the rest of the application must not know *how*
 * favourites are stored (MMKV, SQLite, remote API, …).
 */
export interface FavoritesRepository {
  /** Returns true if the Pokémon with the given id is currently marked as favourite. */
  isFavorite(pokemonId: number): boolean;
  /** Persists the favourite state for a given Pokémon id. */
  setFavorite(pokemonId: number, value: boolean): void;
}
