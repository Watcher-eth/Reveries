// app/(app)/_layout.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { interpolate } from '@shopify/react-native-skia'
import { Stack } from '@/components/layout/TransitionStack'
import { Easing } from 'react-native-reanimated'
import Transition from '@/lib/react-native-screen-transitions/src'


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
        				<Stack.Screen
					name="create"
					options={{
						enableTransitions: true,
						gestureEnabled: true,
						gestureDirection: ["horizontal", "vertical"],
						screenStyleInterpolator: ({
							current,
							layouts: { screen },
							progress,
						}) => {
							"worklet";

							/** Combined */
							const scale = interpolate(progress, [0, 1, 2], [0, 1, 0.75]);
							const borderRadius = interpolate(
								progress,
								[0, 1, 2],
								[36, 36, 36],
							);

							/** Vertical */
							const translateY = interpolate(
								current.gesture.normalizedY,
								[-1, 1],
								[-screen.height * 0.5, screen.height * 0.5],
								"clamp",
							);

							/** Horizontal */
							const translateX = interpolate(
								current.gesture.normalizedX,
								[-1, 1],
								[-screen.width * 0.5, screen.width * 0.5],
								"clamp",
							);

							return {
								contentStyle: {
									transform: [
										{ scale },
										{ translateY: translateY },
										{ translateX },
									],
									borderRadius,
								},
							};
						},
						transitionSpec: {
							open: Transition.specs.DefaultSpec,
							close: Transition.specs.DefaultSpec,
						},
					}}
				/>

                     <Stack.Screen
        name="share"
        options={{
         headerShown: false,
         enableTransitions: true,
         ...Transition.presets.ElasticCard(),
        }}

      />

<Stack.Screen
        name="onramp"
        options={{
         headerShown: false,
         ...Transition.presets.ZoomIn(),
         enableTransitions: true,
         ...Transition.presets.ZoomIn(),

          }}

      />

      <Stack.Screen
				name="[id]"
				options={{
					title: "B",
					gestureEnabled: true,
					gestureDirection: ["bidirectional"],
					gestureDrivesProgress: false,
					enableTransitions: true,
					screenStyleInterpolator: ({
						bounds,
						current,
						progress,
						next,
						layouts: { screen },
						focused,
						activeBoundId,
					}) => {
						"worklet";

						if (!activeBoundId) return {};

						const MAX_DRAG_MULTIPLIER = 0.9;

						const modWidth = screen.width * MAX_DRAG_MULTIPLIER;
						const modHeight = screen.height * MAX_DRAG_MULTIPLIER;

						if (focused) {
							const normalizedX = current.gesture.normalizedX;
							const normalizedY = current.gesture.normalizedY;

							const gestureX = interpolate(
								normalizedX,
								[-1, 1],
								[-modWidth, modWidth],
								"clamp",
							);

							const gestureY = interpolate(
								normalizedY,
								[-1, 1],
								[-modHeight, modHeight],
								"clamp",
							);

							const boundsStyle = bounds()
								.start("previous")
								.end("current")
								.x(gestureX)
								.y(gestureY)
								.opacity([1, 1])
								.isEntering()
								.build();

							return {
								[activeBoundId]: {
									...boundsStyle,
									borderTopLeftRadius: interpolate(progress, [0, 1], [100, 5]),
									borderTopRightRadius: interpolate(
										progress,
										[0, 1],
										[100, 5],
									),
									borderBottomLeftRadius: interpolate(
										progress,
										[0, 1],
										[100, 5],
									),
									borderBottomRightRadius: interpolate(
										progress,
										[0, 1],
										[100, 5],
									),
									overflow: "hidden",
								},
								overlayStyle: {
									backgroundColor: "#FFF",
									opacity: interpolate(progress, [0, 1], [0, 1]),
								},
							};
						}

						const nextGestureX = next?.gesture.normalizedX ?? 0;
						const nextGestureY = next?.gesture.normalizedY ?? 0;

						const gestureX = interpolate(
							nextGestureX,
							[-1, 1],
							[-modWidth, modWidth],
							"clamp",
						);

						const gestureY = interpolate(
							nextGestureY,
							[-1, 1],
							[-modHeight, modHeight],
							"clamp",
						);

						const boundsStyle = bounds()
							.start("current")
							.end("next")
							.x(gestureX)
							.y(gestureY)
							.isExiting()
							.build();

						return {
							contentStyle: {
								transform: [
									{
										scale: interpolate(progress, [1, 2], [1, 0.95]),
									},
								],
							},
							[activeBoundId]: {
								...boundsStyle,
								opacity: interpolate(progress, [1, 1.5], [1, 0]),
							},
						};
					},
					transitionSpec: {
						open: Transition.specs.DefaultSpec,
						close: {
							duration: 1000,
							easing: Easing.bezierFn(0.19, 1, 0.22, 1),
						},
					},
				}}
			/>
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
