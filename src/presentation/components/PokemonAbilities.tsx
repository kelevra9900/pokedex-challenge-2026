import { StyleSheet, Text, View } from 'react-native';
import { PokemonDetailSection } from '@/presentation/components/PokemonDetailSection';
import { colors } from '@/presentation/theme/colors';
import { hexToRgba } from '@/presentation/theme/colorUtils';

interface PokemonAbilitiesProps {
  abilities: string[];
  baseColor: string;
}

export function PokemonAbilities({ abilities, baseColor }: PokemonAbilitiesProps) {
  return (
    <PokemonDetailSection title="Habilidades">
      <View style={styles.abilityRow}>
        {abilities.map((ability) => (
          <Text
            key={ability}
            style={[styles.ability, { backgroundColor: hexToRgba(baseColor, 0.12) }]}
          >
            {ability.replace('-', ' ')}
          </Text>
        ))}
      </View>
    </PokemonDetailSection>
  );
}

const styles = StyleSheet.create({
  abilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ability: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    textTransform: 'capitalize',
  },
});
