import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { homeCovers, animationSettings as settings } from './coverConfig'
import { imageManifest } from './imageManifest'

const imageCache = new Map<string, Promise<void>>()
function ready(src: string) {
  let result = imageCache.get(src)
  if (!result) {
    const image = new Image()
    image.src = src
    result = image.decode().catch(error => { imageCache.delete(src); throw error })
    imageCache.set(src, result)
  }
  return result
}
export function useCinematicCover(rootRef: RefObject<HTMLElement | null>, initial: number, remember: (index: number) => void, suspended: boolean) {
  const [active, setActive] = useState(initial)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [hidden, setHidden] = useState(document.hidden)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [cycle, resetCycle] = useState(0)
  const current = useRef(initial)
  const locked = useRef(false)
  const alive = useRef(false)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const request = useRef(0)

  useLayoutEffect(() => {
    alive.current = true
    const root = rootRef.current!
    const context = gsap.context(() => {
      gsap.set('.cover', { autoAlpha: 0 })
      gsap.set(root.querySelectorAll('.cover')[current.current], { autoAlpha: 1 })
    }, root)
    return () => {
      alive.current = false
      request.current++
      timeline.current?.kill()
      locked.current = false
      context.revert()
    }
  }, [rootRef])

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduced(media.matches); if (media.matches) timeline.current?.progress(1) }
    const visibility = () => {
      setHidden(document.hidden)
      if (document.hidden) timeline.current?.progress(1)
    }
    media.addEventListener('change', update)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      media.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  useEffect(() => {
    // Decode only the active and adjacent photographs ahead of navigation.
    for (const index of [active, (active + 1) % homeCovers.length]) {
      void ready(imageManifest[homeCovers[index].image].src).catch(() => {})
    }
  }, [active])

  const go = useCallback(async (index: number, direction?: number) => {
    if (locked.current || suspended || document.hidden) return
    resetCycle(value => value + 1)
    const nextIndex = (index + homeCovers.length) % homeCovers.length
    if (nextIndex === current.current) return
    locked.current = true
    setBusy(true)
    setError('')
    const token = ++request.current
    try {
      await ready(imageManifest[homeCovers[nextIndex].image].src)
      const nextImage = rootRef.current?.querySelectorAll<HTMLImageElement>('.cover-photo img')[nextIndex]
      await nextImage?.decode()
    } catch {
      if (alive.current && token === request.current) {
        locked.current = false; setBusy(false); setPaused(true)
        setError('This portrait could not load. Please try again.')
      }
      return
    }
    if (!alive.current || token !== request.current) return
    const panels = rootRef.current!.querySelectorAll<HTMLElement>('.cover')
    const old = panels[current.current]
    const next = panels[nextIndex]
    const sign = direction ?? (nextIndex > current.current ? 1 : -1)
    const oldPhoto = old.querySelector('.cover-photo')
    const nextPhoto = next.querySelector('.cover-photo')
    const oldCopy = old.querySelector('.cover-copy')
    const nextCopy = next.querySelector('.cover-copy')
    const settle = () => {
      gsap.set(old, { autoAlpha: 0, zIndex: 0 })
      gsap.set(next, { autoAlpha: 1, zIndex: 1 })
      gsap.set([oldPhoto, nextPhoto, oldCopy, nextCopy], { clearProps: 'transform,opacity,visibility,willChange' })
      current.current = nextIndex
      setActive(nextIndex)
      remember(nextIndex)
      locked.current = false
      setBusy(false)
    }
    timeline.current?.kill()
    // CSS owns composition; GSAP only animates the inner motion layers.
    gsap.set(next, { autoAlpha: 0, zIndex: 2 })
    if (reduced || document.hidden) { settle(); return }
    gsap.set([oldPhoto, nextPhoto], { willChange: 'transform,opacity' })
    gsap.set(nextPhoto, { xPercent: sign * settings.imageTravelPercent, scale: settings.imageEntryScale })
    gsap.set(nextCopy, { y: settings.textTravel, opacity: 0 })
    timeline.current = gsap.timeline({ defaults: { ease: settings.ease }, onComplete: settle })
      .to(oldPhoto, { xPercent: -sign * settings.imageTravelPercent, opacity: 0, duration: settings.duration }, 0)
      .to(oldCopy, { y: -settings.textTravel, opacity: 0, duration: .55 }, 0)
      .to(next, { autoAlpha: 1, duration: settings.duration }, .08)
      .to(nextPhoto, { xPercent: 0, scale: 1, duration: settings.duration }, .08)
      .to(nextCopy, { y: 0, opacity: 1, duration: .8 }, .32)
  }, [reduced, remember, rootRef, suspended])

  useEffect(() => {
    if (paused || reduced || hidden || busy || suspended || homeCovers.length < 2) return
    const timer = window.setTimeout(() => void go(current.current + 1, 1), settings.intervalMs)
    return () => clearTimeout(timer)
  }, [active, paused, reduced, hidden, busy, suspended, cycle, go])

  useEffect(() => {
    const root = rootRef.current!
    let lastWheel = 0, total = 0, consumed = false
    let touch: { x: number; y: number } | null = null
    const interactive = (target: EventTarget | null) => target instanceof Element && !!target.closest('button,a,input,textarea,select')
    const wheel = (event: WheelEvent) => {
      if (suspended || event.ctrlKey || root.clientHeight > innerHeight + 1 || interactive(event.target)) return
      event.preventDefault()
      const now = performance.now()
      if (now - lastWheel > settings.gestureIdleMs) { consumed = false; total = 0 }
      lastWheel = now
      if (locked.current) { consumed = true; return }
      total += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1)
      if (!consumed && Math.abs(total) >= settings.wheelThreshold) {
        consumed = true
        void go(current.current + Math.sign(total), Math.sign(total))
      }
    }
    const start = (event: TouchEvent) => {
      if (!interactive(event.target) && event.touches.length === 1) touch = { x: event.touches[0].clientX, y: event.touches[0].clientY }
    }
    const end = (event: TouchEvent) => {
      if (!touch || suspended || root.clientHeight > innerHeight + 1) { touch = null; return }
      const dx = touch.x - event.changedTouches[0].clientX
      const dy = touch.y - event.changedTouches[0].clientY
      touch = null
      const distance = Math.abs(dx) > Math.abs(dy) ? dx : dy
      if (Math.abs(distance) > 45) void go(current.current + Math.sign(distance), Math.sign(distance))
    }
    const key = (event: KeyboardEvent) => {
      if (suspended || event.repeat || interactive(event.target)) return
      const direction = ['ArrowRight','ArrowDown','PageDown'].includes(event.key) ? 1 : ['ArrowLeft','ArrowUp','PageUp'].includes(event.key) ? -1 : 0
      if (direction) { event.preventDefault(); void go(current.current + direction, direction) }
      else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault(); void go(event.key === 'Home' ? 0 : homeCovers.length - 1)
      }
    }
    root.addEventListener('wheel', wheel, { passive: false })
    root.addEventListener('touchstart', start, { passive: true })
    root.addEventListener('touchend', end)
    window.addEventListener('keydown', key)
    return () => {
      root.removeEventListener('wheel', wheel)
      root.removeEventListener('touchstart', start)
      root.removeEventListener('touchend', end)
      window.removeEventListener('keydown', key)
    }
  }, [go, rootRef, suspended])

  return { active, paused, reduced, busy, error, go, togglePause: () => setPaused(value => !value) }
}
