// CreateVideo.tsx
import React, { useState } from "react";
import { View, Text, TextInput, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SymbolView } from "expo-symbols";
import Animated, { FadeIn } from "react-native-reanimated";

import GridMaskedBackground from "../ui/GridBackground";
import { AnimatedPressable } from "../ui/AnimatedPressable";
import { Skia, PathOp, rect } from "@shopify/react-native-skia";


/** Build a rectangle minus circular “bites” along its edges. */
function makeStampOutline(w: number, h: number, tooth = 12) {
    const outline = Skia.Path.Make();
    const bites   = Skia.Path.Make();
  
    outline.addRect(rect(0, 0, w, h));
  
    const r = tooth / 2;
    for (let x = tooth / 2; x < w; x += tooth) {
      bites.addCircle(x, 0, r);
      bites.addCircle(x, h, r);
    }
    for (let y = tooth / 2; y < h; y += tooth) {
      bites.addCircle(0, y, r);
      bites.addCircle(w, y, r);
    }
    outline.op(bites, PathOp.Difference);
    return outline;
  }
  

export default function CreateVideo() {
  const nav = useRouter();
  const { height } = useWindowDimensions();
  const [frame, setFrame] = useState({ w: 0, h: 0 });   // <- new


  // ――― local state ―――
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [memory, setMemory] = useState("");

  // ════════════════════════════════════════════════════════════════════
  async function pickImage() {
    // Ask for library permission on first use
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!res.canceled) {
      setPhotoUri(res.assets[0].uri);
    }
  }
  // ════════════════════════════════════════════════════════════════════

  return (
    <View style={{ flex: 1 }}>
      {/* top bar */}
      <LinearGradient
        colors={["#fefefe", "rgba(255,255,255,0)"]}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
paddingVertical: 30,
          paddingTop: 60,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          zIndex: 1000,
        }}
      >
        <AnimatedPressable
          onPress={() => nav.navigate("/create")}
          contentStyle={{ flexDirection: "row", alignItems: "center", zIndex: 1000 }}
        >
          <Text style={{ fontFamily: "SFPro-Bold", fontSize: 26, color: "#727070" }}>
            Create Memory
          </Text>
        </AnimatedPressable>

        <AnimatedPressable onPress={() => nav.back()} containerStyle={{ paddingTop: 6 }}>
          <SymbolView name="xmark" size={20} tintColor="#727070" weight="bold" />
        </AnimatedPressable>
      </LinearGradient>
      <GridMaskedBackground />
      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(240, 240, 240, 0.5)", "#fefefe"]}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 30,
          paddingTop: 60,
          height: height * 0.8,
          width: "100%",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          zIndex: 1000,
          position: "absolute",
          bottom: 0,
        }}
      />
      <AnimatedPressable
        onPress={pickImage}
        containerStyle={{
          height: height * 0.5,
          width: "92%",
          backgroundColor: "#fff",
          borderRadius: 20,
          alignSelf: "center",
          marginTop: 0,
          zIndex: 1000,
        }}
        contentStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: "96%",
            width: "96%",
            backgroundColor: "#f8f8f8",
            borderRadius: 15,
            alignSelf: "center",
            borderWidth: photoUri ? 0 : 3,
            borderColor: "#EFEFEF",
            borderStyle: "dashed",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {photoUri ? (
            <Animated.Image
              entering={FadeIn}
              source={{ uri: photoUri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <SymbolView
              name="photo.badge.plus"
              size={124}
              tintColor="#E9E9E9"
              weight="medium"
              animationSpec={{
                effect: { type: "bounce" },
                repeating: true,
                speed: 0.04,
              }}
            />
          )}
        </View>
      </AnimatedPressable>

      {/* ─── Description input ─────────────────────────────── */}
      <Text
        style={{
          fontFamily: "SFPro-Bold",
          fontSize: 17,
          color: "#8a8a8a",
          marginTop: 15,
          paddingHorizontal: 20,
          zIndex: 1000,

        }}
      >
        Describe your memory
      </Text>

      <View
        style={{
          height: height * 0.2,
          width: "92%",
          backgroundColor: "#fff",
          borderRadius: 20,
          alignSelf: "center",
          marginTop: 7,
          borderWidth: 1.5,
          borderColor: "#EFEFEF",
          padding: 14,
          paddingTop: 12,
          zIndex: 1000,

        }}
      >
        <TextInput
          value={memory}
          onChangeText={setMemory}
          placeholder="It was a beautiful winter day in the Scottish Highlands with my Grandmas…"
          placeholderTextColor="#bbb"
          multiline
          style={{
            flex: 1,
            fontFamily: "SFPro-Bold",
            fontSize: 17,
            color: "#404040sa",
            textAlignVertical: "top",
          }}
        />
      </View>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <AnimatedPressable
        onPress={() => {
          /* perform upload here */
        }}
        containerStyle={{
          height: 60,
          width: "92%",
          backgroundColor: photoUri ? "#000" : "#555", // disabled look if no photo
          borderRadius: 30,
          alignSelf: "center",
          marginTop: 20,
          borderWidth: 1.5,
          borderColor: "#EFEFEF",
          opacity: photoUri ? 1 : 0.5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,


        }}
        contentStyle={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
        disabled={!photoUri}
      >
        <SymbolView
          name="sparkles.rectangle.stack.fill"
          size={24}
          tintColor="#fff"
          weight="black"
        />
        <Text style={{ fontFamily: "SFPro-Bold", fontSize: 20, color: "#fff" }}>
          Create Reverie
        </Text>
      </AnimatedPressable>
    </View>
  );
}
