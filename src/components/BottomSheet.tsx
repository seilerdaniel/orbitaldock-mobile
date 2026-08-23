import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 0.9;

/**
 * Native-feeling bottom sheet built on RN primitives only:
 * transparent Modal (covers tab bar + header, Android back closes),
 * spring slide-up, fading backdrop and drag-the-handle to dismiss.
 */
export function BottomSheet({ visible, onClose, title, subtitle, children }: BottomSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const maxSheetHeight = Math.round(height * 0.88);

  const [mounted, setMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(maxSheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dragStart = useRef(0);
  const closingRef = useRef(false);
  const closeRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (visible) {
      closingRef.current = false;
      setMounted(true);
      backdropOpacity.setValue(0);
      translateY.setValue(maxSheetHeight);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          speed: 18,
          bounciness: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: maxSheetHeight,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
        onClose();
      }
    });
  };

  closeRef.current = close;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 4 || gesture.vy > 0.2,
      onPanResponderGrant: () => {
        dragStart.current = 0;
        translateY.stopAnimation((value) => {
          dragStart.current = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const next = dragStart.current + gesture.dy;
        if (next > 0) translateY.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => {
        const next = dragStart.current + gesture.dy;
        if (next > DISMISS_DISTANCE || gesture.vy > DISMISS_VELOCITY) {
          closeRef.current();
          return;
        }
        Animated.spring(translateY, {
          toValue: 0,
          speed: 20,
          bounciness: 5,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  if (!mounted) return null;

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
    >
      <StatusBar barStyle="light-content" />
      <View className="flex-1 justify-end">
        <Animated.View style={[{ flex: 1 }, { opacity: backdropOpacity }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar"
            onPress={close}
            className="flex-1 bg-black/60"
          />
        </Animated.View>

        <Animated.View
          style={[
            {
              maxHeight: maxSheetHeight,
              paddingBottom: insets.bottom + 16,
              transform: [{ translateY }],
            },
          ]}
          className="rounded-t-3xl border-t border-slate-700/50 bg-slate-800"
        >
          <View {...panResponder.panHandlers} className="items-center pt-3">
            <View className="h-1.5 w-10 rounded-full bg-slate-600" />
            <Text className="mt-3 px-6 text-center text-lg font-bold text-slate-100">
              {title}
            </Text>
            {subtitle ? (
              <Text className="mt-1 px-6 text-xs text-slate-400">{subtitle}</Text>
            ) : null}
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
