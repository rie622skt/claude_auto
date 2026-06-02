import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

let enabled = true;

/** Wired to the Settings toggle; defaults on. */
export function setHapticsEnabled(v: boolean) {
  enabled = v;
}

function active() {
  return enabled && Platform.OS !== 'web';
}

/** Tactile feedback — safe no-op on web and when disabled in settings. */
export const haptic = {
  light() {
    if (active()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  medium() {
    if (active()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  },
  success() {
    if (active()) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  selection() {
    if (active()) Haptics.selectionAsync().catch(() => {});
  },
};
