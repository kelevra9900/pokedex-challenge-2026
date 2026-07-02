import { useQuery } from '@tanstack/react-query';
import { container } from '@/core/di/container';
import { DI_TOKENS } from '@/core/di/tokens';
import type { GetPokemonDetailUseCase } from '@/domain/usecases/GetPokemonDetailUseCase';
import type { PokemonRepository } from '@/domain/repositories/PokemonRepository';

export function usePokemonDetail(idOrName: string | number) {
  const useCase = container.resolve<GetPokemonDetailUseCase>(DI_TOKENS.GetPokemonDetailUseCase);
  const repository = container.resolve<PokemonRepository>(DI_TOKENS.PokemonRepository);

  const query = useQuery({
    queryKey: ['pokemon-detail', idOrName],
    queryFn: () => useCase.execute(idOrName),
    initialData: () => repository.getCachedPokemonDetail(idOrName),
    enabled: !!idOrName,
  });

  return {
    pokemon: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
