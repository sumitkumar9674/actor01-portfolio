import { useMemo, useRef } from 'react'
import { magazineScenes } from './coverConfig'
import { chapters } from './portfolioContent'
import { EditorialScene } from './components/EditorialScene'
import { MagazineChrome } from './components/MagazineChrome'
import { useCinematicCover } from './useCinematicCover'
import './App.css'

function App() {
  const magazineRef = useRef<HTMLElement>(null)
  const { activeScene, goToScene } = useCinematicCover(magazineRef)

  const activeChapter = useMemo(() => {
    const chapterIndex = chapters.findLastIndex((chapter) => activeScene >= chapter.startScene)
    return Math.max(0, chapterIndex)
  }, [activeScene])

  return (
    <main
      ref={magazineRef}
      className="magazine"
      data-active-scene={activeScene + 1}
      data-active-chapter={chapters[activeChapter].id}
      aria-label="Mihir Chaurasia interactive cinematic portfolio"
    >
      <p className="sr-only">
        Use the arrow keys, page keys, scroll wheel, swipe gestures, or chapter navigation to move through the portfolio.
      </p>

      <div className="magazine-grain" aria-hidden="true" />
      <div className="magazine-frame" aria-hidden="true"><i /><i /></div>

      <div className="scene-stack">
        {magazineScenes.map((scene, index) => (
          <EditorialScene
            key={`${scene.chapter}-${scene.label}`}
            scene={scene}
            index={index}
            active={index === activeScene}
          />
        ))}
      </div>

      <MagazineChrome
        activeScene={activeScene}
        activeChapter={activeChapter}
        onSceneChange={goToScene}
      />
    </main>
  )
}

export default App
