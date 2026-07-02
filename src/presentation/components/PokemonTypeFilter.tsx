import {PokemonTypeIcon} from '@/presentation/components/PokemonTypeIcon';
import {colors} from '@/presentation/theme/colors';
import {POKEMON_TYPE_COLORS,getPokemonTypeColor} from '@/presentation/theme/pokemonTypeColors';
import {useMemo} from 'react';
import {Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';

interface PokemonTypeFilterProps {
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
}

export function PokemonTypeFilter({selectedType,onSelectType}: PokemonTypeFilterProps) {
  const types = useMemo(() => Object.keys(POKEMON_TYPE_COLORS),[]);

  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>Filtrar por tipo</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeScrollContainer}
      >
        <Pressable
          onPress={() => onSelectType(selectedType === 'favorites' ? null : 'favorites')}
          style={[
            styles.typeChip,
            selectedType === 'favorites' && {backgroundColor: '#FF3B30',borderColor: '#FF3B30'},
          ]}
          accessibilityRole="button"
          accessibilityLabel="Filtrar por favoritos"
          accessibilityHint="Muestra solo los Pokémon marcados como favoritos"
          accessibilityState={{selected: selectedType === 'favorites'}}
          testID='filter-button'
        >
          <View style={styles.typeIconWrapper}>
            <Text
              style={[
                styles.favHeartIcon,
                selectedType === 'favorites' && styles.favHeartIconActive,
              ]}
            >
              ♥
            </Text>
          </View>
          <Text style={[styles.typeText,selectedType === 'favorites' && styles.typeTextActive]}>
            Favoritos
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onSelectType(null)}
          style={[styles.typeChip,selectedType === null && styles.typeChipAllActive]}
          accessibilityRole="button"
          accessibilityLabel="Todos los tipos"
          accessibilityHint="Muestra Pokémon de todos los tipos"
          accessibilityState={{selected: selectedType === null}}
          testID='filter-all-types'
        >
          <View style={styles.typeIconWrapper}>
            <PokemonTypeIcon
              type="all"
              size={16}
              color={selectedType === null ? '#FFFFFF' : colors.textSecondary}
            />
          </View>
          <Text style={[styles.typeText,selectedType === null && styles.typeTextActive]}>
            Todos
          </Text>
        </Pressable>

        {types.map((type) => {
          const isActive = selectedType === type;
          const typeColor = getPokemonTypeColor(type);
          return (
            <Pressable
              key={type}
              onPress={() => onSelectType(isActive ? null : type)}
              style={[
                styles.typeChip,
                isActive && {backgroundColor: typeColor,borderColor: typeColor},
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por tipo ${type}`}
              accessibilityHint={isActive ? `Quitar filtro de tipo ${type}` : `Ver solo Pokémon de tipo ${type}`}
              accessibilityState={{selected: isActive}}
              testID={`filter-type-${type}`}
            >
              <View style={styles.typeIconWrapper}>
                <PokemonTypeIcon type={type} size={16} color={isActive ? '#FFFFFF' : typeColor} />
              </View>
              <Text style={[styles.typeText,isActive && styles.typeTextActive]}>{type}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterSection: {
    marginTop: 20,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  typeScrollContainer: {
    gap: 8,
    paddingRight: 10,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000000',
    shadowOffset: {width: 0,height: 2},
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  typeChipAllActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeIconWrapper: {
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  favHeartIcon: {
    fontSize: 16,
    color: '#FF3B30',
  },
  favHeartIconActive: {
    color: '#FFFFFF',
  },
});
