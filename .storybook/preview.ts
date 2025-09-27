import type { Preview } from "@storybook/react-vite";

// Import styles in same order as App.tsx
import "../src/styles/tailwind.css";
import "../src/ui/base.css";
import "../src/styles/globals.css";
import "../src/styles/legacy-buttons.css";
import "../src/styles/glass-components.css";
import "../src/styles/brand.css";
import "../src/styles/chat.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
