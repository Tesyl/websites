// Compiles every API shape the docs claim, against the PUBLISHED 0.3.0
// types. Not shipped — a verification harness for the doc samples.
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createScreenController,
  headlessButton,
  headlessToggle,
  headlessCheckbox,
  createRadioGroup,
  headlessSlider,
  headlessTextField,
  headlessLabel,
  headlessCard,
  headlessImage,
  RENDER_STRATEGY_BY_ROLE,
  renderStrategyOf,
} from '@tesyl/screean-components/components';

declare const canvas: HTMLCanvasElement;
declare const host: HTMLDivElement;
declare const submit: () => void;
declare const send: () => void;
declare const open: () => void;
declare const save: (v: string) => void;
declare const setDark: (b: boolean) => void;
declare const setRemember: (b: boolean) => void;
declare const setSize: (v: string) => void;
declare const setVolume: (v: number) => void;
declare const setDraft: (v: string) => void;

// ── quick-start ──────────────────────────────────────────────────────────
const screen = createScreenController({ canvas });
const btn = headlessButton({
  screen,
  label: 'DISSOLVE ME',
  onClick: () => console.log('clicked'),
});
document.body.appendChild(btn.el);
btn.dispose();
screen.dispose();

// ── screen-controller options ────────────────────────────────────────────
const tuned = createScreenController({
  canvas,
  feel: 'magnetic',
  feelOverrides: { springK: 60 },
  particleCount: 6000,
  particlePhaseMs: 500,
  disperseKick: 400,
  fadeMs: 120,
  originOf: (el: HTMLElement) => ({ x: 0, y: 0 }),
  minView: { w: 320, h: 200 },
  ownLoop: false,
});
tuned.tick(performance.now());
void tuned.dissolve(btn.el);
void tuned.swap(btn.el, btn.el);
tuned.thwack(10, 10, 2000);
void tuned.fieldOf(btn.el);
const _phase = tuned.phase();
const _world = tuned.world();

// ── feel names the docs list ─────────────────────────────────────────────
createScreenController({ canvas, feel: 'calm' });
createScreenController({ canvas, feel: 'crisp' });
createScreenController({ canvas, feel: 'dreamy' });
createScreenController({ canvas, feel: 'soft' });
createScreenController({ canvas, feel: 'taut' });
createScreenController({ canvas, feel: 'balanced' });

// ── ElementComponent surface ─────────────────────────────────────────────
const _el: HTMLButtonElement = btn.el;
const _role: 'button' = btn.role;
const _strategy: 'rasterize' | 'live-dom' = btn.strategy;
const _busy: boolean = btn.isTransitioning();
const _d: Promise<void> = btn.dissolve();
const _s: Promise<void> = btn.swapTo(headlessLabel({ screen, text: 'SENT' }));

// ── activation contract ──────────────────────────────────────────────────
const quiet = headlessButton({
  screen,
  label: 'NO DISSOLVE',
  dissolveOnActivate: false,
  onClick: () => submit(),
});

// ── styling ──────────────────────────────────────────────────────────────
headlessButton({ screen, label: 'SEND', className: 'btn', onClick: send });
headlessButton({ screen, label: 'SEND', unstyled: true, className: 'my-button', onClick: send });
headlessButton({
  screen,
  label: 'SEND',
  style: { borderRadius: '2px', fontSize: '14px' },
  onClick: send,
});

// ── render strategy ──────────────────────────────────────────────────────
const _a: 'rasterize' = RENDER_STRATEGY_BY_ROLE['button'];
const _b: 'live-dom' = RENDER_STRATEGY_BY_ROLE['slider'];
const _c = renderStrategyOf('textbox');

// ── components reference ─────────────────────────────────────────────────
const toggle = headlessToggle({
  screen,
  ariaLabel: 'Dark mode',
  checked: false,
  onChange: (checked) => setDark(checked),
});
const _tc: boolean = toggle.checked();
toggle.setChecked(true);

const box = headlessCheckbox({
  screen,
  label: 'Remember me',
  checked: false,
  onChange: (checked) => setRemember(checked),
});

const group = createRadioGroup({
  screen,
  options: [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md', checked: true },
    { label: 'Large', value: 'lg' },
  ],
  onChange: (value) => setSize(value),
});
host.appendChild(group.el);
const _sel: string | null = group.selected();
group.select('lg');

const slider = headlessSlider({
  screen,
  ariaLabel: 'Volume',
  value: 50,
  min: 0,
  max: 100,
  step: 1,
  onChange: (value) => setVolume(value),
});
const _sv: number = slider.value();
slider.setValue(80);

const field = headlessTextField({
  screen,
  ariaLabel: 'Email',
  placeholder: 'you@example.com',
  value: '',
  onInput: (v) => setDraft(v),
  onCommit: (v) => save(v),
  dissolveOnCommit: true,
});
const _fv: string = field.value();
field.setValue('hi@example.com');

const title = headlessLabel({ screen, text: 'SETTINGS', heading: true });
const card = headlessCard({ screen, children: [title.el], onClick: () => open() });
const img = headlessImage({
  screen,
  src: '/hero.png',
  alt: 'Product hero',
  width: 320,
  height: 200,
});
