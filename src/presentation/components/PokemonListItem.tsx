import type {PokemonSummary} from '@/domain/entities/Pokemon';
import {PokeballWatermark} from '@/presentation/components/PokeballWatermark';
import {PokemonTypeBadge} from '@/presentation/components/PokemonTypeBadge';
import {shadeColor} from '@/presentation/theme/colorUtils';
import {getPokemonTypeColor} from '@/presentation/theme/pokemonTypeColors';
import {customSharedTransition} from '@/presentation/theme/transitions';
import {Image} from 'expo-image';
import {router} from 'expo-router';
import {memo} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import Animated,{
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {CARD_HEIGHT} from './PokemonListSkeleton';

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface PokemonListItemProps {
  pokemon: PokemonSummary;
  index: number;
  viewMode?: 'list' | 'grid';
  skipAnimation?: boolean;
}

function PokemonListItemBase({
  pokemon,
  index,
  viewMode = 'list',
  skipAnimation = false,
}: PokemonListItemProps) {
  const scale = useSharedValue(1);
  const baseColor = getPokemonTypeColor(pokemon.types?.[0] ?? 'normal');
  const gradient = `linear-gradient(135deg, ${shadeColor(baseColor,20)} 0%, ${shadeColor(baseColor,-8)} 100%)`;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = () => {
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    scale.value = withSpring(0.95,{damping: 15,stiffness: 350});
  };

  const handlePressOut = () => {
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    scale.value = withSpring(1,{damping: 12,stiffness: 250});
  };

  const isGrid = viewMode === 'grid';

  return (
    <View style={isGrid ? styles.gridWrapper : styles.listWrapper}>
      <Animated.View
        entering={
          skipAnimation
            ? undefined
            : FadeInDown.delay(Math.min(index, 12) * 50)
                .springify()
                .damping(15)
                .stiffness(120)
        }
        style={styles.pressable}
      >
        <Animated.View style={[animatedStyle, styles.pressable]}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => router.push(`/pokemon/${pokemon.name}`)}
            style={styles.pressable}
            accessibilityRole="button"
            accessibilityLabel={`${pokemon.name}, número ${String(pokemon.id).padStart(3, '0')}`}
            accessibilityHint="Abre el detalle de este Pokémon"
            testID={`pokemon-list-item-${pokemon.name}`}
          >
            <View
              style={[
                isGrid ? styles.gridCard : styles.listCard,
                {experimental_backgroundImage: gradient} as object,
              ]}
            >
              <PokeballWatermark
                size={isGrid ? 80 : 130}
                color="rgba(255, 255, 255, 0.12)"
                style={isGrid ? styles.watermarkGrid : styles.watermarkList}
              />

              <View style={isGrid ? styles.gridTextColumn : styles.listTextColumn}>
                <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
                <Text numberOfLines={1} style={isGrid ? styles.gridName : styles.listName}>
                  {pokemon.name}
                </Text>
                <View style={styles.badgeRow}>
                  {(pokemon.types ?? []).map((type) => (
                    <PokemonTypeBadge key={type} type={type} tone="translucent" />
                  ))}
                </View>
              </View>

              <AnimatedImage
                source={{uri: pokemon.imageUrl}}
                style={isGrid ? styles.gridImage : styles.listImage}
                contentFit="contain"
                transition={200}
                sharedTransitionTag={`pokemon-${pokemon.id}-image`}
                sharedTransitionStyle={customSharedTransition}
              />
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export const PokemonListItem = memo(PokemonListItemBase);

const styles = StyleSheet.create({
  listWrapper: {
    width: '100%',
  },
  gridWrapper: {
    flex: 1,
    padding: 6,
  },
  pressable: {
    width: '100%',
  },
  listCard: {
    height: CARD_HEIGHT,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0,height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  gridCard: {
    height: 145,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: {width: 0,height: 6},
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  listTextColumn: {
    flex: 1,
    gap: 4,
    zIndex: 1,
  },
  gridTextColumn: {
    flex: 1,
    gap: 2,
    zIndex: 1,
    justifyContent: 'flex-start',
  },
  id: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  listName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  gridName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 4,
  },
  listImage: {
    width: 140,
    height: 140,
    marginTop: -12,
    marginRight: 0,
    zIndex: 2,
  },
  gridImage: {
    width: 85,
    height: 85,
    position: 'absolute',
    right: 4,
    bottom: 4,
    zIndex: 2,
  },
  watermarkList: {
    right: -15,
    bottom: -20,
  },
  watermarkGrid: {
    right: -10,
    bottom: -15,
  },
});
