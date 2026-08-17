// Verifies the React page's samples against the published ./react surface.
import { useRef } from 'react';
import { ScreenProvider } from '@tesyl/screean/react';
import {
  ScreeanButton,
  ScreeanSlider,
  type ScreeanButtonHandle,
} from '@tesyl/screean-components/react';

declare const send: () => void;
declare const setVolume: (v: number) => void;

export const Panel = () => (
  <ScreenProvider>
    <ScreeanButton label="SEND" onClick={() => send()} />
    <ScreeanSlider
      ariaLabel="Volume"
      min={0}
      max={100}
      onChange={(v) => setVolume(v)}
    />
  </ScreenProvider>
);

export const WithRef = () => {
  const ref = useRef<ScreeanButtonHandle | null>(null);
  const fire = async () => {
    await ref.current?.dissolve();
  };
  return <ScreeanButton ref={ref} label="SEND" onClick={fire} />;
};
