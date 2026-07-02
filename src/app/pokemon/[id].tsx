import { useLocalSearchParams } from 'expo-router';
import { usePokemonDetail } from '@/presentation/hooks/usePokemonDetail';
import { PokemonDetailScreen } from '@/presentation/screens/PokemonDetailScreen';

export default function PokemonDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const viewModel = usePokemonDetail(id);
  return <PokemonDetailScreen {...viewModel} />;
}
