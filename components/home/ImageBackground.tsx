// DottedPhotoField.tsx
import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import {
  Canvas, Fill, Shader, Skia, Group,
  RoundedRect, Shadow, Image as SkImage, useImage,
  rrect,
  rect
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";
import { layoutSpiral, Photo } from "./Spiral";

// ---- dotted background shader (SKSL) ----
const DOTS = `
uniform vec2  u_off;   // pixel offset
uniform float u_step;  // cell size
uniform float u_rad;   // dot radius (0..0.5 of cell)
uniform vec4  u_bg;    // background
uniform vec4  u_fg;    // dot color

half4 main(vec2 xy) {
  vec2 p = fract((xy + u_off) / u_step) - 0.5;
  float a = step(length(p), u_rad);
  return mix(u_bg, u_fg, a);
}
`;
const DOT_EFFECT = Skia.RuntimeEffect.Make(DOTS)!;

// colors (#f8f8f8 bg, #E0E0E0 dots) + smaller dots
const STEP = 22;      // px between dots
const RAD  = 0.08;    // as fraction of STEP
const BG   = [248/255, 248/255, 248/255, 1] as const;
const FG   = [224/255, 224/255, 224/255, 1] as const;

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
        Gesture.Pan().onChange((e) => {
          tx.value += e.changeX;
          ty.value += e.changeY;
        }),
        Gesture.Pinch().onChange((e) => {
          const next = Math.max(0.5, Math.min(3, scale.value * e.scale));
          scale.value = next;
        })
      ),
    []
  );

  // shader uniforms (computed on UI thread)
  const uniforms = useDerivedValue(() => {
    // move background opposite to content; keep bounded via modulo
    let ux = (-tx.value) % STEP; if (ux < 0) ux += STEP;
    let uy = (-ty.value) % STEP; if (uy < 0) uy += STEP;
    return {
      u_off:  [ux, uy] as [number, number],
      u_step: STEP,
      u_rad:  RAD,
      u_bg:   BG as unknown as number[], // Skia accepts number[]
      u_fg:   FG as unknown as number[],
    };
  });

  // world transform for all photos
  const worldTransform = useDerivedValue(() => ([
    { translateX: tx.value },
    { translateY: ty.value },
    { scale:      scale.value },
  ]));

  // layout once, centered
  const placed = useMemo(
    () => layoutSpiral(photos, { center: { x: 0, y: 0 }, targetMinor: 180 }),
    [photos]
  );

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ flex: 1, width, height }}>
        {/* dotted infinite background */}
        <Fill>
          <Shader source={DOT_EFFECT} uniforms={uniforms} />
        </Fill>

        {/* photo layer */}
        <Group transform={worldTransform}>
          {placed.map((p) => (
            <PhotoNode key={p.id} {...p} />
          ))}
        </Group>
      </Canvas>
    </GestureDetector>
  );
}

function PhotoNode(p: {
    id: string; uri: string;
    x: number; y: number; w: number; h: number; rot: number;
  }) {
    const img = useImage(p.uri);
  
    // Card metrics
    const R = 18;          // outer corner radius
    const BORDER = 7;      // white border width
  
    // (Use /2 if you want the image centered; /3 was likely accidental.)
    const x = p.x - p.w / 2;
    const y = p.y - p.h / 2;
  
    // Inner image rect (inset by the border)
    const ix = x + BORDER;
    const iy = y + BORDER;
    const iw = p.w - 2 * BORDER;
    const ih = p.h - 2 * BORDER;
  
    const clipInner = rrect(rect(ix, iy, iw, ih), Math.max(0, R - BORDER), Math.max(0, R - BORDER));
  
    return (
      <Group origin={{ x: p.x, y: p.y }} transform={[{ rotate: p.rot }]}>
        {/* white card (acts as 4px border) */}
        <RoundedRect x={x} y={y} width={p.w} height={p.h} r={R} color="white">
          <Shadow dx={0} dy={8} blur={18} color="rgba(0,0,0,0.18)" />
        </RoundedRect>
  
        {/* clipped image with the same rounded corners minus the border */}
        <Group clip={clipInner}>
          {img && (
            <SkImage image={img} x={ix} y={iy} width={iw} height={ih} fit="cover" />
          )}
        </Group>
      </Group>
    );
  }
  