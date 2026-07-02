import {colors} from '@/presentation/theme/colors';
import type {ReactNode} from 'react';
import {StyleSheet,Text,View} from 'react-native';

interface PokemonDetailSectionProps {
  title: string;
  children: ReactNode;
  testID?: string;
}

export function PokemonDetailSection({title,children,testID}: PokemonDetailSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} testID={testID || "pokemon-detail-section-title"}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignSelf: 'stretch',
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 14,
    letterSpacing: 0.1,
  },
});
