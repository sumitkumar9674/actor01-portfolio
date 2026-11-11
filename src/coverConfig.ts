import type { ImageKey } from './imageManifest'

export type Cover = {
  id: string
  image: ImageKey
  label: string
  lines: string[]
  description: string
  credit: string
}
export const homeCovers: Cover[] = [
  { id: 'introduction', image: 'sofa', label: 'The introduction',
    lines: ['Mihir', 'Chaurasia'], description: 'The stage is where the story began.',
    credit: 'Actor / Theatre Artist / Director' },
  { id: 'character', image: 'chairPortrait', label: 'The character',
    lines: ['The craft', 'before', 'the camera.'],
    description: 'An actor shaped by theatre, drawn to storytelling, and committed to exploring the possibilities of performance.',
    credit: 'Presence. Expression. Character.' },
  { id: 'presence', image: 'architecture', label: 'The presence',
    lines: ['The body', 'holds', 'the frame.'],
    description: 'A study in stillness, posture and presence.',
    credit: 'Mihir Chaurasia / Portrait study' },
  { id: 'artist', image: 'closeup', label: 'The artist',
    lines: ['Shaped', 'by the', 'stage.'],
    description: 'National School of Drama — Graduate',
    credit: '03 years of theatre / 02 plays directed' },
]
export const animationSettings = {
  intervalMs: 7000,
  duration: 1.15,
  ease: 'power3.inOut',
  imageTravelPercent: 4,
  imageEntryScale: 1.035,
  textTravel: 24,
  wheelThreshold: 45,
  gestureIdleMs: 200,
}
