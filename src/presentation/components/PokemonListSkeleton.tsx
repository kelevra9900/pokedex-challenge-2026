import { View, StyleSheet } from 'react-native';
import { SkeletonBox } from './SkeletonBox';
import { colors } from '@/presentation/theme/colors';

export const CARD_HEIGHT = 148;

interface SkeletonCardProps {
  viewMode?: 'list' | 'grid';
}

function SkeletonCard({ viewMode = 'list' }: SkeletonCardProps) {
  const isGrid = viewMode === 'grid';

  if (isGrid) {
    return (
      <View style={styles.gridCard}>
        <View style={styles.gridTextColumn}>
          <SkeletonBox width={40} height={10} />
          <SkeletonBox width="80%" height={18} style={styles.spacingTop} />
          <SkeletonBox width={50} height={16} borderRadius={8} style={styles.spacingTop} />
        </View>
        <SkeletonBox width={65} height={65} borderRadius={12} style={styles.gridImage} />
      </View>
    );
  }

  return (
    <View style={styles.listCard}>
      <View style={styles.listTextColumn}>
        <SkeletonBox width={50} height={12} />
        <SkeletonBox width="70%" height={22} style={styles.spacingTop} />
        <SkeletonBox width={90} height={20} borderRadius={10} style={styles.spacingTop} />
      </View>
      <SkeletonBox width={110} height={110} borderRadius={16} />
    </View>
  );
}

interface PokemonListSkeletonProps {
  viewMode?: 'list' | 'grid';
}

export function PokemonListSkeleton({ viewMode = 'list' }: PokemonListSkeletonProps) {
  const isGrid = viewMode === 'grid';

  return (
    <View style={isGrid ? styles.gridContainer : styles.listContainer}>
      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} viewMode={viewMode} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  listCard: {
    height: CARD_HEIGHT,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  gridCard: {
    width: '46.5%', // Ocupa casi la mitad
    height: 145,
    margin: '1.75%',
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    position: 'relative',
  },
  listTextColumn: {
    flex: 1,
  },
  gridTextColumn: {
    flex: 1,
  },
  gridImage: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  spacingTop: {
    marginTop: 8,
  },
});
