import type {PokemonStat} from '@/domain/entities/Pokemon';
import {PokemonDetailSection} from '@/presentation/components/PokemonDetailSection';
import {StatBar} from '@/presentation/components/StatBar';
import {StyleSheet,View} from 'react-native';

interface PokemonStatsSectionProps {
  stats: PokemonStat[];
}

export function PokemonStatsSection({stats}: PokemonStatsSectionProps) {
  return (
    <PokemonDetailSection title="Estadísticas base" testID="pokemon-stats-section">
      <View style={styles.statsCard}>
        {stats.map((stat) => (
          <StatBar key={stat.name} name={stat.name} baseStat={stat.baseStat} />
        ))}
      </View>
    </PokemonDetailSection>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0,height: 4},
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
});
