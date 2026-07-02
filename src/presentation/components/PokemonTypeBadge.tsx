import { StyleSheet, Text, View } from 'react-native';
import { getPokemonTypeColor } from '@/presentation/theme/pokemonTypeColors';
import { shadeColor } from '@/presentation/theme/colorUtils';
import { PokemonTypeIcon } from './PokemonTypeIcon';

interface PokemonTypeBadgeProps {
  type: string;
  tone?: 'solid' | 'translucent';
}

export function PokemonTypeBadge({ type, tone = 'solid' }: PokemonTypeBadgeProps) {
  const base = getPokemonTypeColor(type);
  const backgroundColor = tone === 'solid' ? shadeColor(base, -12) : 'rgba(255, 255, 255, 0.28)';

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <PokemonTypeIcon type={type} size={12} color="#FFFFFF" />
      <Text style={styles.text}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  icon: {
    fontSize: 12,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'capitalize',
  },
});
