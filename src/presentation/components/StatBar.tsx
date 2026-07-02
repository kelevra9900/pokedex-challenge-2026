import {colors} from '@/presentation/theme/colors';
import {useEffect} from 'react';
import {StyleSheet,Text,View} from 'react-native';
import Animated,{
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface StatBarProps {
  name: string;
  baseStat: number;
  maxStat?: number;
}

function getStatColor(value: number): string {
  if (value < 50) return '#FF5252';
  if (value < 85) return '#FFB300';
  if (value < 120) return '#4CAF50';
  return '#00B0FF';
}

export function StatBar({name,baseStat,maxStat = 200}: StatBarProps) {
  const percentage = Math.min(100,Math.round((baseStat / maxStat) * 100));
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(percentage / 100,{
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  },[percentage,progress]);

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{scaleX: progress.value}],
  }));

  const statColor = getStatColor(baseStat);

  return (
    <View style={styles.row}>
      <Text style={styles.name}>{name.replace('-',' ')}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill,{backgroundColor: statColor},fillStyle]} />
      </View>
      <Text style={styles.value}>{baseStat}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  name: {
    width: 95,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E5EA',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    transformOrigin: 'left',
  },
  value: {
    width: 32,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
});
