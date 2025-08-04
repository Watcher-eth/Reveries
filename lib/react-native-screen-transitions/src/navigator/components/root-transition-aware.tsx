import { memo } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { _useScreenAnimation } from "../hooks/use-screen-animation";

interface RootTransitionAwareProps {
	children: React.ReactNode;
}

export const RootTransitionAware = memo(
	({ children }: RootTransitionAwareProps) => {
		const { screenInterpolatorProps, screenStyleInterpolator } =
			_useScreenAnimation();

		const animatedContentStyle = useAnimatedStyle(() => {
			"worklet";
			if (!screenStyleInterpolator) {
				return {};
			}
			const props = screenInterpolatorProps.value;
			return screenStyleInterpolator(props).contentStyle || {};
		});

		const animatedOverlayStyle = useAnimatedStyle(() => {
			"worklet";
			if (!screenStyleInterpolator) {
				return {};
			}
			return (
				screenStyleInterpolator(screenInterpolatorProps.value).overlayStyle ||
				{}
			);
		});

		return (
			<Animated.View style={[{ flex: 1 }]}>
				<Animated.View
					style={[StyleSheet.absoluteFillObject, animatedOverlayStyle]}
					pointerEvents="none"
				/>
				<Animated.View style={[{ flex: 1 }, animatedContentStyle]}>
					{children}
				</Animated.View>
			</Animated.View>
		);
	},
);
