import { router, useLocalSearchParams } from "expo-router";
import { Image, Text, useWindowDimensions, View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
} from "react-native-reanimated";
import Transition, {
	useScreenAnimation,
} from "@/lib/react-native-screen-transitions/src";


const images = [{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx7ccauRpLNkB051Zbkd8lD16J6ZjtbkNzpg&s", w:1024, h:1536, id:"shared-1"}, {uri:"https://live.staticflickr.com/65535/50275523276_f8bf949b70_b.jpg", w:1024, h:770, id:"shared-2"}, {uri:"https://www.thesedaysla.com/cdn/shop/files/sean-maungs-family-portrait-studio_12.jpg?v=1958928779055769292", w:748, h:492, id:"shared-3"}, {uri:"https://cranfordville.com/Photos/D-h0011.jpg", w:300, h:435, id:"shared-4"}, {uri:"https://www.thesedaysla.com/cdn/shop/files/sean-maungs-family-portrait-studio_12.jpg?v=1958928779055769292", w:768, h:1152, id:"shared-5"}, {uri:"https://i.redd.it/florida-vacation-from-around-the-early-2000s-v0-4ulh551gxhta1.png?width=1344&format=png&auto=webp&s=f35140c65583dd19077c3d2d951c23e88331de0a", w:1344, h:896, id:"shared-6"}, {uri:"https://i.redd.it/florida-vacation-from-around-the-early-2000s-v0-vfuq9bityhta1.png?width=1024&format=png&auto=webp&s=2eb5c4a583f5c2db6d2319703d7cd6686e341a87", w:1024, h:1024, id:"shared-7"}, {uri:"https://hellogiggles.com/wp-content/uploads/sites/7/2018/07/22/familytrip-2000.jpg?quality=82&strip=1&resize=640%2C360", w:640, h:360, id:"shared-8"}, {uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBP0F_kVzu0cFMQbz1RK-y23jYbN2UNBkt_w&s", w:1440, h:1800, id:"shared-9"}, ]

export default function BoundsDetailScreen() {
	const { id, w, h } = useLocalSearchParams<{ id: string; w: number; h: number }>();


	const { width } = useWindowDimensions();
	const props = useScreenAnimation();

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: props.value.current.progress,
			transform: [
				{
					translateY: interpolate(
						props.value.current.progress,
						[0.25, 1],
						[50, 0],
						"clamp",
					),
				},
				{
					scale: interpolate(
						props.value.current.progress,
						[0.25, 1],
						[0, 1],
						"clamp",
					),
				},
			],
		};
	});

	const ratio = w / h;
	const height = width / ratio;
	
	return (
		<View style={{ flex: 1 }}>
			<Transition.Pressable
				onPress={router.back}
				style={{
					width: width,
					height: height,
					alignItems: "center",
					justifyContent: "center",
					flex: 0,
				}}
				sharedBoundTag={id}
			>
				<Image
					source={{ uri: images.find((item) => item.id === id)?.uri }}
					style={{ width: width, height: height }}
				/>
			</Transition.Pressable>
			<Animated.View
				style={[
					{
						flex: 1,
						paddingVertical: 30,
						paddingHorizontal: 24,
					},
					animatedStyle,
				]}
			>
				<Text style={{ color: "#000", fontSize: 26, fontWeight: "600" }}>
					Our first family picture
				</Text>
				<Text
					style={{
						color: "#404040",
						fontSize: 16,
						fontWeight: "500",
						opacity: 0.75,
					}}
				>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
				</Text>
			</Animated.View>
		</View>
	);
}
