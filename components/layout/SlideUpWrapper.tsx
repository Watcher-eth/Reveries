import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.88;
const MIN_TRANSLATE_Y = 0;
const SPRING_CONFIG = {
  damping: 50,
  stiffness: 300,
};

export interface SlideUpWrapperProps {
  children: React.ReactNode;
  bottomContent?: React.ReactNode;
  onSlideChange?: (isUp: boolean) => void;
}

export interface SlideUpWrapperRef {
  slideUp: () => void;
  slideDown: () => void;
}

const SlideUpWrapper = forwardRef<SlideUpWrapperRef, SlideUpWrapperProps>(({
  children,
  bottomContent,
  onSlideChange,
}, ref) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const scrollOffset = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const lastPosition = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();

  const triggerHaptic = useCallback((isUp: boolean) => {
    Haptics.impactAsync(
      isUp ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
    );
  }, []);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, SPRING_CONFIG);
    if (onSlideChange) {
      runOnJS(onSlideChange)(destination !== 0);
    }
    runOnJS(triggerHaptic)(destination !== 0);
  }, [onSlideChange, triggerHaptic]);

  useImperativeHandle(ref, () => ({
    slideUp: () => {
      scrollTo(MAX_TRANSLATE_Y);
    },
    slideDown: () => {
      scrollTo(0);
    },
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
    onBeginDrag: () => {
      isDragging.value = true;
    },
    onEndDrag: () => {
      isDragging.value = false;
    },
  });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
      lastPosition.value = translateY.value;
    })
    .onUpdate((event) => {
      if (scrollOffset.value > 0 && event.translationY > 0) {
        return;
      }
      translateY.value = Math.max(
        Math.min(context.value.y + event.translationY, MIN_TRANSLATE_Y),
        MAX_TRANSLATE_Y
      );
    })
    .onEnd((event) => {
      if (!isDragging.value) {
        const currentPosition = translateY.value;
        let destinationPosition;

        if (event.velocityY < -500) {
          destinationPosition = MAX_TRANSLATE_Y;
        } else if (event.velocityY > 500) {
          destinationPosition = 0;
        } else {
          const shouldGoUp = translateY.value < MAX_TRANSLATE_Y / 2;
          destinationPosition = shouldGoUp ? MAX_TRANSLATE_Y : 0;
        }

        // Only trigger haptic if we're actually changing position
        if (currentPosition !== destinationPosition) {
          runOnJS(triggerHaptic)(destinationPosition !== 0);
        }

        scrollTo(destinationPosition);
      }
    });

  const rTopLayerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBottomStyle = useAnimatedStyle(() => {
    return {
      opacity: Math.abs(translateY.value / MAX_TRANSLATE_Y),
      transform: [
        {
          translateY: Math.max(SCREEN_HEIGHT + translateY.value, 0),
        },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.bottomLayer}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.bottomContent, rBottomStyle]}>
            <Animated.ScrollView
              ref={scrollViewRef}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              bounces={false}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              {bottomContent}
            </Animated.ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
      <Animated.View style={[styles.topLayer, rTopLayerStyle]}>
        {children}
      </Animated.View>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  bottomLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#080808',
  },
  bottomContent: {
    flex: 1,
    backgroundColor: '#080808',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    zIndex: 0,
    elevation: 0,
    height: SCREEN_HEIGHT,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#080808',
  },
  scrollContent: {
    minHeight: SCREEN_HEIGHT,
  },
  topLayer: {
    flex: 1,
    backgroundColor: '#080808',
    zIndex: 1,
    elevation: 1,
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
    overflow: "hidden"
  },
});

export default SlideUpWrapper;