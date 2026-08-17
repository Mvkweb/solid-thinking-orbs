import { createSignal, onMount, onCleanup, For } from "solid-js";
import styles from "./AgentThinking.module.css";

const SENTENCES = [
  "Reading the request and the current selection, then locating the jwt.verify call inside the auth middleware.",
  "The verify call sets no algorithms allowlist, so a token signed with 'none' or a weak cipher could be accepted.",
  "Tracing where the signing secret is loaded from and confirming it is never logged or sent back to the client.",
  "Planning to pin the algorithm to HS256 and to validate the issuer and audience claims on every incoming request.",
  "Scanning the existing tests around the middleware so the fix stays covered and nothing downstream regresses.",
  "Drafting the patch with a focused regression test that rejects tampered, expired, and unsigned tokens.",
];

const DELAYS = [700, 900, 800, 850, 800, 900];
const COLLAPSE_BEAT = 360;

const SENT_H = 40;
const GAP = 4;
const MAX_H = 180;
const FADE = 16;

export interface AgentThinkingProps {
  sentences?: string[];
  delays?: number[];
  defaultOpen?: boolean;
  showTimer?: boolean;
  autoCollapse?: boolean;
  onComplete?: () => void;
  class?: string;
}

export function AgentThinking(props: AgentThinkingProps) {
  const sentences = () => props.sentences ?? SENTENCES;
  const delays = () => props.delays ?? DELAYS;
  const showTimer = () => props.showTimer ?? true;
  const autoCollapse = () => props.autoCollapse ?? true;

  const [phase, setPhase] = createSignal<"thinking" | "done">("thinking");
  const [revealed, setRevealed] = createSignal(0);
  const [open, setOpen] = createSignal(props.defaultOpen ?? true);
  const [seconds, setSeconds] = createSignal(0);
  const [fade, setFade] = createSignal({ top: false, bottom: true });
  let viewportRef: HTMLDivElement | undefined;

  onMount(() => {
    const sList = sentences();
    const dList = delays();
    const thinkMs = dList.reduce((a, b) => a + b, 0);

    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(sList.length);
      setPhase("done");
      setSeconds(Math.max(1, Math.round(thinkMs / 1000)));
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    
    const timerInterval = setInterval(() => {
      if (phase() === "thinking") {
        setSeconds((s) => s + 1);
      }
    }, 1000);

    let t = 0;
    dList.forEach((d, i) => {
      t += d;
      at(t, () => setRevealed(i + 1));
    });

    at(thinkMs + COLLAPSE_BEAT, () => {
      clearInterval(timerInterval);
      setPhase("done");
      if (autoCollapse()) {
        setOpen(false);
      }
      props.onComplete?.();
    });

    onCleanup(() => {
      clearInterval(timerInterval);
      timers.forEach(clearTimeout);
    });
  });

  const done = () => phase() === "done";
  const expanded = () => open();
  const count = () => done() ? sentences().length : revealed();
  const contentH = () => count() > 0 ? count() * SENT_H + (count() - 1) * GAP : 0;
  const capped = () => contentH() > MAX_H;
  const viewH = () => capped() ? MAX_H : contentH();
  const scrollable = () => open();
  const translate = () => scrollable() ? 0 : capped() ? MAX_H - FADE - contentH() : 0;

  const showTop = () => scrollable() ? fade().top : capped();
  const showBottom = () => scrollable() ? fade().bottom : capped();
  const mask = () => capped()
    ? `linear-gradient(to bottom, transparent 0, #000 ${showTop() ? FADE : 0}px, #000 calc(100% - ${showBottom() ? FADE : 0}px), transparent 100%)`
    : "none";

  const onScroll = () => {
    if (!viewportRef) return;
    setFade({
      top: viewportRef.scrollTop > 2,
      bottom: viewportRef.scrollHeight - viewportRef.scrollTop - viewportRef.clientHeight > 2,
    });
  };

  const toggle = () => {
    const next = !open();
    if (next) {
      setFade({ top: false, bottom: true });
      if (viewportRef) viewportRef.scrollTop = 0;
    }
    setOpen(next);
  };

  return (
    <div class={`${styles.tr} ${props.class || ""}`}>
      <button
        type="button"
        class={`${styles.trHeader} ${styles.isClickable}`}
        aria-expanded={expanded()}
        aria-label="Toggle thought"
        onClick={() => toggle()}
      >
        {done() ? (
          <span class={styles.trLabel}>
            <span class={styles.trVerb}>Thought</span>{showTimer() ? ` for ${seconds()}s` : ""}
          </span>
        ) : (
          <span class={`${styles.trLabel} ${styles.trShimmer}`}>
            <span class={styles.trVerb}>Thinking</span>{showTimer() ? ` for ${seconds()}s…` : "…"}
          </span>
        )}
        <svg class={styles.trChevron} viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
          <path d="m4.5 15.75 7.5-7.5 7.5 7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div class={`${styles.trCollapsible} ${expanded() ? "" : styles.isCollapsed}`}>
        <div class={styles.trInner}>
          <div
            ref={viewportRef}
            class={`${styles.trViewport} ${scrollable() ? styles.isScroll : ""}`}
            style={{ height: `${viewH()}px`, "-webkit-mask-image": mask(), "mask-image": mask() }}
            onScroll={scrollable() ? onScroll : undefined}
          >
            <div class={styles.trStream} style={{ transform: `translateY(${translate()}px)` }}>
              <For each={sentences().slice(0, count())}>
                {(line) => <p class={styles.trSentence}>{line}</p>}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
