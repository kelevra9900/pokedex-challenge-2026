import {createMMKV} from 'react-native-mmkv';
import "reflect-metadata";
import {container} from 'tsyringe';
import {PokemonLocalDataSourceImpl} from '../../data/datasources/local/PokemonLocalDataSourceImpl';
import {PokemonRemoteDataSourceImpl} from '../../data/datasources/remote/PokemonRemoteDataSourceImpl';
import {FavoritesRepositoryImpl} from '../../data/repositories/FavoritesRepositoryImpl';
import {PokemonRepositoryImpl} from '../../data/repositories/PokemonRepositoryImpl';
import {GetPokemonDetailUseCase} from '../../domain/usecases/GetPokemonDetailUseCase';
import {GetPokemonListUseCase} from '../../domain/usecases/GetPokemonListUseCase';
import {ToggleFavoriteUseCase} from '../../domain/usecases/ToggleFavoriteUseCase';
import {createHttpClient} from '../http/httpClient';
import {DI_TOKENS} from './tokens';

// Every registration below uses useFactory + explicit c.resolve() calls instead of
// relying on TSyringe's implicit constructor-type auto-wiring. Babel/Metro transforms
// decorator *syntax* but doesn't emit TypeScript's design:paramtypes metadata the way
// `tsc --emitDecoratorMetadata` would, so auto-wiring by constructor type is unreliable
// here. Explicit factories sidestep that gap entirely while keeping TSyringe as the
// single composition root and dependencies swappable in tests.
export function bootstrapContainer(): void {
  const httpClient = createHttpClient();
  const storage = createMMKV({id: 'pokedex-cache'});
  const favoritesStorage = createMMKV({id: 'pokedex-favorites'});

  container.register(DI_TOKENS.HttpClient,{useValue: httpClient});

  container.register(DI_TOKENS.PokemonRemoteDataSource,{
    useFactory: (c) => new PokemonRemoteDataSourceImpl(c.resolve(DI_TOKENS.HttpClient)),
  });

  container.register(DI_TOKENS.PokemonLocalDataSource,{
    useFactory: () => new PokemonLocalDataSourceImpl(storage),
  });

  container.register(DI_TOKENS.PokemonRepository,{
    useFactory: (c) =>
      new PokemonRepositoryImpl(
        c.resolve(DI_TOKENS.PokemonRemoteDataSource),
        c.resolve(DI_TOKENS.PokemonLocalDataSource),
      ),
  });

  container.register(DI_TOKENS.FavoritesRepository,{
    useFactory: () => new FavoritesRepositoryImpl(favoritesStorage),
  });

  container.register(DI_TOKENS.GetPokemonListUseCase,{
    useFactory: (c) => new GetPokemonListUseCase(c.resolve(DI_TOKENS.PokemonRepository)),
  });

  container.register(DI_TOKENS.GetPokemonDetailUseCase,{
    useFactory: (c) => new GetPokemonDetailUseCase(c.resolve(DI_TOKENS.PokemonRepository)),
  });

  container.register(DI_TOKENS.ToggleFavoriteUseCase,{
    useFactory: (c) => new ToggleFavoriteUseCase(c.resolve(DI_TOKENS.FavoritesRepository)),
  });
}

export {container};

