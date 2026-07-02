import {PokemonDetailSection} from '@/presentation/components/PokemonDetailSection';
import {colors} from '@/presentation/theme/colors';
import {hexToRgba} from '@/presentation/theme/colorUtils';
import {StyleSheet,Text,View} from 'react-native';

interface PokemonMovesProps {
  moves: string[];
  baseColor: string;
}

export function PokemonMoves({moves,baseColor}: PokemonMovesProps) {
  if (moves?.length === 0) return null;

  return (
    <PokemonDetailSection title="Movimientos destacados" testID="pokemon-moves-section">
      <View style={styles.movesGrid}>
        {moves?.map((move) => (
          <View key={move} style={[styles.moveCard,{backgroundColor: hexToRgba(baseColor,0.06)}]}>
            <Text numberOfLines={1} style={styles.moveText}>
              {move.replace('-',' ')}
            </Text>
          </View>
        ))}
      </View>
    </PokemonDetailSection>
  );
}

const styles = StyleSheet.create({
  movesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moveCard: {
    width: '48.5%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
  },
  moveText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
});
