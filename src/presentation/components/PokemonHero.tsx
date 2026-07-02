import type {PokemonDetail} from '@/domain/entities/Pokemon';
import {FloatingParticles} from '@/presentation/components/FloatingParticles';
import {PokeballWatermark} from '@/presentation/components/PokeballWatermark';
import {PokemonTypeBadge} from '@/presentation/components/PokemonTypeBadge';
import type {HeroAnimatedStyles} from '@/presentation/hooks/usePokemonHeroAnimation';
import {shadeColor} from '@/presentation/theme/colorUtils';
import {customSharedTransition} from '@/presentation/theme/transitions';
import {Image} from 'expo-image';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface PokemonHeroProps {
  pokemon: PokemonDetail;
  baseColor: string;
  showShiny: boolean;
  onToggleShiny: () => void;
  heroStyle: HeroAnimatedStyles['heroStyle'];
  imageStyle: HeroAnimatedStyles['imageStyle'];
  watermarkStyle: HeroAnimatedStyles['watermarkStyle'];
}

export function PokemonHero({
  pokemon,
  baseColor,
  showShiny,
  onToggleShiny,
  heroStyle,
  imageStyle,
  watermarkStyle,
}: PokemonHeroProps) {
  const insets = useSafeAreaInsets();
  const heroGradient = `linear-gradient(180deg, ${shadeColor(baseColor,25)} 0%, ${baseColor} 100%)`;

  return (
    <Animated.View
      style={[
        styles.hero,
        {paddingTop: insets.top + 56,experimental_backgroundImage: heroGradient} as object,
        heroStyle,
      ]}
    >
      <FloatingParticles type={pokemon.types[0]} />
      <Animated.View style={[styles.giantWatermark,watermarkStyle]}>
        <PokeballWatermark size={260} color="rgba(255, 255, 255, 0.12)" />
      </Animated.View>

      <Animated.View style={[styles.imageContainer,imageStyle]}>
        <AnimatedImage
          source={{
            uri: showShiny && pokemon.shinyImageUrl ? pokemon.shinyImageUrl : pokemon.imageUrl,
          }}
          style={styles.image}
          contentFit="contain"
          sharedTransitionTag={`pokemon-${pokemon.id}-image`}
          sharedTransitionStyle={customSharedTransition}
        />
        {pokemon.shinyImageUrl && (
          <Pressable
            style={[styles.shinyToggle,{backgroundColor: 'rgba(255, 255, 255, 0.28)'}]}
            onPress={onToggleShiny}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={showShiny ? 'Ver versión Normal' : 'Ver versión Shiny'}
            accessibilityHint={showShiny ? 'Cambia la imagen al sprite normal del Pokémon' : 'Cambia la imagen al sprite Shiny del Pokémon'}
            accessibilityState={{selected: showShiny}}
            testID="shiny-toggle-button"
          >
            <Text style={styles.shinyToggleText}>{showShiny ? '✨ Shiny' : '💫 Normal'}</Text>
          </Pressable>
        )}
      </Animated.View>

      <Text style={styles.headerName}>{pokemon.name}</Text>
      <View style={styles.headerBadgeRow}>
        {pokemon.types.map((type) => (
          <PokemonTypeBadge key={type} type={type} tone="translucent" />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    position: 'relative',
    height: 395, // Altura incrementada para Nombre y Badges
  },
  giantWatermark: {
    position: 'absolute',
    right: -40,
    bottom: 20,
    opacity: 0.8,
  },
  imageContainer: {
    zIndex: 3,
    marginTop: 20,
    position: 'relative',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  shinyToggle: {
    position: 'absolute',
    right: -20,
    bottom: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    zIndex: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  shinyToggleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  headerName: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    marginTop: 12,
    letterSpacing: -0.5,
    zIndex: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: {width: 0,height: 1},
    textShadowRadius: 3,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    justifyContent: 'center',
    zIndex: 4,
  },
});
