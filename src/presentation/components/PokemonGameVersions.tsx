import {PokemonDetailSection} from '@/presentation/components/PokemonDetailSection';
import {getGameVersionColor} from '@/presentation/theme/gameVersionColors';
import {StyleSheet,Text,View} from 'react-native';

interface PokemonGameVersionsProps {
  versions: string[];
}

export function PokemonGameVersions({versions}: PokemonGameVersionsProps) {
  if (versions?.length === 0) return null;

  return (
    <PokemonDetailSection title="Apariciones en videojuegos" testID="pokemon-game-versions-section">
      <View style={styles.versionsRow}>
        {versions?.map((version) => (
          <View
            key={version}
            style={[styles.versionChip,{backgroundColor: getGameVersionColor(version)}]}
          >
            <Text style={styles.versionText}>{version.replace('-',' ')}</Text>
          </View>
        ))}
      </View>
    </PokemonDetailSection>
  );
}

const styles = StyleSheet.create({
  versionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  versionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {width: 0,height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1.5,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
});
