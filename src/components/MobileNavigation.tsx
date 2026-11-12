import { useLayoutEffect, useRef, type MouseEvent } from 'react'
import { destinations, type Destination } from '../portfolioContent'

const chapters = destinations.filter(item => item !== 'contact')

export function MobileNavigation({ page, navigate }: {
  page: Destination | null
  navigate: (event: MouseEvent<HTMLAnchorElement>, next: Destination) => void
}) {
  const strip = useRef<HTMLDivElement>(null)
  const nav = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const viewport = nav.current!
    const updateEdges = () => {
      strip.current!.dataset.before = String(viewport.scrollLeft > 1)
      strip.current!.dataset.after = String(viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft > 1)
    }
    const revealActive = () => {
      if (!viewport.clientWidth) return
      const active = viewport.querySelector<HTMLElement>('[aria-current="page"]')
      if (active) {
        const bounds = viewport.getBoundingClientRect()
        const item = active.getBoundingClientRect()
        // Scroll only this row; never move the page or the Home composition.
        const delta = item.left < bounds.left + 8 ? item.left - bounds.left - 8
          : item.right > bounds.right - 8 ? item.right - bounds.right + 8 : 0
        if (delta) viewport.scrollBy({ left: delta, behavior: 'instant' })
      }
      updateEdges()
    }
    const observer = new ResizeObserver(revealActive)
    observer.observe(viewport)
    for (const item of viewport.children) observer.observe(item)
    viewport.addEventListener('scroll', updateEdges, { passive: true })
    revealActive()
    return () => {
      observer.disconnect()
      viewport.removeEventListener('scroll', updateEdges)
    }
  }, [page])

  return <div className="chapter-strip" ref={strip}>
    <nav className="chapter-navigation" ref={nav} aria-label="Chapters">
      {chapters.map((item, index) => <a key={item} href={item === 'home' ? '/' : '/' + item}
        aria-current={page === item ? 'page' : undefined} onClick={event => navigate(event, item)}>
        <span aria-hidden="true">0{index + 1}</span>{item}
      </a>)}
    </nav>
  </div>
}
