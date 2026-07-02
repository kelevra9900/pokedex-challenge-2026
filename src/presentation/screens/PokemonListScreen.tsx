import type {PokemonSummary} from '@/domain/entities/Pokemon';
import {EmptyView} from '@/presentation/components/EmptyView';
import {ErrorView} from '@/presentation/components/ErrorView';
import {PokemonListHeader} from '@/presentation/components/PokemonListHeader';
import {PokemonListItem} from '@/presentation/components/PokemonListItem';
import {PokemonListSkeleton} from '@/presentation/components/PokemonListSkeleton';
import {usePokemonFilters, type ViewMode} from '@/presentation/hooks/usePokemonFilters';
import {colors} from '@/presentation/theme/colors';
import {useRef, useState, useEffect} from 'react';
import {ActivityIndicator,FlatList,Pressable,StyleSheet,Text,View} from 'react-native';
import Animated, {FadeIn, ZoomIn, ZoomOut} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';


interface PokemonListScreenProps {
  pokemons: PokemonSummary[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  refetch: () => void;
  loadMore: () => void;
  isFetchingNextPage: boolean;
}

export function PokemonListScreen({
  pokemons,
  isLoading,
  isError,
  isEmpty,
  refetch,
  loadMore,
  isFetchingNextPage,
}: PokemonListScreenProps) {
  const insets = useSafeAreaInsets();
  const {query,setQuery,selectedType,setSelectedType,viewMode,setViewMode,filtered,isSearching,isFiltered} =
    usePokemonFilters(pokemons);

  const listRef = useRef<any>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollOffsetRef = useRef(0);

  // Tracks an in-progress grid ↔ list transition so a skeleton can fill the
  // blank frame that would otherwise appear while FlatList remounts.
  const [isSwitchingView, setIsSwitchingView] = useState(false);

  const handleChangeViewMode = (mode: ViewMode) => {
    setIsSwitchingView(true);
    setViewMode(mode);
  };

  // Clear the switching flag once the new FlatList has had enough time to
  // complete its first layout pass (~300 ms covers most devices).
  useEffect(() => {
    if (!isSwitchingView) return;
    const timer = setTimeout(() => setIsSwitchingView(false), 300);
    return () => clearTimeout(timer);
  }, [isSwitchingView]);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    scrollOffsetRef.current = y;
    if (y > 300 && !showScrollToTop) {
      setShowScrollToTop(true);
    } else if (y <= 300 && showScrollToTop) {
      setShowScrollToTop(false);
    }
  };

  const [hasAnimated, setHasAnimated] = useState(false);
  const didMountRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 800); // 800ms covers initial entry animations
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Skip the first run on initial mount to avoid scrolling before the list
    // has completed its first layout pass.
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    // Reset scroll to the top whenever the active filter or search query changes
    // so the user always sees the filtered results from the beginning.
    const frame = requestAnimationFrame(() => {
      if (listRef.current) {
        try {
          listRef.current.scrollToOffset({ offset: 0, animated: false });
          scrollOffsetRef.current = 0;
        } catch (e) {
          console.warn('Scroll reset failed:', e);
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedType, query]);

  if (isLoading) {
    return (
      <View style={{paddingTop: insets.top + 16,flex: 1,backgroundColor: colors.background}}>
        <PokemonListSkeleton viewMode={viewMode} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.fullScreen,{paddingTop: insets.top}]}>
        <ErrorView onRetry={refetch} />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={[styles.fullScreen,{paddingTop: insets.top}]}>
        <EmptyView />
      </View>
    );
  }

  const isGrid = viewMode === 'grid';

  return (
    <View style={styles.container}>
      {isSwitchingView ? (
        // Instant skeleton feedback while the FlatList remounts in the background.
        // Using FadeIn keeps the visual transition smooth instead of a hard cut.
        <Animated.View entering={FadeIn.duration(120)} style={styles.listWrapper}>
          <PokemonListHeader
            query={query}
            onChangeQuery={setQuery}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            viewMode={viewMode}
            onChangeViewMode={handleChangeViewMode}
            isSearching={isSearching}
            isSwitchingView={isSwitchingView}
          />
          <PokemonListSkeleton viewMode={viewMode} />
        </Animated.View>
      ) : (
        // key forces a remount whenever the view mode changes so FlatList
        // resets numColumns cleanly; FadeIn turns the snap into a smooth reveal.
        <Animated.View key={viewMode} entering={FadeIn.duration(200)} style={styles.listWrapper}>
          <FlatList
            ref={listRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            data={filtered}
            numColumns={isGrid ? 2 : 1}
            keyExtractor={(item: PokemonSummary) => String(item.id)}
            renderItem={({item, index}: {item: PokemonSummary; index: number}) => (
              <PokemonListItem pokemon={item} index={index} viewMode={viewMode} skipAnimation={hasAnimated || isFiltered} />
            )}
            ListHeaderComponent={
              <PokemonListHeader
                query={query}
                onChangeQuery={setQuery}
                selectedType={selectedType}
                onSelectType={setSelectedType}
                viewMode={viewMode}
                onChangeViewMode={handleChangeViewMode}
                isSearching={isSearching}
                isSwitchingView={isSwitchingView}
              />
            }
            ListEmptyComponent={
              <EmptyView
                message={
                  selectedType
                    ? `No hay Pokémon de tipo ${selectedType} que coincidan con la búsqueda.`
                    : 'No encontramos ese Pokémon.'
                }
              />
            }
            contentContainerStyle={isGrid ? styles.gridContent : styles.listContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={styles.footerLoading}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : null
            }
          />
        </Animated.View>
      )}

      {/* Hide the scroll-to-top button during the view switch to avoid
          it appearing over the skeleton with a stale scroll offset. */}
      {showScrollToTop && !isSwitchingView && (
        <Animated.View
          entering={ZoomIn.duration(200)}
          exiting={ZoomOut.duration(200)}
          style={styles.scrollToTopButtonContainer}
        >
          <Pressable
            onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
            style={styles.scrollToTopButton}
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio"
            accessibilityHint="Desplaza el listado hasta el primer elemento"
          >
            <Text style={styles.scrollToTopText}>↑</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Fills the container so the FlatList can scroll correctly after the
  // Animated.View wrapper is introduced for the fade-in transition.
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    paddingBottom: 24,
    paddingHorizontal: 10,
  },
  scrollToTopButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 99,
  },
  scrollToTopButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  scrollToTopText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
