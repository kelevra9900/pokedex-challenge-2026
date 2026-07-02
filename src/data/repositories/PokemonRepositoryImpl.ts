import {injectable} from 'tsyringe';
import type {PokemonDetail,PokemonSummary} from '../../domain/entities/Pokemon';
import type {PokemonRepository} from '../../domain/repositories/PokemonRepository';
import type {PokemonLocalDataSource} from '../datasources/local/PokemonLocalDataSource';
import type {PokemonRemoteDataSource} from '../datasources/remote/PokemonRemoteDataSource';
import {mapPokemonDetailDtoToEntity,mapPokemonListDtoToEntities} from '../mappers/pokemonMapper';

@injectable()
export class PokemonRepositoryImpl implements PokemonRepository {
  constructor(
    private readonly remote: PokemonRemoteDataSource,
    private readonly local: PokemonLocalDataSource,
  ) { }

  async getPokemonList(limit: number,offset: number): Promise<PokemonSummary[]> {
    const dto = await this.remote.fetchPokemonList(limit,offset);
    const baseEntities = mapPokemonListDtoToEntities(dto);

    // Bounded to a fixed page size (20), so hydrating each entry with its detail
    // (for type + official artwork) is a one-time cost, cached locally afterwards.
    // allSettled: one flaky detail request must not fail the whole page — the
    // entry just falls back to its placeholder sprite and an empty type list.
    const results = await Promise.allSettled(
      baseEntities.map(async (entity) => {
        const detailDto = await this.remote.fetchPokemonDetail(entity.id);
        const detail = mapPokemonDetailDtoToEntity(detailDto);
        this.local.savePokemonDetail(detail);
        return detail;
      }),
    );

    const entities: PokemonSummary[] = baseEntities.map((entity,index) => {
      const result = results[index];
      if (result.status === 'fulfilled') {
        return {...entity,imageUrl: result.value.imageUrl,types: result.value.types};
      }
      return entity;
    });

    this.local.savePokemonList(limit,offset,entities);
    return entities;
  }

  getCachedPokemonList(limit: number,offset: number): PokemonSummary[] | undefined {
    const list = this.local.getPokemonList(limit,offset);
    if (!list) return undefined;

    // Si la lista en caché contiene elementos incompletos (sin tipos cargados),
    // se invalida para forzar una recarga y completar los tipos.
    const hasIncomplete = list.some((pokemon) => !pokemon.types || pokemon.types.length === 0);
    if (hasIncomplete) {
      return undefined;
    }

    return list;
  }

  async getPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
    const dto = await this.remote.fetchPokemonDetail(idOrName);
    const entity = mapPokemonDetailDtoToEntity(dto);
    this.local.savePokemonDetail(entity);
    return entity;
  }

  getCachedPokemonDetail(idOrName: string | number): PokemonDetail | undefined {
    return this.local.getPokemonDetail(idOrName);
  }
}
