import type { ChapterId } from './portfolioContent'
import type { ImageKey } from './imageManifest'

export type MagazineScene = {
  chapter: ChapterId
  label: string
  layout: string
  image: ImageKey
  kicker: string
  headline: readonly string[]
  description?: string
  giantText?: string
  note?: string
  facts?: readonly string[]
  stats?: readonly { value: string; label: string }[]
  showreelSlot?: boolean
  closing?: boolean
  echo?: boolean
}

export const magazineScenes: readonly MagazineScene[] = [
  {
    chapter: 'arrival', label: 'The Introduction', layout: 'arrival-profile', image: 'profile',
    kicker: 'Chapter 01 / The Arrival', headline: ['Mihir', 'Chaurasia'],
    description: 'The stage is where the story began.', giantText: '01',
    facts: ['Actor / Theatre Artist / Director', 'National School of Drama — Graduate'],
    note: 'A cinematic portfolio / Issue No. 01',
  },
  {
    chapter: 'arrival', label: 'The Reveal', layout: 'arrival-reveal', image: 'reveal',
    kicker: 'Cover Study / 02', headline: ['A Presence', 'In Motion'],
    description: 'An actor shaped by theatre, drawn to storytelling and committed to the possibilities of performance.',
    giantText: 'MIHIR', facts: ['Theatre / Film / New Work'], echo: true,
  },
  {
    chapter: 'arrival', label: 'The Structure', layout: 'arrival-architecture', image: 'architecture',
    kicker: 'Portrait / Structure', headline: ['The Body', 'Holds The Frame.'],
    description: 'Posture, stillness and intent — a portrait constructed like a scene before the first line is spoken.',
    giantText: 'CHAURASIA', note: 'Actor / Theatre Artist / Director',
  },
  {
    chapter: 'actor', label: 'The Close-up', layout: 'actor-close', image: 'closeup',
    kicker: 'Chapter 02 / The Actor', headline: ['The Craft', 'Before The Camera.'],
    description: 'An actor shaped by theatre, drawn to storytelling, and committed to exploring the possibilities of performance.',
    giantText: 'CRAFT', note: 'Presence / Listening / Transformation',
  },
  {
    chapter: 'actor', label: 'The Intensity', layout: 'actor-intense', image: 'chairPortrait',
    kicker: 'Portrait Study / 05', headline: ['A Look', 'Before A Line.'],
    description: 'The work begins in observation — with the body, the breath and the space between action and response.',
    giantText: 'ACTOR', facts: ['Stage-trained', 'Story-led', 'Camera-ready'],
  },
  {
    chapter: 'foundation', label: 'The Foundation', layout: 'foundation', image: 'biography',
    kicker: 'Chapter 03 / The Foundation', headline: ['Shaped By', 'The Stage.'],
    description: 'A graduate of the National School of Drama, grounded in theatre practice and continued acting workshops.',
    giantText: 'NSD',
    stats: [
      { value: '03', label: 'Years of theatre' },
      { value: '02', label: 'Plays directed' },
    ],
    facts: ['National School of Drama — Graduate', 'Acting workshops / Theatre practice'],
  },
  {
    chapter: 'many-faces', label: 'The Wide Study', layout: 'gallery-wide', image: 'seatedWide',
    kicker: 'Chapter 04 / The Many Faces', headline: ['One Actor.', 'Many Possibilities.'],
    description: 'A study in presence, expression and character — one frame opening into the next.',
    giantText: '04', note: 'Gallery study / Frame one of two',
  },
  {
    chapter: 'many-faces', label: 'The Closer Study', layout: 'gallery-close', image: 'seatedCloser',
    kicker: 'Double-page study / 08', headline: ['Presence.', 'Expression.', 'Character.'],
    description: 'A controlled shift in distance. The pose remains; the reading changes.',
    giantText: 'MANY', showreelSlot: true, echo: true,
  },
  {
    chapter: 'final-frame', label: 'The Final Frame', layout: 'final-frame', image: 'sofa',
    kicker: 'Chapter 05 / The Final Frame', headline: ['The Next', 'Story Awaits.'],
    description: 'Available for films, web series, advertising, OTT projects and creative collaborations.',
    giantText: '05', closing: true,
    facts: ['Casting', 'Collaborations', 'Creative projects'],
    note: 'Contact details / To be added',
  },
] as const

export const sceneTransition = {
  duration: 1.15,
  ease: 'power3.inOut',
  inputTolerance: 24,
} as const
