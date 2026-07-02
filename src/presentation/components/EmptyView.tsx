import {colors} from '@/presentation/theme/colors';
import {StyleSheet,View} from 'react-native';
import Animated,{BounceIn,FadeInUp} from 'react-native-reanimated';

interface EmptyViewProps {
  message?: string;
}

export function EmptyView({message = 'No hay Pokémon para mostrar por ahora.'}: EmptyViewProps) {
  return (
    <View style={styles.container}>
      <Animated.Text entering={BounceIn.delay(100)} style={styles.emoji}>
        🔍
      </Animated.Text>
      <Animated.Text entering={FadeInUp.delay(200)} style={styles.title}>
        Sin resultados
      </Animated.Text>
      <Animated.Text entering={FadeInUp.delay(280)} style={styles.message}>
        {message}
      </Animated.Text>
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
});
