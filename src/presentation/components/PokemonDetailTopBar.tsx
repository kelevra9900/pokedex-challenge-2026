import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FavoriteHeartButton } from '@/presentation/components/FavoriteHeartButton';
import type { FavoritePokemon } from '@/presentation/hooks/useFavoritePokemon';

interface PokemonDetailTopBarProps {
  pokemonId: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  animatedHeartStyle: FavoritePokemon['animatedHeartStyle'];
  particleStyles: FavoritePokemon['particleStyles'];
}

export function PokemonDetailTopBar({
  pokemonId,
  isFavorite,
  onToggleFavorite,
  animatedHeartStyle,
  particleStyles,
}: PokemonDetailTopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
      <Pressable
        style={styles.headerButton}
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        accessibilityHint="Regresa al listado de Pokémon"
      >
        <Text style={styles.headerButtonText}>←</Text>
      </Pressable>
      <View style={styles.headerRight}>
        <FavoriteHeartButton
          isFavorite={isFavorite}
          onPress={onToggleFavorite}
          animatedHeartStyle={animatedHeartStyle}
          particleStyles={particleStyles}
        />
        <Text style={styles.headerId}>#{String(pokemonId).padStart(3, '0')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerId: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
