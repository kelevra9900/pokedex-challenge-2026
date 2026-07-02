import {container} from '@/core/di/container';
import {DI_TOKENS} from '@/core/di/tokens';
import type {PokemonRepository} from '@/domain/repositories/PokemonRepository';
import type {GetPokemonListUseCase} from '@/domain/usecases/GetPokemonListUseCase';
import {useInfiniteQuery} from '@tanstack/react-query';

const LIMIT = 20;

export function usePokemonList() {
  const useCase = container.resolve<GetPokemonListUseCase>(DI_TOKENS.GetPokemonListUseCase);
  const repository = container.resolve<PokemonRepository>(DI_TOKENS.PokemonRepository);

  const query = useInfiniteQuery({
    queryKey: ['pokemon-infinite-list'],
    queryFn: ({pageParam = 0}) => useCase.execute({limit: LIMIT,offset: pageParam}),
    initialPageParam: 0,
    getNextPageParam: (lastPage,allPages) => {
      return lastPage.length < LIMIT ? undefined : allPages.length * LIMIT;
    },
    initialData: () => {
      const cachedFirstPage = repository.getCachedPokemonList(LIMIT,0);
      if (cachedFirstPage && cachedFirstPage.length > 0) {
        return {
          pages: [cachedFirstPage],
          pageParams: [0],
        };
      }
      return undefined;
    },
  });

  const pokemons = query.data?.pages.flat() ?? [];

  const loadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  };

  return {
    pokemons,
    isLoading: query.isLoading,
    isError: query.isError,
    isEmpty: !query.isLoading && !query.isError && pokemons.length === 0,
    refetch: query.refetch,
    loadMore,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
