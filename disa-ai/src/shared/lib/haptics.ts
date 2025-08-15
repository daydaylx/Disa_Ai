export const haptics = {
  light() { if ("vibrate" in navigator) navigator.vibrate(1); },
  medium() { if ("vibrate" in navigator) navigator.vibrate(10); },
  heavy() { if ("vibrate" in navigator) navigator.vibrate([30, 10, 10]); }
};
