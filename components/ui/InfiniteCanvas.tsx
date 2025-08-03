// InfiniteCanvas.tsx
import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { Canvas, Fill, Shader, Skia, vec } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";

const DOTS = `
uniform vec2  u_off;
uniform float u_step;
uniform float u_rad;
uniform vec4  u_bg;
uniform vec4  u_fg;

vec4 main(vec2 xy) {
  vec2 p = fract((xy + u_off) / u_step) - 0.5;
  float a = step(length(p), u_rad);
  return mix(u_bg, u_fg, a);
}
`;

export default function InfiniteCanvas() {
  const { width, height } = useWindowDimensions();

  const effect = useMemo(() => {
    const e = Skia.RuntimeEffect.Make(DOTS);
    if (!e) throw new Error("Shader compile failed");
    return e;
  }, []);

  // Smaller dots: smaller step + smaller radius
  const STEP = 28;     // cell size (px)
  const RAD  = 0.08;   // dot radius (fraction of cell)

  const ox = useSharedValue(0);
  const oy = useSharedValue(0);

  const pan = useMemo(
    () =>
      Gesture.Pan().onChange((e) => {
        ox.value = (ox.value + e.changeX) % STEP; if (ox.value < 0) ox.value += STEP;
        oy.value = (oy.value + e.changeY) % STEP; if (oy.value < 0) oy.value += STEP;
      }),
    [ox, oy]
  );

  const uniforms = useDerivedValue(() => ({
    u_off:  vec(ox.value, oy.value),
    u_step: STEP,
    u_rad:  RAD,
    // #f8f8f8 and #E0E0E0 as normalized RGBA
    u_bg:   [248/255, 248/255, 248/255, 1],
    u_fg:   [224/255, 224/255, 224/255, 1],
  }), [ox, oy]);

  return (
    <GestureDetector gesture={pan}>
      <Canvas style={{ width, height, flex: 1 }}>
        <Fill>
          <Shader source={effect} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </GestureDetector>
  );
}
