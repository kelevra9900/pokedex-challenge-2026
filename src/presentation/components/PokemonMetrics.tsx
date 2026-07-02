import type {PokemonDetail} from '@/domain/entities/Pokemon';
import {colors} from '@/presentation/theme/colors';
import {hexToRgba} from '@/presentation/theme/colorUtils';
import {StyleSheet,Text,View} from 'react-native';

interface PokemonMetricsProps {
  pokemon: PokemonDetail;
  baseColor: string;
}

export function PokemonMetrics({pokemon,baseColor}: PokemonMetricsProps) {
  return (
    <View style={[styles.metricsRow,{backgroundColor: hexToRgba(baseColor,0.08)}]}>
      <View style={styles.metric}>
        <Text style={styles.metricValue} testID="pokemon-height">
          {pokemon.height / 10} m
        </Text>
        <Text style={styles.metricLabel}>Altura</Text>
      </View>
      <View style={[styles.metricDivider,{backgroundColor: hexToRgba(baseColor,0.2)}]} />
      <View style={styles.metric}>
        <Text style={styles.metricValue} testID="pokemon-weight">
          {pokemon.weight / 10} kg
        </Text>
        <Text style={styles.metricLabel}>Peso</Text>
      </View>
      {pokemon.baseExperience !== null && (
        <>
          <View style={[styles.metricDivider,{backgroundColor: hexToRgba(baseColor,0.2)}]} />
          <View style={styles.metric}>
            <Text style={styles.metricValue} testID="pokemon-base-experience">
              {pokemon.baseExperience} XP
            </Text>
            <Text style={styles.metricLabel}>Exp. Base</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 20,
    width: '100%',
    justifyContent: 'center',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricDivider: {
    width: 1.5,
    height: 36,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
});
