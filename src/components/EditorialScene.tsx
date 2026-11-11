import type { MagazineScene } from '../coverConfig'
import { imageManifest } from '../imageManifest'

type EditorialSceneProps = {
  scene: MagazineScene
  index: number
  active: boolean
}

export function EditorialScene({ scene, index, active }: EditorialSceneProps) {
  const image = imageManifest[scene.image]

  return (
    <section
      className={`magazine-scene scene--${scene.layout}`}
      data-scene-index={index}
      data-chapter={scene.chapter}
      aria-hidden={!active}
    >
      <div className="scene__backdrop" aria-hidden="true" />
      <div className="scene__giant" aria-hidden="true">{scene.giantText}</div>

      {scene.echo && (
        <div className="scene__echo" aria-hidden="true">
          <img src={image.src} alt="" loading="lazy" draggable="false" />
        </div>
      )}

      <figure className="scene__figure">
        <img
          className="scene__image"
          src={image.src}
          alt={image.alt}
          loading={index < 2 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          draggable="false"
        />
      </figure>

      <div className="scene__copy">
        <p className="scene__kicker">{scene.kicker}</p>
        <h1 className="scene__headline">
          {scene.headline.map((line) => <span key={line}>{line}</span>)}
        </h1>
        {scene.description && <p className="scene__description">{scene.description}</p>}
      </div>

      {scene.facts && (
        <div className="scene__facts" aria-label="Key details">
          {scene.facts.map((fact) => <span key={fact}>{fact}</span>)}
        </div>
      )}

      {scene.stats && (
        <dl className="scene__stats">
          {scene.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.value}</dt>
              <dd>{stat.label}</dd>
            </div>
          ))}
        </dl>
      )}

      {scene.note && <p className="scene__note">{scene.note}</p>}

      {scene.showreelSlot && (
        <aside className="scene__showreel" aria-label="Future showreel area">
          <span>Moving image / Future archive</span>
          <strong>Showreel</strong>
          <small>Video work will live here.</small>
        </aside>
      )}

      {scene.closing && (
        <div className="scene__contact" aria-label="Contact details placeholder">
          <span>Enquiries</span>
          <strong>Details forthcoming</strong>
          <i aria-hidden="true" />
        </div>
      )}

      <span className="scene__folio" aria-hidden="true">0{index + 1}</span>
    </section>
  )
}

