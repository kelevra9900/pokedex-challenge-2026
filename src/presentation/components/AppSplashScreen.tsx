import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import {Dimensions,StyleSheet,View} from 'react-native';
import Animated,{
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const {width,height} = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

// ─── Pokéball animada (dibujada con Views nativas) ─────────────────────────
function AnimatedPokeball({size}: {size: number}) {
  const borderWidth = size * 0.08;
  const centerSize = size * 0.32;
  const innerDotSize = size * 0.12;

  return (
    <View style={{width: size,height: size}} pointerEvents="none">
      {/* Mitad superior roja */}
      <View
        style={[
          styles.pokeballHalf,
          {
            backgroundColor: '#EF4444',
            borderTopLeftRadius: size / 2,
            borderTopRightRadius: size / 2,
            height: size / 2,
          },
        ]}
      />
      {/* Mitad inferior blanca */}
      <View
        style={[
          styles.pokeballHalf,
          {
            backgroundColor: '#F8F9FA',
            borderBottomLeftRadius: size / 2,
            borderBottomRightRadius: size / 2,
            height: size / 2,
          },
        ]}
      />
      {/* Borde exterior */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: size / 2,
            borderWidth: borderWidth,
            borderColor: '#1C1C1E',
          },
        ]}
      />
      {/* Franja central */}
      <View
        style={[
          styles.pokeballBand,
          {
            height: borderWidth,
            top: size / 2 - borderWidth / 2,
            backgroundColor: '#1C1C1E',
          },
        ]}
      />
      {/* Botón central (aro) */}
      <View
        style={[
          styles.pokeballButton,
          {
            width: centerSize,
            height: centerSize,
            borderRadius: centerSize / 2,
            top: size / 2 - centerSize / 2,
            left: size / 2 - centerSize / 2,
            borderWidth: borderWidth * 0.8,
            borderColor: '#1C1C1E',
            backgroundColor: '#FFFFFF',
          },
        ]}
      >
        <View
          style={{
            width: innerDotSize,
            height: innerDotSize,
            borderRadius: innerDotSize / 2,
            backgroundColor: '#E5E5EA',
          }}
        />
      </View>
    </View>
  );
}

export function AppSplashScreen({onFinish}: SplashScreenProps) {
  // ── Shared values ────────────────────────────────────────────────────────
  const pokeballScale = useSharedValue(0.6);
  const pokeballRotation = useSharedValue(0);
  const pokeballY = useSharedValue(0);
  const pokeballOpacity = useSharedValue(0);

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);

  const screenOpacity = useSharedValue(1);

  // ── Animated styles ──────────────────────────────────────────────────────
  const pokeballStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: pokeballScale.value},
      {rotate: `${pokeballRotation.value}deg`},
      {translateY: pokeballY.value},
    ],
    opacity: pokeballOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{translateY: titleY.value}],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  useEffect(() => {
    // ── Secuencia de animación ────────────────────────────────────────────

    // 1. Pokéball aparece y gira entrando
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    pokeballOpacity.value = withTiming(1,{duration: 300});
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    pokeballScale.value = withSpring(1,{damping: 10,stiffness: 150});
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    pokeballRotation.value = withSequence(
      withTiming(720,{duration: 800,easing: Easing.out(Easing.cubic)}),
      withDelay(
        300,
        // Pequeño wiggle idle
        withSequence(
          withTiming(-8,{duration: 150}),
          withTiming(8,{duration: 150}),
          withTiming(0,{duration: 150}),
        ),
      ),
    );

    // 2. Título aparece con slide-up
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    titleOpacity.value = withDelay(700,withTiming(1,{duration: 500}));
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    titleY.value = withDelay(700,withSpring(0,{damping: 14,stiffness: 120}));

    // 3. Subtítulo aparece
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    subtitleOpacity.value = withDelay(1000,withTiming(1,{duration: 400}));

    // 4. Pokéball flota hacia arriba ligeramente (idle)
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    pokeballY.value = withDelay(
      900,
      withSequence(
        withTiming(-6,{duration: 900,easing: Easing.inOut(Easing.ease)}),
        withTiming(6,{duration: 900,easing: Easing.inOut(Easing.ease)}),
        withTiming(-6,{duration: 900,easing: Easing.inOut(Easing.ease)}),
      ),
    );

    // 5. Fade-out de toda la pantalla y llama onFinish
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value
    screenOpacity.value = withDelay(
      4600,
      withTiming(0,{duration: 500,easing: Easing.in(Easing.ease)},(finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <Animated.View style={[styles.container,containerStyle]}>
      <StatusBar style="light" animated={true} />

      <View style={styles.bgCircleLarge} />
      <View style={styles.bgCircleMedium} />

      <Animated.View style={[styles.pokeballWrapper,pokeballStyle]}>
        <AnimatedPokeball size={140} />
      </Animated.View>

      <Animated.Text
        style={[styles.title,titleStyle]}
        testID={'title-pokedex'}
      >
        Pokédex
      </Animated.Text>

      <Animated.Text style={[styles.subtitle,subtitleStyle]}
        testID={'explore-world-pokemon'}>
        Explora el mundo Pokémon
      </Animated.Text>

      <View style={[styles.decorDot,styles.decorDot1]} />
      <View style={[styles.decorDot,styles.decorDot2]} />
      <View style={[styles.decorDot,styles.decorDot3]} />
      <View style={[styles.decorDot,styles.decorDot4]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: '#3B4CCA',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  // Fondo con círculos de brillo concéntricos
  bgCircleLarge: {
    position: 'absolute',
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: width * 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    top: height / 2 - width * 0.7,
    left: -width * 0.2,
  },
  bgCircleMedium: {
    position: 'absolute',
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: height / 2 - width * 0.425,
    left: width / 2 - width * 0.425,
  },
  pokeballWrapper: {
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOffset: {width: 0,height: 16},
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 20,
  },
  pokeballHalf: {
    width: '100%',
  },
  pokeballBand: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  pokeballButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 0,height: 2},
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.72)',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  // Puntos decorativos flotantes
  decorDot: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorDot1: {
    width: 12,
    height: 12,
    top: height * 0.18,
    left: width * 0.12,
  },
  decorDot2: {
    width: 8,
    height: 8,
    top: height * 0.28,
    right: width * 0.1,
  },
  decorDot3: {
    width: 18,
    height: 18,
    bottom: height * 0.22,
    left: width * 0.08,
  },
  decorDot4: {
    width: 10,
    height: 10,
    bottom: height * 0.3,
    right: width * 0.15,
  },
});
