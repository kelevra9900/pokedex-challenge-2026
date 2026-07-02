import { usePokemonList } from '@/presentation/hooks/usePokemonList';
import { PokemonListScreen } from '@/presentation/screens/PokemonListScreen';

export default function IndexRoute() {
  const viewModel = usePokemonList();
  return <PokemonListScreen {...viewModel} />;
}
