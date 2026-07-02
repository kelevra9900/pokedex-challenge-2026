import {colors} from '@/presentation/theme/colors';
import {ActivityIndicator,Pressable,StyleSheet,Text,TextInput,View} from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  isLoading?: boolean;
}

export function SearchBar({value,onChangeText,isLoading}: SearchBarProps) {
  return (
    <View style={styles.searchBox}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} style={styles.searchLoader} />
      ) : (
        <Text style={styles.searchIcon}>🔍</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="¿Qué Pokémon buscas?"
        placeholderTextColor={colors.textSecondary}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Buscar Pokémon"
        accessibilityHint="Escribe el nombre o número de un Pokémon para filtrar el listado"
        testID='search-pokemon'
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          style={styles.clearButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
        >
          <Text style={styles.clearIcon}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: {width: 0,height: 4},
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1.5,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchLoader: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  clearButton: {
    padding: 2,
  },
  clearIcon: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
});
