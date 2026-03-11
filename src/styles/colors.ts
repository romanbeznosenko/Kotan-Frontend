export const colors = {
  success: '#389e0d',
  error: '#f5222d',
  backgroundColor: '#f0fbff',
  brandColor: '#3ba3e9',
  hovorColor: '#64c0f5',
} as const;

export const AgeGroup = {
  Zak:        'Żak',
  Orlik:      'Orlik',
  Orliczki:   'Orliczki',
  Mlodzik:    'Młodzik',
  Mlodziczki: 'Młodziczki',
  Junior:     'Junior',
  Juniorki:   'Juniorki',
  Seniory:    'Seniory',
  Seniorki:   'Seniorki',
} as const;

export type AgeGroup = typeof AgeGroup[keyof typeof AgeGroup];

export const ageGroupColors: Record<AgeGroup, string> = {
  [AgeGroup.Zak]:        '#faad14',
  [AgeGroup.Orlik]:      '#52c41a',
  [AgeGroup.Orliczki]:   '#95de64',
  [AgeGroup.Mlodzik]:    '#1677ff',
  [AgeGroup.Mlodziczki]: '#69b1ff',
  [AgeGroup.Junior]:     '#722ed1',
  [AgeGroup.Juniorki]:   '#b37feb',
  [AgeGroup.Seniory]:    '#f5222d',
  [AgeGroup.Seniorki]:   '#ff7875',
};
