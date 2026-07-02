import {useEffect} from 'react';
import {StyleSheet,View} from 'react-native';
import Animated,{
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

function Particle({index,type}: {index: number; type: string}) {
  const animY = useSharedValue(220);
  const animX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const duration = 2500 + Math.random() * 1500;
    const delay = index * 300;
    const startX = 30 + Math.random() * 280;
    const driftX = (Math.random() - 0.5) * 60;

    const runAnimation = () => {
      animX.value = startX;
      animY.value = 220;
      opacity.value = 0;
      scale.value = 0.4 + Math.random() * 0.6;

      animY.value = withTiming(30,{duration,easing: Easing.linear});
      animX.value = withTiming(startX + driftX,{duration,easing: Easing.out(Easing.ease)});
      opacity.value = withSequence(
        withTiming(0.65,{duration: duration * 0.3}),
        withTiming(0,{duration: duration * 0.7}),
      );
      scale.value = withTiming(0.15,{duration});
    };

    const interval = setInterval(() => {
      runAnimation();
    },duration + 400);

    const timeout = setTimeout(() => {
      runAnimation();
    },delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  },[index,animX,animY,opacity,scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: animX.value,
    top: animY.value,
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  let color = 'rgba(255, 255, 255, 0.4)';
  let isBubble = false;
  let isLeaf = false;

  if (type === 'fire') {
    color = ['#FF4D4D','#FF9F43','#FFD2FC'][index % 3];
  } else if (type === 'water') {
    color = '#54a0ff';
    isBubble = true;
  } else if (type === 'grass') {
    color = '#10ac84';
    isLeaf = true;
  } else if (type === 'electric') {
    color = '#fecb3e';
  } else if (type === 'ice') {
    color = '#00d2d3';
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        isBubble
          ? [styles.bubbleParticle,{borderColor: color}]
          : isLeaf
            ? [styles.leafParticle,{backgroundColor: color}]
            : [styles.dotParticle,{backgroundColor: color}],
      ]}
    />
  );
}

export function FloatingParticles({type}: {type: string}) {
  const particlesCount = 8;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({length: particlesCount}).map((_,index) => (
        <Particle key={index} index={index} type={type} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dotParticle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bubbleParticle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  leafParticle: {
    width: 9,
    height: 6,
    borderRadius: 3,
    transform: [{rotate: '45deg'}],
  },
});
