import {PokemonTypeFilter} from '@/presentation/components/PokemonTypeFilter';
import {SearchBar} from '@/presentation/components/SearchBar';
import type {ViewMode} from '@/presentation/hooks/usePokemonFilters';
import {colors} from '@/presentation/theme/colors';
import {Pressable, StyleSheet, ActivityIndicator} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, {Path, Rect} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface PokemonListHeaderProps {
  query: string;
  onChangeQuery: (value: string) => void;
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  isSearching?: boolean;
  isSwitchingView?: boolean;
}

// SVG icon: 2×2 grid (Lucide LayoutGrid)
function GridIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// SVG icon: list lines (Lucide List)
function ListIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PokemonListHeader({
  query,
  onChangeQuery,
  selectedType,
  onSelectType,
  viewMode,
  onChangeViewMode,
  isSearching,
  isSwitchingView = false,
}: PokemonListHeaderProps) {
  const insets = useSafeAreaInsets();
  const pressScale = useSharedValue(1);

  const handlePressIn = () => {
    pressScale.value = withSpring(0.86, {damping: 15, stiffness: 420});
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, {damping: 12, stiffness: 300});
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: pressScale.value}],
  }));

  return (
    <Animated.View style={[styles.header, {paddingTop: insets.top + 16}]}>
      <Animated.View style={styles.titleRow}>
        <Animated.View>
          <Animated.Text style={styles.title} testID='pokedex-title'>Pokédex</Animated.Text>
          <Animated.Text style={styles.subtitle} testID='pokedex-subtitle'>
            Busca un Pokémon por nombre o número.
          </Animated.Text>
        </Animated.View>

        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => onChangeViewMode(viewMode === 'list' ? 'grid' : 'list')}
          disabled={isSwitchingView}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={viewMode === 'list' ? 'Cambiar a vista cuadrícula' : 'Cambiar a vista lista'}
          accessibilityHint="Alterna entre la vista en lista y la vista en cuadrícula"
          testID='pokemon-toggle-view'
        >
          <Animated.View style={[styles.layoutToggle, buttonAnimatedStyle]}>
            {isSwitchingView ? (
              <ActivityIndicator size="small" color={colors.primary} testID='layout-toggle' />
            ) : viewMode === 'list' ? (
              <GridIcon color={colors.text} />
            ) : (
              <ListIcon color={colors.text} />
            )}
          </Animated.View>
        </Pressable>
      </Animated.View>

      <Animated.View style={styles.searchWrapper}>
        <SearchBar value={query} onChangeText={onChangeQuery} isLoading={isSearching} />
      </Animated.View>

      <PokemonTypeFilter selectedType={selectedType} onSelectType={onSelectType} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  layoutToggle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  searchWrapper: {
    marginTop: 18,
  },
});

