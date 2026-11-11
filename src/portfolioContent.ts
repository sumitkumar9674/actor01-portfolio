import type { ImageKey } from './imageManifest'

export const actorProfile = {
  name: 'Mihir Chaurasia',
  professions: ['Actor', 'Theatre Artist', 'Director'],
  training: 'National School of Drama',
  theatreYears: 3,
  playsDirected: 2,
  biography: 'An actor shaped by theatre, drawn to storytelling, and committed to exploring the possibilities of performance.',
  background: 'A graduate of the National School of Drama, Mihir brings three years of theatre experience and the experience of directing two plays. His training also includes participation in multiple acting workshops.',
  interests: ['Films', 'Web series', 'Advertising', 'OTT projects'],
}
export const destinations = ['home', 'about', 'gallery', 'motion', 'contact'] as const
export type Destination = typeof destinations[number]
export const gallery: { image: ImageKey; title: string }[] = [
  { image: 'profile', title: 'In profile' },
  { image: 'chairPortrait', title: 'A direct gaze' },
  { image: 'architecture', title: 'Structure & presence' },
  { image: 'seatedWide', title: 'An open frame' },
  { image: 'closeup', title: 'The quiet moment' },
  { image: 'reveal', title: 'Looking ahead' },
  { image: 'biography', title: 'The actor' },
  { image: 'seatedCloser', title: 'A closer reading' },
  { image: 'sofa', title: 'The final frame' },
]
export const contactDetails: { email: string | null; phone: string | null; social: { label: string; url: string }[] } = {
  email: null, phone: null, social: [],
}
export const motionWorks: { title: string; src: string; poster?: string }[] = []

