// GridBackground.tsx
import React, { useMemo } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import { Canvas, Fill, Shader, Skia } from "@shopify/react-native-skia";

const GRID_SHADER = `
uniform vec2  u_step;    // grid spacing in px (x = 20, y = 30)
uniform float u_thick;   // line thickness in px
uniform vec4  u_bg;      // background color
uniform vec4  u_line;    // line color

half4 main(vec2 xy) {
  // Convert to cell space
  vec2 uv = xy / u_step;
  vec2 fp = fract(uv);             // [0..1) inside each cell
  vec2 d  = min(fp, 1.0 - fp);     // distance to nearest edge (0 at edge)

  // Convert thickness (px) to cell-space half-thickness
  float tx = (u_thick / u_step.x) * 0.5;
  float ty = (u_thick / u_step.y) * 0.5;

  // 1 near edges, 0 elsewhere
  float gx = 1.0 - step(tx, d.x);
  float gy = 1.0 - step(ty, d.y);
  float grid = max(gx, gy);

  // Composite lines over bg
  vec3 rgb = mix(u_bg.rgb, u_line.rgb, grid);
  return half4(rgb, 1.0);
}
`;

export default function GridBackground() {
  const { width, height } = useWindowDimensions();

  const effect = useMemo(() => {
    const e = Skia.RuntimeEffect.Make(GRID_SHADER);
    if (!e) throw new Error("Shader compile failed");
    return e;
  }, []);

  // Make them obvious first
  const uniforms = {
    u_step:  [20, 30],
    u_thick: 1.0,                              // thick to verify visibility
    u_bg:    [248/255, 248/255, 248/255, 1],                     // white
    u_line:  [0.9, 0.9, 0.9, 0.5],                     // black
  };

  return (
    <Canvas style={[StyleSheet.absoluteFill, {borderRadius: 50}]}>
      <Fill>
        <Shader source={effect} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
