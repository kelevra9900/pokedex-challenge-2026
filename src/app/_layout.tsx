import {bootstrapContainer} from '@/core/di/container';
import {queryClient} from '@/core/query/queryClient';
import {AppSplashScreen} from '@/presentation/components/AppSplashScreen';
import {QueryClientProvider} from '@tanstack/react-query';
import {Stack} from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import {useEffect,useState} from 'react';
import 'reflect-metadata'; // must be the first import, before container.ts is loaded

bootstrapContainer();

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [splashDone,setSplashDone] = useState(false);

  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  },[]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{headerTitleAlign: 'center'}}>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="pokemon/[id]" options={{title: 'Detalle',animation: 'fade'}} />
      </Stack>
      {!splashDone && (
        <AppSplashScreen onFinish={() => setSplashDone(true)} />
      )}
    </QueryClientProvider>
  );
}
