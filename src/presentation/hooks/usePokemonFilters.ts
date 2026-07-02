import { useMemo, useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { container } from '@/core/di/container';
import { DI_TOKENS } from '@/core/di/tokens';
import type { FavoritesRepository } from '@/domain/repositories/FavoritesRepository';
import type { PokemonSummary } from '@/domain/entities/Pokemon';

export type ViewMode = 'list' | 'grid';

export function usePokemonFilters(pokemons: PokemonSummary[]) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isSearching, setIsSearching] = useState(false);
  const [focusTrigger, setFocusTrigger] = useState(0);

  const navigation = useNavigation();
  const favoritesRepository = container.resolve<FavoritesRepository>(DI_TOKENS.FavoritesRepository);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFocusTrigger((prev) => prev + 1);
    });
    return unsubscribe;
  }, [navigation]);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (text.trim() !== '') {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, query.trim() === '' ? 0 : 250);

    return () => clearTimeout(handler);
  }, [query]);

  const filtered = useMemo(() => {
    if (focusTrigger) {
      // Reference focusTrigger to satisfy react-hooks/exhaustive-deps
    }
    let list = pokemons;

    if (selectedType === 'favorites') {
      list = list.filter((pokemon) => favoritesRepository.isFavorite(pokemon.id));
    } else if (selectedType) {
      list = list.filter((pokemon) => pokemon.types?.includes(selectedType));
    }

    const normalized = debouncedQuery.trim().toLowerCase();
    if (!normalized) return list;

    return list.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(normalized) || String(pokemon.id).includes(normalized),
    );
  }, [pokemons, debouncedQuery, selectedType, focusTrigger, favoritesRepository]);

  const isFiltered = query.trim() !== '' || selectedType !== null;

  return {
    query,
    setQuery: handleQueryChange,
    selectedType,
    setSelectedType,
    viewMode,
    setViewMode,
    filtered,
    isSearching,
    isFiltered,
  };
}

