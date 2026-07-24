import { createSignal, createEffect } from 'solid-js';
import type { Accessor } from 'solid-js';

export type Theme = 'dark' | 'light';

export function useTheme(): [Accessor<Theme>, () => void] {
  const [theme, setTheme] = createSignal<Theme>('dark');
  createEffect(() => {
    document.documentElement.dataset.theme = theme();
  });
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return [theme, toggle];
}

