export const actorProfile = {
  name: 'Mihir Chaurasia',
  professions: ['Actor', 'Theatre Artist', 'Director'],
  training: 'Graduate of the National School of Drama',
  theatreYears: 3,
  playsDirected: 2,
  interests: ['Films', 'Web series', 'Advertising', 'OTT projects'],
} as const

export const chapters = [
  { id: 'arrival', number: '01', label: 'The Arrival', startScene: 0 },
  { id: 'actor', number: '02', label: 'The Actor', startScene: 3 },
  { id: 'foundation', number: '03', label: 'The Foundation', startScene: 5 },
  { id: 'many-faces', number: '04', label: 'The Many Faces', startScene: 6 },
  { id: 'final-frame', number: '05', label: 'The Final Frame', startScene: 8 },
] as const

export type ChapterId = (typeof chapters)[number]['id']

