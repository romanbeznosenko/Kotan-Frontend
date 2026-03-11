export const CompetitionTypeEnum = {
    LEAGUE: 'LEAGUE',
    CUP: 'CUP',
    FRIENDLY: 'FRIENDLY',
} as const;

export type CompetitionType = typeof CompetitionTypeEnum[keyof typeof CompetitionTypeEnum];
