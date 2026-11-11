export const imageManifest = {
  profile: {
    src: '/images/cutouts/DSC09138_cutout.png',
    alt: 'Mihir Chaurasia in a full-body side profile',
  },
  reveal: {
    src: '/images/cutouts/DSC09091_cutout.png',
    alt: 'Mihir Chaurasia standing in a three-quarter portrait',
  },
  architecture: {
    src: '/images/cutouts/DSC09089_cutout.png',
    alt: 'Mihir Chaurasia in a raised-arm portrait beside a dark pillar',
  },
  closeup: {
    src: '/images/cutouts/DSC09157_cutout.png',
    alt: 'Close portrait of Mihir Chaurasia resting his face against one hand',
  },
  chairPortrait: {
    src: '/images/cutouts/DSC09123_cutout.png',
    alt: 'Mihir Chaurasia leaning forward across a chair',
  },
  biography: {
    src: '/images/cutouts/DSC09202_cutout.png',
    alt: 'Upper-body portrait of Mihir Chaurasia',
  },
  seatedWide: {
    src: '/images/cutouts/DSC09095_cutout.png',
    alt: 'Mihir Chaurasia seated with both arms extended',
  },
  seatedCloser: {
    src: '/images/cutouts/DSC09099_cutout.png',
    alt: 'Closer seated portrait of Mihir Chaurasia with both arms extended',
  },
  sofa: {
    src: '/images/cutouts/DSC09213_cutout.png',
    alt: 'Mihir Chaurasia seated on a wide sofa',
  },
} as const

export type ImageKey = keyof typeof imageManifest
