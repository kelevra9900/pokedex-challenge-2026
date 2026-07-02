import 'reflect-metadata';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { container } from '@/core/di/container';
import { DI_TOKENS } from '@/core/di/tokens';
import { usePokemonList } from '../usePokemonList';
import type { PokemonSummary } from '@/domain/entities/Pokemon';

describe('usePokemonList', () => {
  afterEach(() => {
    container.clearInstances();
  });

  it('transitions from loading to loaded with the use case result', async () => {
    const pokemons: PokemonSummary[] = [
      { id: 1, name: 'bulbasaur', imageUrl: 'https://x/1.png', types: ['grass', 'poison'] },
    ];

    container.register(DI_TOKENS.GetPokemonListUseCase, {
      useValue: { execute: jest.fn().mockResolvedValue(pokemons) },
    });
    container.register(DI_TOKENS.PokemonRepository, {
      useValue: { getCachedPokemonList: jest.fn().mockReturnValue(undefined) },
    });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = await renderHook(() => usePokemonList(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.pokemons).toEqual(pokemons);
    expect(result.current.isError).toBe(false);
    expect(typeof result.current.loadMore).toBe('function');
    expect(result.current.isFetchingNextPage).toBe(false);
  });
});
