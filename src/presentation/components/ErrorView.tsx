import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/presentation/theme/colors';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({
  message = 'No pudimos cargar la información. Revisa tu conexión e intenta de nuevo.',
  onRetry,
}: ErrorViewProps) {
  const scale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.container}>
      <Animated.Text entering={BounceIn.delay(100)} style={styles.emoji}>
        ⚠️
      </Animated.Text>
      <Animated.Text entering={FadeInUp.delay(200)} style={styles.title}>
        Algo salió mal
      </Animated.Text>
      <Animated.Text entering={FadeInUp.delay(280)} style={styles.message}>
        {message}
      </Animated.Text>
      {onRetry ? (
        <Animated.View entering={FadeInUp.delay(360)} style={buttonStyle}>
          <Pressable
            style={styles.button}
            onPressIn={() => {
              // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value, mutated outside render
              scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
            }}
            onPressOut={() => {
              // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value, mutated outside render
              scale.value = withSpring(1, { damping: 12, stiffness: 200 });
            }}
            onPress={onRetry}
          >
            <Text style={styles.buttonText}>Reintentar</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
