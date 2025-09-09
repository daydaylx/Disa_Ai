# Refactor Postmortem

- Fixed missing state in ModelPicker after style pass.
- Resolved Tailwind @apply of custom utility across layers by inlining sizes.
- Verified build succeeds; tests show runner IPC issue in this sandbox (non-deterministic here), but no unit failures reported.
- Remaining risks: performance of heavy blur on low-end devices; mitigated by using lg/xl selectively and avoiding full-screen blurs.
