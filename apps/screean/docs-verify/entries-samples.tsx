'use client';
// Verifies the installation + entry-point samples.
import { useEffect, useRef } from 'react';
import { mount } from '@tesyl/screean-components';
import { createScreenController, headlessButton }
  from '@tesyl/screean-components/components';
import { ScreeanButton } from '@tesyl/screean-components/react';

void mount;
void ScreeanButton;

export const DissolvingButton = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const screen = createScreenController({ canvas });
    const btn = headlessButton({
      screen,
      label: 'DISSOLVE ME',
      onClick: () => console.log('clicked'),
    });
    host.appendChild(btn.el);

    return () => {
      btn.dispose();
      screen.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={hostRef} />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
    </div>
  );
};
