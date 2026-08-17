import type { Metadata } from 'next';
import { PACKAGE_NAME } from '@tesyl/content/hapi';
import { Bar, Foot } from '../parts';
import { Inline } from '../Inline';
import { MARKS } from './marks';
import './mascot.css';

export const metadata: Metadata = {
  title: 'Mascot candidates',
  description: 'Five smiley marks for hapi, tested at the sizes that break them.',
};

/** The sizes that decide it. 16 is the favicon, and the favicon is where marks die. */
const SIZES = [96, 32, 16] as const;

export default function MascotPage() {
  return (
    <>
      <Bar active="mascot" />

      <main className="ms">
        <p className="ms__kicker mono">Mascot — five candidates</p>
        <h1 className="ms__h1">
          Five ways to draw a <u>smile</u>.
        </h1>
        <p className="ms__lede">
          Each is one SVG on a 100×100 grid, so there is no second asset to keep in sync. They are
          shown large, then at 32px, then at 16px — the favicon is where a mascot either survives
          or turns to mush, so judge them on the small row rather than the big one.
        </p>

        <div className="ms__grid">
          {MARKS.map(({ id, name, Mark, idea, risk }) => (
            <article key={id} className="ms__card">
              <header className="ms__head">
                <span className="ms__num mono">0{id}</span>
                <h2 className="ms__name">{name}</h2>
              </header>

              <div className="ms__stage">
                <div className="ms__on ms__on--light">
                  {SIZES.map((s) => (
                    <span key={s} className="ms__slot">
                      <Mark size={s} />
                    </span>
                  ))}
                </div>
                <div className="ms__on ms__on--dark">
                  {SIZES.map((s) => (
                    <span key={s} className="ms__slot">
                      <Mark size={s} onDark />
                    </span>
                  ))}
                </div>
              </div>

              <div className="ms__lockup">
                <Mark size={26} />
                <span className="ms__word mono">{PACKAGE_NAME}</span>
              </div>

              <dl className="ms__notes">
                <dt>Idea</dt>
                <dd><Inline text={idea} /></dd>
                <dt>Risk</dt>
                <dd><Inline text={risk} /></dd>
              </dl>
            </article>
          ))}
        </div>

        <p className="ms__foot">
          Nothing here is wired into the site yet. Pick one and I will make it the favicon, the
          wordmark lockup in the header, and the open-graph image.
        </p>
      </main>

      <Foot />
    </>
  );
}
