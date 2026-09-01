import { createSignal, createEffect, onMount, onCleanup, For, Show } from "solid-js";
import styles from "./TodoList.module.css";

const DEFAULT_LABELS = [
  "Scaffold the project structure",
  "Build the component registry",
  "Implement entitlement gating",
  "Wire up Stripe checkout",
  "Polish the landing page",
];

const DEFAULT_START_DELAY = 700;
const DEFAULT_STEP_MS = 2250;

export interface TodoListProps {
  labels?: string[];
  startDelay?: number;
  stepMs?: number;
  defaultCollapsed?: boolean;
  loop?: boolean;
  onComplete?: () => void;
  class?: string;
  className?: string;
}

const cls = (base: string, on?: boolean) => base + (on ? " " + styles.on : "");

const CheckIcon = (props: { on?: boolean }) => (
  <svg class={cls(styles.todoIcon, props.on)} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const ArrowIcon = (props: { on?: boolean }) => (
  <svg class={cls(styles.todoIcon + " " + styles.strong, props.on)} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const DashedIcon = (props: { on?: boolean }) => (
  <svg class={cls(styles.todoIcon, props.on)} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="1.8 3.6" stroke-linecap="round" />
  </svg>
);

const FilledCheckIcon = () => (
  <svg class={styles.todoHeadCheck} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" fill="currentColor" />
  </svg>
);

function RollDigit(props: { char: string }) {
  const [prev, setPrev] = createSignal(props.char);
  const [roll, setRoll] = createSignal<{ from: string; to: string } | null>(null);
  const [up, setUp] = createSignal(false);

  createEffect(() => {
    const currentChar = props.char;
    const previousChar = prev();
    if (currentChar === previousChar) return;

    setRoll({ from: previousChar, to: currentChar });
    setPrev(currentChar);
    setUp(false);

    let raf1 = requestAnimationFrame(() => {
      let raf2 = requestAnimationFrame(() => {
        setUp(true);
      });
    });

    const timer = setTimeout(() => {
      setRoll(null);
    }, 380);

    onCleanup(() => {
      cancelAnimationFrame(raf1);
      clearTimeout(timer);
    });
  });

  return (
    <span class={styles.rollDigit}>
      <Show when={roll()} fallback={<span>{props.char}</span>}>
        {(r) => (
          <span class={`${styles.rollInner} ${up() ? styles.on : ''}`}>
            <span>{r().from}</span>
            <span>{r().to}</span>
          </span>
        )}
      </Show>
    </span>
  );
}

function RollingCount(props: { value: string }) {
  const chars = () => props.value.split('');
  return (
    <span class={styles.rollCount} aria-label={props.value}>
      <For each={chars()}>
        {(c) => <RollDigit char={c} />}
      </For>
    </span>
  );
}

export function TodoList(props: TodoListProps) {
  const labels = () => props.labels ?? DEFAULT_LABELS;
  const startDelay = () => props.startDelay ?? DEFAULT_START_DELAY;
  const stepMs = () => props.stepMs ?? DEFAULT_STEP_MS;
  const loop = () => props.loop ?? true;

  const [collapsed, setCollapsed] = createSignal(props.defaultCollapsed ?? false);
  const [current, setCurrent] = createSignal(-1);

  onMount(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(labels().length);
      return;
    }

    const run = () => {
      const n = labels().length;
      setCurrent(-1);
      timers = [];

      timers.push(setTimeout(() => setCurrent(0), startDelay()));

      for (let i = 0; i < n; i++) {
        timers.push(
          setTimeout(() => {
            setCurrent(i + 1);
            if (i + 1 === n) {
              props.onComplete?.();
              if (loop() && !cancelled) {
                timers.push(setTimeout(run, 3500));
              }
            }
          }, startDelay() + (i + 1) * stepMs())
        );
      }
    };

    run();

    onCleanup(() => {
      cancelled = true;
      timers.forEach(clearTimeout);
    });
  });

  const n = () => labels().length;
  const started = () => current() >= 0;
  const allDone = () => current() >= n();
  const running = () => started() && !allDone();
  const pct = () => Math.round((Math.min(Math.max(current(), 0), n()) / n()) * 100);
  const countStr = () => `${Math.min(Math.max(current(), 0), n())}/${n()}`;

  return (
    <div class={`${styles.todo} ${props.class || props.className || ""}`}>
      <button
        type="button"
        class={styles.todoHead}
        aria-expanded={!collapsed()}
        aria-label="Toggle to-dos"
        onClick={() => setCollapsed((c) => !c)}
      >
        <span class={styles.todoHeadIcon}>
          {allDone() ? (
            <FilledCheckIcon />
          ) : running() ? (
            <span class={styles.todoHeadPie} style={{ "--todo-pie": `${pct()}%` }} aria-hidden="true">
              <svg class={styles.todoHeadPieRing} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray="2.2 4.4" stroke-linecap="round" />
              </svg>
            </span>
          ) : (
            <svg class={styles.todoListIcon} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          )}
        </span>

        <span class={styles.todoTitle}>To-dos</span>

        <span class={styles.todoCount}>
          <RollingCount value={countStr()} />
        </span>
      </button>

      <div class={`${styles.todoCollapsible} ${collapsed() ? styles.isCollapsed : ""}`}>
        <div class={styles.todoInner}>
          <ul class={styles.todoList}>
            <For each={labels()}>
              {(label, i) => {
                const done = () => started() && i() < current();
                const active = () => started() && i() === current() && !allDone();
                return (
                  <li
                    class={`${styles.todoItem} ${done() ? styles.done : active() ? styles.active : ""}`}
                    style={{ "--i": i() }}
                  >
                    <span class={styles.todoIconWrap}>
                      <DashedIcon on={!done() && !active()} />
                      <ArrowIcon on={active()} />
                      <CheckIcon on={done()} />
                    </span>
                    <span class={styles.todoLabel} data-label={label}>
                      {label}
                    </span>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
}
