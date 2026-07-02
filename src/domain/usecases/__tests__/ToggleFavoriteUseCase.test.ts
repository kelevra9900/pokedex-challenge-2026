import { ToggleFavoriteUseCase } from '../ToggleFavoriteUseCase';
import type { FavoritesRepository } from '../../repositories/FavoritesRepository';

function makeFakeFavoritesRepository(initial = false): FavoritesRepository {
  let state = initial;
  return {
    isFavorite: jest.fn(() => state),
    setFavorite: jest.fn((_, value: boolean) => {
      state = value;
    }),
  };
}

describe('ToggleFavoriteUseCase', () => {
  it('returns true when the pokemon was not a favourite', () => {
    const repo = makeFakeFavoritesRepository(false);
    const useCase = new ToggleFavoriteUseCase(repo);

    const result = useCase.execute(1);

    expect(result).toBe(true);
  });

  it('calls setFavorite with the new value', () => {
    const repo = makeFakeFavoritesRepository(false);
    const useCase = new ToggleFavoriteUseCase(repo);

    useCase.execute(1);

    expect(repo.setFavorite).toHaveBeenCalledWith(1, true);
  });

  it('returns false when the pokemon was already a favourite', () => {
    const repo = makeFakeFavoritesRepository(true);
    const useCase = new ToggleFavoriteUseCase(repo);

    const result = useCase.execute(25);

    expect(result).toBe(false);
    expect(repo.setFavorite).toHaveBeenCalledWith(25, false);
  });

  it('reads the current state before toggling', () => {
    const repo = makeFakeFavoritesRepository(false);
    const useCase = new ToggleFavoriteUseCase(repo);

    useCase.execute(132);

    expect(repo.isFavorite).toHaveBeenCalledWith(132);
  });
});
