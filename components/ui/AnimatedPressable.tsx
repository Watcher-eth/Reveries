// AnimatePressable.tsx
import React, { ReactNode } from 'react';
import {
  Pressable,
  PressableProps,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type HapticLevel = 'none' | 'light' | 'medium';

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  /** Styles for the outer container (position, border, padding) */
  containerStyle?: ViewStyle;
  /** Styles for the inner content wrapper (background, padding) */
  contentStyle?: ViewStyle;
  children: ReactNode;
  activeScale?: number;
  duration?: number;
  haptics?: HapticLevel;
}

export function AnimatedPressable({
  children,
  containerStyle,
  contentStyle,
  activeScale = 0.95,
  duration = 100,
  haptics = 'light',
  onPressIn,
  onPressOut,
  ...rest
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const triggerHaptic = () => {
    if (haptics === 'light') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (haptics === 'medium') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  function handlePressIn(e: GestureResponderEvent) {
    triggerHaptic();
    scale.value = withTiming(activeScale, { duration });
    onPressIn?.(e);
  }

  function handlePressOut(e: GestureResponderEvent) {
    scale.value = withTiming(1, { duration });
    onPressOut?.(e);
  }

  return (
    <Animated.View
      style={[containerStyle, animatedContainerStyle]}
    >
      <Pressable
        style={{ flex: 1 }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...rest}
      >
        <Animated.View style={contentStyle}>
          {children}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
