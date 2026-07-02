import type {FavoritePokemon} from '@/presentation/hooks/useFavoritePokemon';
import {Pressable,StyleSheet,View} from 'react-native';
import Animated from 'react-native-reanimated';

interface FavoriteHeartButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  animatedHeartStyle: FavoritePokemon['animatedHeartStyle'];
  particleStyles: FavoritePokemon['particleStyles'];
}

export function FavoriteHeartButton({
  isFavorite,
  onPress,
  animatedHeartStyle,
  particleStyles,
}: FavoriteHeartButtonProps) {
  return (
    <Pressable
      style={styles.headerButton}
      onPress={onPress}
      hitSlop={16}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
      accessibilityHint={isFavorite ? 'Elimina este Pokémon de tu lista de favoritos' : 'Agrega este Pokémon a tu lista de favoritos'}
      accessibilityState={{ selected: isFavorite }}
    >
      <View style={styles.heartContainer}>
        {particleStyles.map((style,index) => (
          <Animated.View key={index} style={[styles.heartParticle,style]} />
        ))}
        <Animated.Text
          style={[styles.headerButtonText,isFavorite && styles.favoriteActive,animatedHeartStyle]}
        >
          {isFavorite ? '♥' : '♡'}
        </Animated.Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  favoriteActive: {
    color: '#FF3B30', // Corazón rojo activo
  },
  heartContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartParticle: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF3B30',
  },
});
