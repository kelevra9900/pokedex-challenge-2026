import { injectable } from 'tsyringe';
import type { FavoritesRepository } from '../repositories/FavoritesRepository';

/**
 * ToggleFavoriteUseCase
 *
 * Single-responsibility use case that reads the current favourite state for
 * a Pokémon and flips it, returning the *new* state so callers can update
 * their UI without an extra read.
 */
@injectable()
export class ToggleFavoriteUseCase {
  constructor(private readonly favoritesRepository: FavoritesRepository) {}

  execute(pokemonId: number): boolean {
    const current = this.favoritesRepository.isFavorite(pokemonId);
    const next = !current;
    this.favoritesRepository.setFavorite(pokemonId, next);
    return next;
  }
}
