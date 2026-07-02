import type { MMKV } from 'react-native-mmkv';
import type { FavoritesRepository } from '../../domain/repositories/FavoritesRepository';

/**
 * FavoritesRepositoryImpl
 *
 * MMKV-backed implementation of FavoritesRepository.
 * Uses a dedicated MMKV instance (injected via DI) so the storage namespace
 * is fully controlled by the composition root, not hard-coded here.
 */
export class FavoritesRepositoryImpl implements FavoritesRepository {
  constructor(private readonly storage: MMKV) {}

  private key(pokemonId: number): string {
    return `fav-${pokemonId}`;
  }

  isFavorite(pokemonId: number): boolean {
    return this.storage.getBoolean(this.key(pokemonId)) ?? false;
  }

  setFavorite(pokemonId: number, value: boolean): void {
    this.storage.set(this.key(pokemonId), value);
  }
}
