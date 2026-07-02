import {StyleSheet,View} from 'react-native';

interface PokeballWatermarkProps {
  size?: number;
  color?: string;
  style?: object;
}

export function PokeballWatermark({
  size = 100,
  color = 'rgba(255, 255, 255, 0.15)',
  style,
}: PokeballWatermarkProps) {
  const borderWidth = size * 0.08;
  const centerSize = size * 0.32;
  const innerDotSize = size * 0.12;

  return (
    <View style={[styles.container,{width: size,height: size},style]} pointerEvents="none">
      <View
        style={[
          styles.outerCircle,
          {
            borderColor: color,
            borderWidth,
            borderRadius: size / 2,
          },
        ]}
      />

      <View
        style={[
          styles.divider,
          {
            backgroundColor: color,
            height: borderWidth,
            top: size / 2 - borderWidth / 2,
          },
        ]}
      />
      <View
        style={[
          styles.centerCircle,
          {
            borderColor: color,
            borderWidth: borderWidth * 0.8,
            width: centerSize,
            height: centerSize,
            borderRadius: centerSize / 2,
            top: size / 2 - centerSize / 2,
            left: size / 2 - centerSize / 2,
          },
        ]}
      >
        <View
          style={[
            styles.innerDot,
            {
              backgroundColor: color,
              width: innerDotSize,
              height: innerDotSize,
              borderRadius: innerDotSize / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  divider: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  centerCircle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    alignSelf: 'center',
  },
});
