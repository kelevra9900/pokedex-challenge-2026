import { useState } from 'react';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { container } from '@/core/di/container';
import { DI_TOKENS } from '@/core/di/tokens';
import type { FavoritesRepository } from '@/domain/repositories/FavoritesRepository';
import type { ToggleFavoriteUseCase } from '@/domain/usecases/ToggleFavoriteUseCase';

const PARTICLE_TARGETS = [
  { tx: -28, ty: -32 },
  { tx: 28, ty: -32 },
  { tx: -36, ty: 0 },
  { tx: 36, ty: 0 },
  { tx: -22, ty: 26 },
  { tx: 22, ty: 26 },
];

function useHeartParticle() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const fire = (tx: number, ty: number) => {
    const dur = 500;
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    scale.value = 0;
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    opacity.value = 1;
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    x.value = 0;
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    y.value = 0;
    scale.value = withSpring(1, { damping: 6, stiffness: 200 });
    x.value = withTiming(tx, { duration: dur, easing: Easing.out(Easing.quad) });
    y.value = withTiming(ty, { duration: dur, easing: Easing.out(Easing.quad) });
    opacity.value = withDelay(dur * 0.5, withTiming(0, { duration: dur * 0.5 }));
  };

  return { style, fire };
}

export function useFavoritePokemon(pokemonId: number | undefined) {
  // Resolved from the DI container — no direct MMKV coupling in the presentation layer.
  const favoritesRepository = container.resolve<FavoritesRepository>(DI_TOKENS.FavoritesRepository);
  const toggleUseCase = container.resolve<ToggleFavoriteUseCase>(DI_TOKENS.ToggleFavoriteUseCase);

  const [isFavorite, setIsFavorite] = useState(() => {
    if (!pokemonId) return false;
    return favoritesRepository.isFavorite(pokemonId);
  });

  const heartScale = useSharedValue(1);
  const heartRotation = useSharedValue(0);
  const heartGlow = useSharedValue(0);

  const particles = [
    useHeartParticle(),
    useHeartParticle(),
    useHeartParticle(),
    useHeartParticle(),
    useHeartParticle(),
    useHeartParticle(),
  ];

  const fireFavoriteParticles = () => {
    particles.forEach(({ fire }, index) => {
      const { tx, ty } = PARTICLE_TARGETS[index];
      fire(tx, ty);
    });
  };

  const toggleFavorite = () => {
    if (!pokemonId) return;
    // ToggleFavoriteUseCase reads the current state, flips it, persists it, and
    // returns the new value — so we get an atomic read-modify-write operation.
    const newVal = toggleUseCase.execute(pokemonId);
    setIsFavorite(newVal);

    if (newVal) {
      // Adding to favourites: elastic pop + rotation burst + particle explosion
      heartScale.value = withSequence(
        withSpring(1.5, { damping: 4, stiffness: 300 }),
        withSpring(1.15, { damping: 6, stiffness: 200 }),
        withSpring(1, { damping: 8, stiffness: 150 }),
      );
      heartRotation.value = withSequence(
        withTiming(-20, { duration: 80 }),
        withTiming(20, { duration: 100 }),
        withTiming(-12, { duration: 80 }),
        withTiming(0, { duration: 80 }),
      );
      heartGlow.value = withSequence(
        withTiming(1, { duration: 120 }),
        withDelay(300, withTiming(0, { duration: 300 })),
      );
      runOnJS(fireFavoriteParticles)();
    } else {
      // Removing from favourites: brief shrink + spring back
      heartScale.value = withSequence(
        withTiming(0.7, { duration: 100 }),
        withSpring(1, { damping: 8, stiffness: 200 }),
      );
    }
  };

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }, { rotate: `${heartRotation.value}deg` }],
  }));

  return {
    isFavorite,
    toggleFavorite,
    animatedHeartStyle,
    particleStyles: particles.map((p) => p.style),
  };
}

export type FavoritePokemon = ReturnType<typeof useFavoritePokemon>;
