import type {MMKV} from 'react-native-mmkv';
import type {PokemonDetail,PokemonSummary} from '../../../domain/entities/Pokemon';
import type {PokemonLocalDataSource} from './PokemonLocalDataSource';

export class PokemonLocalDataSourceImpl implements PokemonLocalDataSource {
  constructor(private readonly storage: MMKV) { }
  private listKey(limit: number,offset: number): string {
    return `pokemon-list-v3-${limit}-${offset}`;
  }

  private detailKey(idOrName: string | number): string {
    return `pokemon-detail-${idOrName}`;
  }

  getPokemonList(limit: number,offset: number): PokemonSummary[] | undefined {
    const raw = this.storage.getString(this.listKey(limit,offset));
    return raw ? (JSON.parse(raw) as PokemonSummary[]) : undefined;
  }

  savePokemonList(limit: number,offset: number,pokemons: PokemonSummary[]): void {
    this.storage.set(this.listKey(limit,offset),JSON.stringify(pokemons));
  }

  getPokemonDetail(idOrName: string | number): PokemonDetail | undefined {
    const raw = this.storage.getString(this.detailKey(idOrName));
    return raw ? (JSON.parse(raw) as PokemonDetail) : undefined;
  }

  savePokemonDetail(pokemon: PokemonDetail): void {
    this.storage.set(this.detailKey(pokemon.id),JSON.stringify(pokemon));
    this.storage.set(this.detailKey(pokemon.name),JSON.stringify(pokemon));
  }
}
