import { createSignal, onMount, onCleanup, For } from "solid-js";
import styles from "./WebSearch.module.css";

export interface WebSearchSite {
  title: string;
  url: string;
  discover?: number;
  finish?: number;
}

export interface WebSearchProps {
  query?: string;
  sites?: WebSearchSite[];
  defaultOpen?: boolean;
  loop?: boolean;
  class?: string;
}

const DEFAULT_QUERY = "JWT auth vulnerabilities and middleware security best practices";

const DEFAULT_SITES: WebSearchSite[] = [
  { title: "JWT verification best practices", url: "auth0.com/blog/jwt-security-best-practices", discover: 600, finish: 2400 },
  { title: "Node.js authentication security guide", url: "owasp.org/www-project-nodejs-goat", discover: 1600, finish: 4000 },
  { title: "JWT attacks · Web Security Academy", url: "portswigger.net/web-security/jwt", discover: 2800, finish: 5600 },
];

const M = {
  L: "M6.057 11.565 C2.081 11.565 0.371 8.159 0.371 5.964 C0.371 3.642 2.152 0.329 6.05 0.329",
  ML: "M6.012 11.55 C4.575 10.496 3.333 8.116 3.321 5.964 C3.307 3.399 4.974 0.977 6.012 0.329",
  MR: "M6.012 11.55 C7.211 10.781 8.715 8.287 8.715 5.964 C8.715 3.399 7.24 1.233 6.012 0.329",
  R: "M6.012 11.55 C9.677 11.55 11.65 8.487 11.65 5.964 C11.65 3.499 9.748 0.329 6.012 0.329",
};

function Globe() {
  const values = [M.L, M.ML, M.MR, M.R, M.L].join(";");
  const begins = ["0s", "-1.2s", "-2.4s", "-3.6s", "-4.8s", "-6s"];
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor"
      stroke-width="0.85" stroke-linecap="round" style={{ overflow: "visible" }}>
      <circle cx="6" cy="6" r="5.7" opacity="0.9" />
      <line x1="0.3" y1="6" x2="11.7" y2="6" opacity="0.9" />
      <For each={begins}>
        {(begin) => (
          <path d={M.L} opacity="0">
            <animate attributeName="d" dur="7.2s" begin={begin} repeatCount="indefinite"
              calcMode="spline" keyTimes="0;0.25;0.5;0.75;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" values={values} />
            <animate attributeName="opacity" dur="7.2s" begin={begin} repeatCount="indefinite"
              calcMode="linear" keyTimes="0;0.05;0.7;0.75;1" values="0;0.9;0.9;0;0" />
          </path>
        )}
      </For>
    </svg>
  );
}

const Search = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
);
const Caret = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>
);
const ArrowUp = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg>
);
const Dots = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" stroke-width="1.8" stroke-dasharray="1.8 3.6" stroke-linecap="round" /></svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);

export function WebSearch(props: WebSearchProps) {
  const query = () => props.query ?? DEFAULT_QUERY;
  const sites = () => props.sites ?? DEFAULT_SITES;
  const loop = () => props.loop ?? true;

  const [states, setStates] = createSignal<string[]>(sites().map(() => "pending"));
  const [done, setDone] = createSignal(false);
  const [open, setOpen] = createSignal(props.defaultOpen ?? true);

  onMount(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    const currentSites = sites();
    const last = Math.max(...currentSites.map((s) => s.finish ?? 4000));
    
    const run = () => {
      setStates(currentSites.map(() => "pending"));
      setDone(false);
      timers = [];
      const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
      currentSites.forEach((site, i) => {
        at(site.discover ?? (600 + i * 1000), () => setStates((p) => p.map((v, j) => (j === i ? "loading" : v))));
        at(site.finish ?? (2400 + i * 1600), () => setStates((p) => p.map((v, j) => (j === i ? "done" : v))));
      });
      at(last + 800, () => setDone(true));
      if (loop()) {
        at(last + 800 + 2800, () => !cancelled && run());
      }
    };
    run();
    onCleanup(() => { cancelled = true; timers.forEach(clearTimeout); });
  });

  return (
    <div class={`${styles.ws} ${props.class || ""}`} data-state={done() ? "done" : "loading"}>
      <div class={styles.wsRow}>
        <Search />

        <span class={styles.wsLabel}>
          <span class={`${styles.wsShimmer} ${done() ? styles.isDone : ""}`}>
            Searching <span class={styles.wsQuote}>“{query()}”</span>
          </span>
          <button type="button" class={styles.wsChevron} aria-label="Toggle results"
            aria-expanded={open()} onClick={() => setOpen((o) => !o)}><Caret /></button>
        </span>
      </div>

      <div class={`${styles.wsCollapsible} ${open() ? "" : styles.isCollapsed}`}>
        <div class={styles.wsCollapsibleInner}>
          <div class={styles.wsResults}>
            <span class={styles.wsRail} />
            <ul class={styles.wsList}>
              <For each={sites()}>
                {(site, i) => (
                  <li class={styles.wsSite} data-state={states()[i()]}>
                    <span class={styles.wsBullet}>
                      <span class={styles.wsDots}><Dots /></span>
                      <span class={styles.wsGlobe}><Globe /></span>
                      <span class={styles.wsCheck}><Check /></span>
                    </span>
                    <span class={styles.wsTitle}>{site.title}</span>
                    <span class={styles.wsSep}>·</span>
                    <span class={styles.wsUrl}>{site.url}</span>
                    <span class={styles.wsArrow}><ArrowUp /></span>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
