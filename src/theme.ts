import { createSignal, createEffect, onCleanup } from 'solid-js';
import type { Accessor } from 'solid-js';
import type { OrbTheme } from './types';

function ancestorTheme(el: Element | null): boolean | null {
  let node: Element | null = el;
  while (node) {
    const attr = node.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    if (node.classList.contains('dark')) return true;
    if (node.classList.contains('light')) return false;
    node = node.parentElement;
  }
  return null;
}

function systemDark(): boolean {
  return typeof matchMedia === 'undefined' || matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Resolve the effective dark/light substrate for a mounted element. */
export function createResolvedDark(theme: Accessor<OrbTheme>, hostRef: Accessor<Element | null>): Accessor<boolean> {
  const [dark, setDark] = createSignal(true);

  createEffect(() => {
    const t = theme();
    if (t === 'dark') {
      setDark(true);
      return;
    }
    if (t === 'light') {
      setDark(false);
      return;
    }

    const resolve = () => {
      const fromTree = ancestorTheme(hostRef());
      setDark(fromTree ?? systemDark());
    };
    resolve();

    // live OS/browser theme switches
    const mq = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-color-scheme: dark)') : null;
    const onMq = () => resolve();
    mq?.addEventListener('change', onMq);

    // live app-level toggles: watch class/data-theme flips on ancestors
    let mo: MutationObserver | null = null;
    const el = hostRef();
    if (typeof MutationObserver !== 'undefined' && el) {
      mo = new MutationObserver(resolve);
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
        subtree: true
      });
    }

    onCleanup(() => {
      mq?.removeEventListener('change', onMq);
      mo?.disconnect();
    });
  });

  return dark;
}

/** Live `prefers-reduced-motion` — reduced users get a static frame. */
export function createReducedMotion(): Accessor<boolean> {
  const [reduced, setReduced] = createSignal(false);
  createEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', on);
    onCleanup(() => mq.removeEventListener('change', on));
  });
  return reduced;
}
