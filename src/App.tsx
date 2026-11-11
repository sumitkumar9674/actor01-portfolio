import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { destinations, type Destination } from './portfolioContent'
import { Home } from './components/Home'
import { Destinations } from './components/Destinations'
import './App.css'

function readRoute(): Destination | null {
  const path = location.pathname.replace(/\/$/, '') || '/'
  return path === '/' ? 'home' : destinations.find(item => '/' + item === path) ?? null
}
export default function App() {
  const [page, setPage] = useState(readRoute)
  const [menu, setMenu] = useState(false)
  const savedCover = useRef(0)
  const remember = useCallback((index: number) => { savedCover.current = index }, [])
  const menuButton = useRef<HTMLButtonElement>(null)
  const navigate = (event: MouseEvent<HTMLAnchorElement>, next: Destination) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    const url = next === 'home' ? '/' : '/' + next
    if (location.pathname !== url) history.pushState({}, '', url)
    setPage(next); setMenu(false)
  }
  useEffect(() => {
    const back = () => { setPage(readRoute()); setMenu(false) }
    window.addEventListener('popstate', back)
    return () => window.removeEventListener('popstate', back)
  }, [])
  useEffect(() => {
    window.scrollTo(0,0)
    document.title = 'Mihir Chaurasia — ' + (page ? page[0].toUpperCase() + page.slice(1) : 'Page not found')
    document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true })
  }, [page])
  useEffect(() => {
    const desktop = matchMedia('(min-width: 701px)')
    const resize = () => { if (desktop.matches) setMenu(false) }
    desktop.addEventListener('change', resize)
    return () => desktop.removeEventListener('change', resize)
  }, [])
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu) { setMenu(false); menuButton.current?.focus() }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menu])
  return <div className={'site site--' + page}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header"><a className="wordmark" href="/" onClick={event => navigate(event,'home')} aria-label="Mihir Chaurasia home">MC<span>Actor & storyteller</span></a>
      <button ref={menuButton} className="menu-toggle" aria-expanded={menu} aria-controls="site-navigation" onClick={() => setMenu(value => !value)}>{menu ? 'Close −' : 'Menu +'}</button>
      <nav id="site-navigation" className={menu ? 'is-open' : ''} aria-label="Main navigation">{destinations.map(item => <a key={item} href={item === 'home' ? '/' : '/' + item} aria-current={page === item ? 'page' : undefined} onClick={event => navigate(event,item)}>{item}</a>)}</nav>
      <span className="edition">Portfolio / 2026</span>
    </header>
    {page === 'home' ? <main id="main-content" tabIndex={-1}><Home initial={savedCover.current} remember={remember} suspended={menu} /></main> : page ? <Destinations key={page} page={page} /> : <main id="main-content" className="destination" tabIndex={-1}><p className="eyebrow">404</p><h1>Out of frame.</h1><a href="/" onClick={event => navigate(event,'home')}>Return home →</a></main>}
    {page !== 'home' && <footer className="site-footer"><span>Mihir Chaurasia</span><span>Actor / Theatre Artist / Director</span><a href="/" onClick={event => navigate(event,'home')}>Back to the covers ↑</a></footer>}
  </div>
}
