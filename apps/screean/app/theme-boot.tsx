'use client';

import { useEffect } from 'react';
import { applyTheme, DEFAULT_THEME } from '../lib/themes';

// Writes the theme's CSS variables onto <body> at runtime, exactly as the
// Vite site's main.ts did. globals.css already carries the same values as
// static defaults so the server-rendered first paint is correct — this
// keeps lib/themes.ts as the single runtime source of truth and makes a
// future theme switch one applyTheme() call away.
export const ThemeBoot = (): null => {
  useEffect(() => {
    applyTheme(DEFAULT_THEME);
  }, []);
  return null;
};
