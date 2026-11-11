import type { Cover } from '../coverConfig'
import { imageManifest } from '../imageManifest'

export function EditorialScene({ cover, active, index }: { cover: Cover; active: boolean; index: number }) {
  const photo = imageManifest[cover.image]
  return <section className={'cover cover--' + cover.id} aria-hidden={!active} inert={!active} aria-label={cover.label}>
    <div className="cover-artwork"><div className="cover-photo"><img src={photo.src} alt={photo.alt} fetchPriority={index === 0 ? 'high' : 'auto'} draggable={false} /></div></div>
    <div className="cover-copy">
      <p className="eyebrow">The portrait issue <span>— {cover.label}</span></p>
      <h1>{cover.lines.map(line => <span key={line}>{line}</span>)}</h1>
      <div className="cover-story"><p>{cover.description}</p><p className="credit">{cover.credit}</p>
        {cover.id === 'introduction' && <p className="school">National School of Drama graduate</p>}
      </div>
    </div>
  </section>
}

