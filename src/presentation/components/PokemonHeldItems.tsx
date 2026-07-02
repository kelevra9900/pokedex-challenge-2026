import {PokemonDetailSection} from '@/presentation/components/PokemonDetailSection';
import {colors} from '@/presentation/theme/colors';
import {hexToRgba} from '@/presentation/theme/colorUtils';
import {StyleSheet,Text,View} from 'react-native';

interface PokemonHeldItemsProps {
  items: {name: string; rarity: number}[] | undefined;
  baseColor: string;
}

export function PokemonHeldItems({items,baseColor}: PokemonHeldItemsProps) {
  if (!items || items.length === 0) return null;

  return (
    <PokemonDetailSection title="Objetos en estado salvaje" testID="pokemon-held-items-section">
      <View style={styles.heldItemsRow}>
        {items.map((item) => (
          <View
            key={item.name}
            style={[styles.heldItemCard,{borderColor: hexToRgba(baseColor,0.15)}]}
          >
            <Text style={styles.heldItemIcon}>🎒</Text>
            <View>
              <Text style={styles.heldItemName}>{item.name.replace('-',' ')}</Text>
              <Text style={styles.heldItemRarity}>Probabilidad: {item.rarity}%</Text>
            </View>
          </View>
        ))}
      </View>
    </PokemonDetailSection>
  );
}

const styles = StyleSheet.create({
  heldItemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  heldItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
  },
  heldItemIcon: {
    fontSize: 20,
  },
  heldItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'capitalize',
  },
  heldItemRarity: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
