import {useEffect} from 'react';
import {
  Easing,
  cancelAnimation,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export type HeroAnimatedStyles = ReturnType<typeof usePokemonHeroAnimation>;

export function usePokemonHeroAnimation() {
  const rotation = useSharedValue(0);
  const bobbing = useSharedValue(0);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360,{duration: 25000,easing: Easing.linear}),
      -1,
      false,
    );
    return () => cancelAnimation(rotation);
  },[rotation]);

  useEffect(() => {
    bobbing.value = withRepeat(
      withSequence(
        withTiming(-8,{duration: 2000,easing: Easing.inOut(Easing.ease)}),
        withTiming(8,{duration: 2000,easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(bobbing);
  },[bobbing]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroStyle = useAnimatedStyle(() => {
    const scale = scrollY.value < 0 ? 1 + Math.abs(scrollY.value) / 250 : 1;
    const translateY = scrollY.value > 0 ? scrollY.value * 0.45 : 0;
    return {
      transform: [{scale},{translateY}],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const scale = scrollY.value > 0 ? Math.max(0.55,1 - scrollY.value / 350) : 1;
    const translateY = scrollY.value > 0 ? bobbing.value + scrollY.value * 0.15 : bobbing.value;
    return {
      transform: [{scale},{translateY}],
    };
  });

  const watermarkStyle = useAnimatedStyle(() => {
    const translateY = scrollY.value > 0 ? scrollY.value * 0.35 : 0;
    return {
      transform: [{rotate: `${rotation.value}deg`},{translateY}],
    };
  });

  return {scrollHandler,heroStyle,imageStyle,watermarkStyle};
}
