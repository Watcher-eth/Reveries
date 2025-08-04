import "react-native-reanimated";
import type {
	ParamListBase,
	StackNavigationState,
} from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { createNativeStackNavigator, NativeStackNavigationEventMap, NativeStackNavigationOptions } from "@/lib/react-native-screen-transitions/src"

const { Navigator } = createNativeStackNavigator();

export const Stack = withLayoutContext<
	NativeStackNavigationOptions,
	typeof Navigator,
	StackNavigationState<ParamListBase>,
	NativeStackNavigationEventMap
>(Navigator);