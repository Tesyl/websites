import { defineConfig } from 'vitest/config';

// Covers the ported engine glue: lib/embed.test.ts (Stage lifecycle + the
// shared RAF ticker) and lib/effects/Reel.test.ts. Both touch `document`,
// so the environment is happy-dom rather than node.
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['lib/**/*.test.ts', 'stories/**/*.test.ts'],
  },
});
