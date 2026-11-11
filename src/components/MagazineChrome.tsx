import { chapters } from '../portfolioContent'
import { magazineScenes } from '../coverConfig'

type MagazineChromeProps = {
  activeScene: number
  activeChapter: number
  onSceneChange: (sceneIndex: number) => void
}

export function MagazineChrome({ activeScene, activeChapter, onSceneChange }: MagazineChromeProps) {
  return (
    <>
      <header className="magazine-header">
        <p className="magazine-header__title">Mihir Chaurasia / A cinematic portfolio</p>
        <p className="magazine-header__issue">Issue 001 — 2026</p>
      </header>

      <nav className="chapter-nav" aria-label="Portfolio chapters">
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            className={index === activeChapter ? 'is-active' : ''}
            aria-current={index === activeChapter ? 'step' : undefined}
            aria-label={`Open chapter ${chapter.number}: ${chapter.label}`}
            onClick={() => onSceneChange(chapter.startScene)}
          >
            <span>{chapter.number}</span>
            <em>{chapter.label}</em>
          </button>
        ))}
      </nav>

      <footer className="magazine-footer">
        <div className="magazine-progress" aria-live="polite">
          <strong>0{activeScene + 1}</strong>
          <span>{magazineScenes[activeScene].label}</span>
        </div>

        <div className="scene-dots" aria-label="Magazine frames">
          {magazineScenes.map((scene, index) => (
            <button
              key={`${scene.chapter}-${scene.label}`}
              type="button"
              className={index === activeScene ? 'is-active' : ''}
              aria-label={`Open frame ${index + 1}: ${scene.label}`}
              aria-current={index === activeScene ? 'step' : undefined}
              onClick={() => onSceneChange(index)}
            />
          ))}
        </div>

        <div className="gesture-cue" aria-hidden="true">
          <span>Scroll / Swipe / Keys</span><i />
        </div>
      </footer>
    </>
  )
}
