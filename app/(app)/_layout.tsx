// app/(app)/_layout.tsx
import React from 'react';
import { Slot, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export const unstable_settings = {
  // Make 'index' the first screen in this group
  initialRouteName: 'index',
};

export default function AppLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown:      false,
          gestureEnabled:   true,
          gestureDirection: 'horizontal',
        }}
      >
           <Stack.Screen
        name="index"
        options={{
         headerShown: false,
        }}
      />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
