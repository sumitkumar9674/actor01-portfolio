import { type RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { magazineScenes, sceneTransition } from './coverConfig'

gsap.registerPlugin(Observer)

const textTargets = '.scene__kicker, .scene__headline span, .scene__description, .scene__facts, .scene__stats, .scene__note, .scene__showreel, .scene__contact'

export function useCinematicCover(coverRef: RefObject<HTMLElement | null>) {
  const [activeScene, setActiveScene] = useState(0)
  const sceneRef = useRef(0)
  const lockedRef = useRef(false)
  const reducedMotionRef = useRef(false)

  const goToScene = useCallback((requestedScene: number) => {
    const root = coverRef.current
    const nextIndex = Math.max(0, Math.min(magazineScenes.length - 1, requestedScene))
    const currentIndex = sceneRef.current

    if (!root || lockedRef.current || nextIndex === currentIndex) return

    const current = root.querySelector<HTMLElement>(`[data-scene-index="${currentIndex}"]`)
    const next = root.querySelector<HTMLElement>(`[data-scene-index="${nextIndex}"]`)
    if (!current || !next) return

    const direction = nextIndex > currentIndex ? 1 : -1
    const currentImage = current.querySelector('.scene__figure')
    const nextImage = next.querySelector('.scene__figure')
    const currentText = current.querySelectorAll(textTargets)
    const nextText = next.querySelectorAll(textTargets)
    const currentDecor = current.querySelectorAll('.scene__giant, .scene__echo, .scene__folio')
    const nextDecor = next.querySelectorAll('.scene__giant, .scene__echo, .scene__folio')

    lockedRef.current = true
    sceneRef.current = nextIndex
    setActiveScene(nextIndex)

    if (reducedMotionRef.current) {
      gsap.set(current, { autoAlpha: 0, zIndex: 1 })
      gsap.set(next, { autoAlpha: 1, zIndex: 2 })
      lockedRef.current = false
      return
    }

    gsap.killTweensOf([current, next, currentImage, nextImage, ...currentText, ...nextText])
    gsap.set(next, { autoAlpha: 1, zIndex: 3 })

    const revealInset = direction > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)'
    const leaveInset = direction > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'

    gsap.timeline({
      defaults: { ease: sceneTransition.ease },
      onComplete: () => {
        gsap.set(current, { autoAlpha: 0, zIndex: 1 })
        gsap.set(next, { zIndex: 2 })
        lockedRef.current = false
      },
    })
      .to(currentText, {
        xPercent: -direction * 8,
        autoAlpha: 0,
        duration: 0.46,
        stagger: 0.018,
      }, 0)
      .to(currentDecor, {
        xPercent: -direction * 5,
        autoAlpha: 0,
        duration: 0.55,
      }, 0)
      .to(currentImage, {
        xPercent: -direction * 5,
        scale: 1.065,
        rotate: direction * -0.7,
        clipPath: leaveInset,
        duration: sceneTransition.duration,
      }, 0)
      .to(current, { autoAlpha: 0, duration: 0.56 }, 0.42)
      .fromTo(nextImage, {
        xPercent: direction * 8,
        scale: 1.12,
        rotate: direction * 0.8,
        clipPath: revealInset,
      }, {
        xPercent: 0,
        scale: 1,
        rotate: 0,
        clipPath: 'inset(0 0 0 0)',
        duration: sceneTransition.duration,
      }, 0.16)
      .fromTo(nextText, {
        xPercent: direction * 9,
        y: 18,
        autoAlpha: 0,
      }, {
        xPercent: 0,
        y: 0,
        autoAlpha: 1,
        duration: 0.72,
        stagger: 0.045,
      }, 0.45)
      .fromTo(nextDecor, {
        xPercent: direction * 6,
        autoAlpha: 0,
      }, {
        xPercent: 0,
        autoAlpha: 1,
        duration: 0.8,
      }, 0.38)
  }, [coverRef])

  useLayoutEffect(() => {
    const root = coverRef.current
    if (!root) return

    const scenes = root.querySelectorAll<HTMLElement>('.magazine-scene')
    const firstScene = scenes[0]
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => { reducedMotionRef.current = motionQuery.matches }

    syncMotionPreference()
    motionQuery.addEventListener('change', syncMotionPreference)
    gsap.set(scenes, { autoAlpha: 0, zIndex: 1 })
    gsap.set(firstScene, { autoAlpha: 1, zIndex: 2 })

    const context = gsap.context(() => {
      if (!motionQuery.matches) {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.scene--arrival-profile .scene__figure', {
            xPercent: 8, scale: 1.08, clipPath: 'inset(0 0 0 35%)', duration: 1.35,
          })
          .from('.scene--arrival-profile .scene__headline span', {
            yPercent: 80, autoAlpha: 0, stagger: 0.09, duration: 0.9,
          }, '-=0.9')
          .from('.scene--arrival-profile .scene__kicker, .scene--arrival-profile .scene__description, .scene--arrival-profile .scene__facts, .magazine-header, .magazine-footer, .chapter-nav', {
            y: 12, autoAlpha: 0, stagger: 0.055, duration: 0.65,
          }, '-=0.48')
      }
    }, root)

    const observer = Observer.create({
      target: window,
      type: 'wheel,touch,pointer',
      preventDefault: true,
      tolerance: sceneTransition.inputTolerance,
      wheelSpeed: 0.72,
      onDown: () => goToScene(sceneRef.current + 1),
      onUp: () => goToScene(sceneRef.current - 1),
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        goToScene(sceneRef.current + 1)
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        goToScene(sceneRef.current - 1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        goToScene(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        goToScene(magazineScenes.length - 1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      observer.kill()
      context.revert()
      window.removeEventListener('keydown', onKeyDown)
      motionQuery.removeEventListener('change', syncMotionPreference)
    }
  }, [coverRef, goToScene])

  return { activeScene, goToScene }
}
