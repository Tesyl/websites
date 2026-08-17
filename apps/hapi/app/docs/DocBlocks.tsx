import { headingId, type DocBlock } from '@tesyl/content/docs';
import { Inline } from '../Inline';

export function DocBlocks({ blocks }: { blocks: ReadonlyArray<DocBlock> }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'p':
            return (
              <p key={i} className="d-p">
                <Inline text={block.text} />
              </p>
            );

          case 'h3':
            return (
              <h3 key={i} id={headingId(block.text)} className="d-h3">
                {block.text}
              </h3>
            );

          case 'code':
            return (
              <div key={i} className="d-code">
                {block.label ? <div className="d-code__label mono">{block.label}</div> : null}
                <pre className="mono">{block.code}</pre>
              </div>
            );

          case 'list':
            return (
              <ul key={i} className="d-list">
                {block.items.map((item) => (
                  <li key={item.slice(0, 32)}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );

          case 'note':
            return (
              <aside key={i} className="d-note" data-tone={block.tone}>
                <p className="d-note__t mono">{block.title}</p>
                <p className="d-note__b">
                  <Inline text={block.text} />
                </p>
              </aside>
            );

          case 'table':
            return (
              <div key={i} className="d-tablewrap">
                <table className="d-table">
                  <thead>
                    <tr>
                      {block.head.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join('|')}>
                        {row.map((cell, c) => (
                          <td key={c}>
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'api':
            return (
              <div key={i} className="d-api">
                <p className="d-api__sig">
                  <code className="mono d-api__name">{block.name}</code>
                  <code className="mono d-api__type">{block.type}</code>
                  {block.required ? <span className="d-api__req">Required</span> : null}
                  {block.defaultsTo ? (
                    <span className="d-api__def mono">defaults to {block.defaultsTo}</span>
                  ) : null}
                </p>
                <ul>
                  {block.body.map((line) => (
                    <li key={line.slice(0, 32)}>
                      <Inline text={line} />
                    </li>
                  ))}
                </ul>
              </div>
            );
        }
      })}
    </>
  );
}
