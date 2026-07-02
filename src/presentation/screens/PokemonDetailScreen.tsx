import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PokemonDetail } from '@/domain/entities/Pokemon';
import { ErrorView } from '@/presentation/components/ErrorView';
import { PokemonAbilities } from '@/presentation/components/PokemonAbilities';
import { PokemonDetailSkeleton } from '@/presentation/components/PokemonDetailSkeleton';
import { PokemonDetailTopBar } from '@/presentation/components/PokemonDetailTopBar';
import { PokemonGameVersions } from '@/presentation/components/PokemonGameVersions';
import { PokemonHeldItems } from '@/presentation/components/PokemonHeldItems';
import { PokemonHero } from '@/presentation/components/PokemonHero';
import { PokemonMetrics } from '@/presentation/components/PokemonMetrics';
import { PokemonMoves } from '@/presentation/components/PokemonMoves';
import { PokemonStatsSection } from '@/presentation/components/PokemonStatsSection';
import { useFavoritePokemon } from '@/presentation/hooks/useFavoritePokemon';
import { usePokemonHeroAnimation } from '@/presentation/hooks/usePokemonHeroAnimation';
import { colors } from '@/presentation/theme/colors';
import { getPokemonTypeColor } from '@/presentation/theme/pokemonTypeColors';

interface PokemonDetailScreenProps {
  pokemon: PokemonDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function PokemonDetailScreen({
  pokemon,
  isLoading,
  isError,
  refetch,
}: PokemonDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const [showShiny, setShowShiny] = useState(false);
  const { isFavorite, toggleFavorite, animatedHeartStyle, particleStyles } = useFavoritePokemon(
    pokemon?.id,
  );
  const { scrollHandler, heroStyle, imageStyle, watermarkStyle } = usePokemonHeroAnimation();

  if (isLoading) {
    return <PokemonDetailSkeleton />;
  }

  if (isError || !pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ErrorView onRetry={refetch} />
        <Pressable
          style={[styles.backButton, { top: insets.top + 12 }]}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
      </View>
    );
  }

  const baseColor = getPokemonTypeColor(pokemon.types[0]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Barra superior flotante de controles (Back, Favorite, ID) */}
      <PokemonDetailTopBar
        pokemonId={pokemon.id}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        animatedHeartStyle={animatedHeartStyle}
        particleStyles={particleStyles}
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        <PokemonHero
          pokemon={pokemon}
          baseColor={baseColor}
          showShiny={showShiny}
          onToggleShiny={() => setShowShiny((prev) => !prev)}
          heroStyle={heroStyle}
          imageStyle={imageStyle}
          watermarkStyle={watermarkStyle}
        />

        {/* Cuerpo de detalles del Pokémon (Estética de Panel Deslizable Bottom Sheet) */}
        <Animated.View
          entering={FadeInUp.delay(260).springify().damping(18).stiffness(100)}
          style={styles.body}
        >
          <View style={styles.sheetHandle} />

          <PokemonMetrics pokemon={pokemon} baseColor={baseColor} />
          <PokemonAbilities abilities={pokemon.abilities} baseColor={baseColor} />
          <PokemonStatsSection stats={pokemon.stats} />
          <PokemonMoves moves={pokemon.moves} baseColor={baseColor} />
          <PokemonHeldItems items={pokemon.heldItems} baseColor={baseColor} />
          <PokemonGameVersions versions={pokemon.gameVersions} />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 48,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: -2,
  },
  body: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -30,
    paddingTop: 14,
    paddingHorizontal: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    alignItems: 'center',
    minHeight: 550,
  },
  sheetHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E5E5EA',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
