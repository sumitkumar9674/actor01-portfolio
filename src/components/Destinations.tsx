import { useEffect, useRef, useState } from 'react'
import { actorProfile as actor, contactDetails, gallery, motionWorks, type Destination } from '../portfolioContent'
import { imageManifest } from '../imageManifest'

function Gallery() {
  const [selected, select] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    if (selected === null) return
    dialog.current?.showModal()
    const before = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = before }
  }, [selected])
  const close = () => { dialog.current?.close(); select(null); opener.current?.focus() }
  const change = (offset: number) => select(index => index === null ? null : (index + offset + gallery.length) % gallery.length)
  return <main className="destination gallery-page" id="main-content" tabIndex={-1}>
    <p className="eyebrow">The photographic archive</p>
    <div className="page-heading"><h1>One actor.<br /><em>Many possibilities.</em></h1><p>Presence, expression and character.<br />Selected studio portraits.</p></div>
    <div className="gallery-grid">{gallery.map((entry,index) => <button className={'gallery-item gallery-item--' + entry.image} key={entry.image} onClick={event => { opener.current = event.currentTarget; select(index) }} aria-label={'Enlarge ' + entry.title}>
      <div><img src={imageManifest[entry.image].src} alt={imageManifest[entry.image].alt} loading="lazy" /></div>
      <span><small>{String(index + 1).padStart(2,'0')}</small>{entry.title}<i>↗</i></span>
    </button>)}</div>
    <dialog ref={dialog} className="image-viewer" onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) close() }} onKeyDown={event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); change(1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); change(-1) }
    }} aria-label="Expanded portrait">
      {selected !== null && <><button className="viewer-close" autoFocus onClick={close}>Close ×</button>
      <img src={imageManifest[gallery[selected].image].src} alt={imageManifest[gallery[selected].image].alt} />
      <div className="viewer-controls"><button onClick={() => change(-1)} aria-label="Previous photograph">←</button><span>{gallery[selected].title} / {selected + 1} of {gallery.length}</span><button onClick={() => change(1)} aria-label="Next photograph">→</button></div></>}
    </dialog>
  </main>
}

export function Destinations({ page }: { page: Exclude<Destination,'home'> }) {
  if (page === 'gallery') return <Gallery />
  if (page === 'about') return <main className="destination about-page" id="main-content" tabIndex={-1}>
    <p className="eyebrow">About / Mihir Chaurasia</p>
    <h1>The craft<br />before the <em>camera.</em></h1>
    <div className="biography-spread">
      <figure className="biography-photo"><img src={imageManifest.biography.src} alt={imageManifest.biography.alt} /><figcaption>Portrait study / Mihir Chaurasia</figcaption></figure>
      <div className="biography-copy"><p className="lead">{actor.biography}</p><p>{actor.background}</p>
        <h2>{actor.training}<span>Graduate</span></h2>
        <dl className="experience"><div><dt>0{actor.theatreYears}</dt><dd>Years of theatre</dd></div><div><dt>0{actor.playsDirected}</dt><dd>Plays directed</dd></div></dl>
        <p className="eyebrow">An interest in new stories</p><p>{actor.interests.join(' / ')}</p>
      </div>
    </div>
  </main>
  if (page === 'motion') return <main className="destination motion-page" id="main-content" tabIndex={-1}>
    <p className="eyebrow">The moving image</p><h1>Beyond<br />the <em>still.</em></h1>
    <div className="motion-stage"><span className="motion-bracket">[</span><div><p className="eyebrow">Showreels / Performances / Monologues</p><h2>A space for<br />stories in motion.</h2><p>Video work will be shared here when available.</p></div><span className="motion-bracket">]</span></div>
    {motionWorks.map(work => <figure key={work.src}><video controls preload="metadata" poster={work.poster} src={work.src} /><figcaption>{work.title}</figcaption></figure>)}
  </main>
  return <main className="destination contact-page" id="main-content" tabIndex={-1}>
    <p className="eyebrow">Casting / Collaborations / Creative projects</p>
    <h1>The next<br />story <em>awaits.</em></h1>
    <div className="contact-spread"><div><p className="lead">Let’s make<br />something memorable.</p><p>For casting opportunities in films, web series, advertising and OTT projects, and for creative collaborations.</p>
      <div className="contact-details">{contactDetails.email ? <a href={'mailto:' + contactDetails.email}>{contactDetails.email} ↗</a> : <><span className="eyebrow">Professional enquiries</span><p>Contact details will be available here soon.</p></>}
      {contactDetails.phone && <a href={'tel:' + contactDetails.phone}>{contactDetails.phone}</a>}
      {contactDetails.social.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>
    </div><figure><img src={imageManifest.profile.src} alt={imageManifest.profile.alt} /></figure></div>
  </main>
}

