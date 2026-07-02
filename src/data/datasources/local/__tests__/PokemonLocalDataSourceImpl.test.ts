import type {PokemonDetail,PokemonSummary} from '../../../../domain/entities/Pokemon';
import {PokemonLocalDataSourceImpl} from '../PokemonLocalDataSourceImpl';

function makeStorage() {
  const store = new Map<string,string>();
  return {
    getString: (key: string) => store.get(key),
    set: (key: string,value: string) => store.set(key,value),
    getBoolean: jest.fn(),
    delete: jest.fn(),
  };
}

const mockSummary: PokemonSummary = {
  id: 1,
  name: 'bulbasaur',
  imageUrl: 'https://img/1.png',
  types: ['grass','poison'],
};

const mockDetail: PokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  imageUrl: 'https://img/1.png',
  height: 7,
  weight: 69,
  types: ['grass','poison'],
  abilities: ['overgrow'],
  stats: [{name: 'hp',baseStat: 45}],
  shinyImageUrl: null,
  baseExperience: 64,
  moves: ['tackle'],
  gameVersions: ['red'],
  heldItems: [],
};

describe('PokemonLocalDataSourceImpl',() => {
  describe('getPokemonList',() => {
    it('returns undefined when no entry is cached',() => {
      const ds = new PokemonLocalDataSourceImpl(makeStorage() as any);
      expect(ds.getPokemonList(20,0)).toBeUndefined();
    });
  });

  describe('savePokemonList / getPokemonList',() => {
    it('round-trips the list through JSON serialization',() => {
      const ds = new PokemonLocalDataSourceImpl(makeStorage() as any);
      ds.savePokemonList(20,0,[mockSummary]);
      expect(ds.getPokemonList(20,0)).toEqual([mockSummary]);
    });

    it('uses a versioned key so different offsets are stored separately',() => {
      const ds = new PokemonLocalDataSourceImpl(makeStorage() as any);
      ds.savePokemonList(20,0,[mockSummary]);
      expect(ds.getPokemonList(20,20)).toBeUndefined();
    });
  });

  describe('savePokemonDetail / getPokemonDetail',() => {
    it('returns undefined when no entry is cached',() => {
      const ds = new PokemonLocalDataSourceImpl(makeStorage() as any);
      expect(ds.getPokemonDetail(1)).toBeUndefined();
    });

    it('indexes by numeric id',() => {
      const ds = new PokemonLocalDataSourceImpl(makeStorage() as any);
      ds.savePokemonDetail(mockDetail);
      expect(ds.getPokemonDetail(1)).toEqual(mockDetail);
    });

    it('indexes by name as well',() => {
      const ds = new PokemonLocalDataSourceImpl(makeStorage() as any);
      ds.savePokemonDetail(mockDetail);
      expect(ds.getPokemonDetail('bulbasaur')).toEqual(mockDetail);
    });

    it('round-trips the full detail object through JSON serialization',() => {
      const ds = new PokemonLocalDataSourceImpl(makeStorage() as any);
      ds.savePokemonDetail(mockDetail);
      const retrieved = ds.getPokemonDetail(mockDetail.id);
      expect(retrieved).toStrictEqual(mockDetail);
    });
  });
});
