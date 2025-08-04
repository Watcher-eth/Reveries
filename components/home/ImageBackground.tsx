// DottedPhotoField.tsx
import React, { useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import {
  Canvas, Fill, Shader, Skia, Group,
  RoundedRect, Shadow, Image as SkImage, useImage, rrect, rect
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useDerivedValue, useAnimatedStyle } from "react-native-reanimated";
import Transition from "@/lib/react-native-screen-transitions/src";
import { router } from "expo-router";
import { layoutSpiral, Photo } from "./Spiral";
import StampNode from "../ui/StampFrame"

// ── dotted background shader ─────────────────
const DOTS = `
uniform vec2  u_off; uniform float u_step; uniform float u_rad;
uniform vec4  u_bg;  uniform vec4  u_fg;
half4 main(vec2 xy){
  vec2 p = fract((xy + u_off) / u_step) - 0.5;
  float a = step(length(p), u_rad);
  return mix(u_bg, u_fg, a);
}`;
const DOT_EFFECT = Skia.RuntimeEffect.Make(DOTS)!;
const STEP = 22, RAD = 0.08;
const BG = [248/255,248/255,248/255,1], FG = [224/255,224/255,224/255,1];

type Props = { photos: Photo[] };

export default function DottedPhotoField({ photos }: Props) {
  const { width, height } = useWindowDimensions();

  // pan / zoom
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const scale = useSharedValue(1);

  const gesture = useMemo(
    () =>
      Gesture.Simultaneous(
        Gesture.Pan().onChange((e) => { tx.value += e.changeX; ty.value += e.changeY; }),
        Gesture.Pinch().onChange((e) => {
          const next = Math.max(0.5, Math.min(3, scale.value * e.scale));
          scale.value = next;
        })
      ),
    []
  );

  // shader uniforms
  const uniforms = useDerivedValue(() => {
    let ux = (-tx.value) % STEP; if (ux < 0) ux += STEP;
    let uy = (-ty.value) % STEP; if (uy < 0) uy += STEP;
    return { u_off: [ux, uy], u_step: STEP, u_rad: RAD, u_bg: BG, u_fg: FG };
  });

  // world transform for Skia layer
  const world = useDerivedValue(() => ([
    { translateX: tx.value }, { translateY: ty.value }, { scale: scale.value },
  ]));

  // positions
  const placed = useMemo(
    () => layoutSpiral(photos, { center: { x: 0, y: 0 }, targetMinor: 180 }),
    [photos]
  );

  return (
    <GestureDetector gesture={gesture}>
      <View style={StyleSheet.absoluteFill}>
        {/* Skia draws background + photos; it doesn't handle touches */}
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          <Fill><Shader source={DOT_EFFECT} uniforms={uniforms} /></Fill>
          <Group transform={world}>
          {placed.map((p) => <StampNode key={p.id} {...p} />)}
          </Group>
        </Canvas>

        {/* Overlay pressables for shared-bounds (touch layer) */}
        {placed.map((p) => (
          <PhotoHitbox
            key={`hit-${p.id}`}
            id={p.id}
            x={p.x} y={p.y} w={p.w} h={p.h} rot={p.rot}
            tx={tx} ty={ty} scale={scale}
          />
        ))}
      </View>
    </GestureDetector>
  );
}

// Skia photo card (rounded, white 7px border, shadow)
function PhotoNode(p: { id:string; uri:string; x:number;y:number;w:number;h:number;rot:number }) {
  const img = useImage(p.uri);
  const R = 18, BORDER = 7;

  const x = p.x - p.w/2, y = p.y - p.h/2;
  const ix = x + BORDER, iy = y + BORDER, iw = p.w - 2*BORDER, ih = p.h - 2*BORDER;
  const clipInner = rrect(rect(ix, iy, iw, ih), Math.max(0, R - BORDER), Math.max(0, R - BORDER));

  return (
    <Group origin={{ x: p.x, y: p.y }} transform={[{ rotate: p.rot }]}>
      <RoundedRect x={x} y={y} width={p.w} height={p.h} r={R} color="white">
        <Shadow dx={0} dy={8} blur={18} color="rgba(0,0,0,0.18)" />
      </RoundedRect>
      <Group clip={clipInner}>
        {img && <SkImage image={img} x={ix} y={iy} width={iw} height={ih} fit="cover" />}
      </Group>
    </Group>
  );
}

// Invisible RN view that mirrors the transform & provides the shared-bound
function PhotoHitbox({
  id, x, y, w, h, rot, tx, ty, scale,
}: {
  id: string; x:number;y:number;w:number;h:number;rot:number;
  tx: Animated.SharedValue<number>;
  ty: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => ({
    position: "absolute",
    width: w, height: h,
    transform: [
      { translateX: tx.value }, { translateY: ty.value }, { scale: scale.value },
      { translateX: x + w/2 }, { translateY: y + h/2 },
      { rotate: `${rot}rad` },
      { translateX: -w/2 }, { translateY: -h/2 },
    ],
  }), [w, h, x, y, rot]);

  return (
    <Transition.Pressable
      sharedBoundTag={id}
      onPress={() => router.push({ pathname: "/[id]", params: { id, w, h } })}
      style={{ position: "absolute" }}
    >
      <Animated.View style={style} />
    </Transition.Pressable>
  );
}
