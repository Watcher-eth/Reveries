// StampNode.tsx
import React, { useMemo } from "react";
import {
  Skia,
  Path as SkPath,
  PathOp,
  Group,
  Path,
  Image as SkImage,
  useImage,
  rect,
  rrect,
  Shadow,
} from "@shopify/react-native-skia";

type P = { id: string; uri: string; x: number; y: number; w: number; h: number; rot: number };

// Build a perforated “stamp” silhouette: outer rect minus circular bites along edges.
function makeStampOutline(w: number, h: number, tooth = 12): typeof SkPath {
  const outline = Skia.Path.Make();
  const bites   = Skia.Path.Make();

  // Outer rectangle
  outline.addRect(rect(0, 0, w, h));

  const stepX = tooth;
  const stepY = tooth;
  const r     = tooth / 2;

  // Top/bottom bites
  for (let x = stepX / 2; x < w; x += stepX) {
    bites.addCircle(x, 0, r);
    bites.addCircle(x, h, r);
  }
  // Left/right bites
  for (let y = stepY / 2; y < h; y += stepY) {
    bites.addCircle(0, y, r);
    bites.addCircle(w, y, r);
  }

  // Boolean difference: rectangle minus bites
  outline.op(bites, PathOp.Difference);
  return outline;
}

export default function StampNode({ id, uri, x, y, w, h, rot }: P) {
  const img = useImage(uri);

  // Prebuild silhouette once per size
  const outline = useMemo(() => makeStampOutline(w, h, 12), [w, h]);

  // Keep (x,y) as the visual center like your PhotoNode did
  const tx = x - w / 2;
  const ty = y - h / 2;

  // Inner picture window (rounded rect) used for clipping the image
  const BORDER   = 10;          // inner margin inside the stamp
  const cornerR  = 8;           // inner corner radius
  const innerRR  = rrect(
    rect(tx + BORDER, ty + BORDER, w - 2 * BORDER, h - 2 * BORDER),
    cornerR,
    cornerR
  );

  return (
    <Group origin={{ x, y }} transform={[{ rotate: rot }]}>
      {/* Translate the silhouette to (tx, ty) since the path is defined at (0,0..w,h) */}
      <Group transform={[{ translateX: tx }, { translateY: ty }]}>
        {/* White stamp outline with shadow */}
        <Path path={outline} color="white">
          <Shadow dx={0} dy={8} blur={18} color="rgba(0,0,0,0.18)" />
        </Path>
      </Group>

      {/* Clipped image inside the inner rounded window */}
      {img && (
        <Group clip={innerRR}>
          <SkImage
            image={img}
            x={tx + BORDER}
            y={ty + BORDER}
            width={w - 2 * BORDER}
            height={h - 2 * BORDER}
            fit="cover"
          />
        </Group>
      )}
    </Group>
  );
}
