import {colors} from '@/presentation/theme/colors';
import {useEffect} from 'react';
import {type DimensionValue,StyleSheet} from 'react-native';
import Animated,{
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonBoxProps {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  style?: object;
}

export function SkeletonBox({width,height,borderRadius = 8,style}: SkeletonBoxProps) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.85,{duration: 650}),withTiming(0.35,{duration: 650})),
      -1,
      true,
    );
  },[opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.base,{width,height,borderRadius},animatedStyle,style]} />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.skeleton,
  },
});
