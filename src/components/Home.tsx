import { useRef } from 'react'
import { homeCovers } from '../coverConfig'
import { useCinematicCover } from '../useCinematicCover'
import { EditorialScene } from './EditorialScene'

export function Home({ initial, remember, suspended }: { initial: number; remember: (index: number) => void; suspended: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const { active, busy, paused, reduced, go, togglePause, error } = useCinematicCover(root, initial, remember, suspended)
  return <div ref={root} className="home" aria-roledescription="carousel" aria-label="Editorial portraits">
    <div className="covers">{homeCovers.map((cover,index) => <EditorialScene key={cover.id} cover={cover} index={index} active={index === active} />)}</div>
    <div className="cover-controls">
      <span className="cover-count">{String(active + 1).padStart(2,'0')} <i>/ {String(homeCovers.length).padStart(2,'0')}</i></span>
      <div className="cover-indicators">{homeCovers.map((cover,index) => <button key={cover.id} aria-label={'Show ' + cover.label} aria-current={index === active ? 'true' : undefined} disabled={busy} onClick={() => void go(index)}><span /></button>)}</div>
      <div className="cover-actions">
        <button aria-label="Previous cover" disabled={busy} onClick={() => void go(active - 1, -1)}>←</button>
        <button aria-label={reduced ? 'Automatic rotation disabled for reduced motion' : paused ? 'Play automatic rotation' : 'Pause automatic rotation'} aria-pressed={paused || reduced} disabled={reduced} onClick={togglePause}>{paused || reduced ? 'Play' : 'Pause'}</button>
        <button aria-label="Next cover" disabled={busy} onClick={() => void go(active + 1, 1)}>→</button>
      </div>
    </div>
    {error && <p role="alert" className="load-error">{error}</p>}
  </div>
}

