import { FavoritesRepositoryImpl } from '../FavoritesRepositoryImpl';

/** Minimal in-memory MMKV mock */
function makeStorage() {
  const store = new Map<string, boolean>();
  return {
    getBoolean: (key: string): boolean | undefined => store.get(key),
    set: (key: string, value: boolean) => store.set(key, value),
    getString: jest.fn(),
    delete: jest.fn(),
  };
}

describe('FavoritesRepositoryImpl', () => {
  it('returns false for any pokemon that has never been saved', () => {
    const repo = new FavoritesRepositoryImpl(makeStorage() as any);
    expect(repo.isFavorite(1)).toBe(false);
    expect(repo.isFavorite(999)).toBe(false);
  });

  it('returns true after setFavorite(id, true)', () => {
    const repo = new FavoritesRepositoryImpl(makeStorage() as any);
    repo.setFavorite(25, true);
    expect(repo.isFavorite(25)).toBe(true);
  });

  it('returns false after setFavorite(id, false)', () => {
    const repo = new FavoritesRepositoryImpl(makeStorage() as any);
    repo.setFavorite(25, true);
    repo.setFavorite(25, false);
    expect(repo.isFavorite(25)).toBe(false);
  });

  it('stores favourites per-pokemon independently', () => {
    const repo = new FavoritesRepositoryImpl(makeStorage() as any);
    repo.setFavorite(1, true);
    repo.setFavorite(2, false);
    expect(repo.isFavorite(1)).toBe(true);
    expect(repo.isFavorite(2)).toBe(false);
  });

  it('allows toggling back and forth', () => {
    const repo = new FavoritesRepositoryImpl(makeStorage() as any);
    repo.setFavorite(132, true);
    repo.setFavorite(132, false);
    repo.setFavorite(132, true);
    expect(repo.isFavorite(132)).toBe(true);
  });
});
