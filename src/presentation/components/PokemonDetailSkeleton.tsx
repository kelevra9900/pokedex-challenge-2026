import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SkeletonBox } from '@/presentation/components/SkeletonBox';
import { colors } from '@/presentation/theme/colors';

export function PokemonDetailSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.skeletonContainer, { paddingTop: insets.top + 40 }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SkeletonBox width={180} height={180} borderRadius={90} style={styles.skeletonCenter} />
      <SkeletonBox width="60%" height={32} style={[styles.skeletonCenter, styles.spacingTop]} />
      <SkeletonBox width="40%" height={20} style={[styles.skeletonCenter, styles.spacingTop]} />
      <View style={styles.skeletonMetrics}>
        <SkeletonBox width="28%" height={60} borderRadius={16} />
        <SkeletonBox width="28%" height={60} borderRadius={16} />
        <SkeletonBox width="28%" height={60} borderRadius={16} />
      </View>
      <View style={styles.skeletonSection}>
        <SkeletonBox width="30%" height={20} style={styles.spacingBottom} />
        <SkeletonBox width="100%" height={80} borderRadius={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    gap: 16,
  },
  skeletonCenter: {
    alignSelf: 'center',
  },
  spacingTop: {
    marginTop: 12,
  },
  spacingBottom: {
    marginBottom: 8,
  },
  skeletonMetrics: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  skeletonSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
});
