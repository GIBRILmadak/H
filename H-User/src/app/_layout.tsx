import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '@/store/useAppStore';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({});

  useEffect(() => {
    if (loaded) {
      const hideSplash = async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          // Ignorer
        }
      };
      hideSplash();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          {/*
            On utilise <Slot /> au lieu de <Stack />.
            Cela évite d'appeler le moteur de navigation natif d'iOS
            qui semble incompatible avec votre version actuelle.
          */}
          <Slot />
        </View>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
