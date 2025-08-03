import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { RootSiblingParent } from "react-native-root-siblings"
import 'react-native-reanimated';


import { useColorScheme } from '@/components/useColorScheme';
import { GestureHandlerRootView } from "react-native-gesture-handler"

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'SFPro':          require('../assets/fonts/SFProRounded-Regular.ttf'),
    'SFPro-Medium': require('../assets/fonts/SFProRounded-Medium.ttf'),
    'SFPro-Bold':   require('../assets/fonts/SFProRounded-Bold.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        <RootSiblingParent>
          <Stack>
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>
      </RootSiblingParent>
    </GestureHandlerRootView>
    </ThemeProvider>
  );
}
