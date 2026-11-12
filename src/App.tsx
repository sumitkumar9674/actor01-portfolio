import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { destinations, type Destination } from './portfolioContent'
import { Home } from './components/Home'
import { Destinations } from './components/Destinations'
import { MobileNavigation } from './components/MobileNavigation'
import './App.css'

function readRoute(): Destination | null {
  const path = location.pathname.replace(/\/$/, '') || '/'
  return path === '/' ? 'home' : destinations.find(item => '/' + item === path) ?? null
}
export default function App() {
  const [page, setPage] = useState(readRoute)
  const savedCover = useRef(0)
  const remember = useCallback((index: number) => { savedCover.current = index }, [])
  const navigate = (event: MouseEvent<HTMLAnchorElement>, next: Destination) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    const url = next === 'home' ? '/' : '/' + next
    if (location.pathname !== url) history.pushState({}, '', url)
    setPage(next)
  }
  useEffect(() => {
    const back = () => { setPage(readRoute()) }
    window.addEventListener('popstate', back)
    return () => window.removeEventListener('popstate', back)
  }, [])
  useEffect(() => {
    window.scrollTo(0,0)
    document.title = 'Mihir Chaurasia — ' + (page ? page[0].toUpperCase() + page.slice(1) : 'Page not found')
    document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true })
  }, [page])
  return <div className={'site site--' + page}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header"><a className="wordmark" href="/" onClick={event => navigate(event,'home')} aria-label="Mihir Chaurasia home">MC<span>Actor & storyteller</span></a>
      <a className="mobile-contact" href="/contact" aria-current={page === 'contact' ? 'page' : undefined} onClick={event => navigate(event,'contact')}>Contact <span aria-hidden="true">↗</span></a>
      <nav id="site-navigation" className="desktop-navigation" aria-label="Main navigation">{destinations.map(item => <a key={item} href={item === 'home' ? '/' : '/' + item} aria-current={page === item ? 'page' : undefined} onClick={event => navigate(event,item)}>{item}</a>)}</nav>
      <span className="edition">Portfolio / 2026</span>
      <MobileNavigation page={page} navigate={navigate} />
    </header>
    {page === 'home' ? <main id="main-content" tabIndex={-1}><Home initial={savedCover.current} remember={remember} suspended={false} /></main> : page ? <Destinations key={page} page={page} /> : <main id="main-content" className="destination" tabIndex={-1}><p className="eyebrow">404</p><h1>Out of frame.</h1><a href="/" onClick={event => navigate(event,'home')}>Return home →</a></main>}
    {page !== 'home' && <footer className="site-footer"><span>Mihir Chaurasia</span><span>Actor / Theatre Artist / Director</span><a href="/" onClick={event => navigate(event,'home')}>Back to the covers ↑</a></footer>}
  </div>
}
