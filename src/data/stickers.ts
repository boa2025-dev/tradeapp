export type StickerType = 'intro' | 'museum' | 'badge' | 'teamphoto' | 'player' | 'cocacola'

export interface Sticker {
  id: string
  name: string
  type: StickerType
  teamCode?: string
  teamName?: string
  group?: string
  number: number
}

export interface Team {
  code: string
  name: string
  flag: string
  group: string
}

export interface Group {
  id: string
  teams: Team[]
}

export const GROUPS: Group[] = [
  {
    id: 'A',
    teams: [
      { code: 'MEX', name: 'México', flag: '🇲🇽', group: 'A' },
      { code: 'RSA', name: 'Sudáfrica', flag: '🇿🇦', group: 'A' },
      { code: 'KOR', name: 'Corea del Sur', flag: '🇰🇷', group: 'A' },
      { code: 'CZE', name: 'Chequia', flag: '🇨🇿', group: 'A' },
    ],
  },
  {
    id: 'B',
    teams: [
      { code: 'CAN', name: 'Canadá', flag: '🇨🇦', group: 'B' },
      { code: 'BIH', name: 'Bosnia-Herzegovina', flag: '🇧🇦', group: 'B' },
      { code: 'QAT', name: 'Qatar', flag: '🇶🇦', group: 'B' },
      { code: 'SUI', name: 'Suiza', flag: '🇨🇭', group: 'B' },
    ],
  },
  {
    id: 'C',
    teams: [
      { code: 'BRA', name: 'Brasil', flag: '🇧🇷', group: 'C' },
      { code: 'MAR', name: 'Marruecos', flag: '🇲🇦', group: 'C' },
      { code: 'HAI', name: 'Haití', flag: '🇭🇹', group: 'C' },
      { code: 'SCO', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
    ],
  },
  {
    id: 'D',
    teams: [
      { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸', group: 'D' },
      { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', group: 'D' },
      { code: 'AUS', name: 'Australia', flag: '🇦🇺', group: 'D' },
      { code: 'TUR', name: 'Turquía', flag: '🇹🇷', group: 'D' },
    ],
  },
  {
    id: 'E',
    teams: [
      { code: 'GER', name: 'Alemania', flag: '🇩🇪', group: 'E' },
      { code: 'CUR', name: 'Curazao', flag: '🇨🇼', group: 'E' },
      { code: 'CIV', name: 'Costa de Marfil', flag: '🇨🇮', group: 'E' },
      { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', group: 'E' },
    ],
  },
  {
    id: 'F',
    teams: [
      { code: 'NED', name: 'Países Bajos', flag: '🇳🇱', group: 'F' },
      { code: 'JPN', name: 'Japón', flag: '🇯🇵', group: 'F' },
      { code: 'SWE', name: 'Suecia', flag: '🇸🇪', group: 'F' },
      { code: 'TUN', name: 'Túnez', flag: '🇹🇳', group: 'F' },
    ],
  },
  {
    id: 'G',
    teams: [
      { code: 'BEL', name: 'Bélgica', flag: '🇧🇪', group: 'G' },
      { code: 'EGY', name: 'Egipto', flag: '🇪🇬', group: 'G' },
      { code: 'IRN', name: 'Irán', flag: '🇮🇷', group: 'G' },
      { code: 'NZL', name: 'Nueva Zelanda', flag: '🇳🇿', group: 'G' },
    ],
  },
  {
    id: 'H',
    teams: [
      { code: 'ESP', name: 'España', flag: '🇪🇸', group: 'H' },
      { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', group: 'H' },
      { code: 'KSA', name: 'Arabia Saudita', flag: '🇸🇦', group: 'H' },
      { code: 'URU', name: 'Uruguay', flag: '🇺🇾', group: 'H' },
    ],
  },
  {
    id: 'I',
    teams: [
      { code: 'FRA', name: 'Francia', flag: '🇫🇷', group: 'I' },
      { code: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'I' },
      { code: 'IRQ', name: 'Irak', flag: '🇮🇶', group: 'I' },
      { code: 'NOR', name: 'Noruega', flag: '🇳🇴', group: 'I' },
    ],
  },
  {
    id: 'J',
    teams: [
      { code: 'ARG', name: 'Argentina', flag: '🇦🇷', group: 'J' },
      { code: 'ALG', name: 'Argelia', flag: '🇩🇿', group: 'J' },
      { code: 'AUT', name: 'Austria', flag: '🇦🇹', group: 'J' },
      { code: 'JOR', name: 'Jordania', flag: '🇯🇴', group: 'J' },
    ],
  },
  {
    id: 'K',
    teams: [
      { code: 'POR', name: 'Portugal', flag: '🇵🇹', group: 'K' },
      { code: 'COD', name: 'RD Congo', flag: '🇨🇩', group: 'K' },
      { code: 'UZB', name: 'Uzbekistán', flag: '🇺🇿', group: 'K' },
      { code: 'COL', name: 'Colombia', flag: '🇨🇴', group: 'K' },
    ],
  },
  {
    id: 'L',
    teams: [
      { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
      { code: 'CRO', name: 'Croacia', flag: '🇭🇷', group: 'L' },
      { code: 'GHA', name: 'Ghana', flag: '🇬🇭', group: 'L' },
      { code: 'PAN', name: 'Panamá', flag: '🇵🇦', group: 'L' },
    ],
  },
]

function buildStickers(): Sticker[] {
  const stickers: Sticker[] = []

  // Intro FWC stickers
  stickers.push({ id: 'FWC00', name: 'Logo Panini', type: 'intro', number: 0 })
  const introNames = [
    'Presentación', 'Sede USA', 'Sede Canadá', 'Sede México',
    'Estadios', 'Trofeo FIFA', 'Historia del Mundial', 'Camino al título',
  ]
  for (let i = 1; i <= 8; i++) {
    stickers.push({ id: `FWC0${i}`, name: introNames[i - 1], type: 'intro', number: i })
  }

  // FIFA Museum stickers (pasados campeones)
  const museumNames = [
    'Uruguay 1930', 'Italia 1934', 'Italia 1938', 'Uruguay 1950',
    'Alemania Occ. 1954', 'Brasil 1958', 'Brasil 1962', 'Inglaterra 1966',
    'Brasil 1970', 'Alemania Occ. 1974', 'Argentina 1978',
  ]
  for (let i = 9; i <= 19; i++) {
    stickers.push({ id: `FWC${i}`, name: museumNames[i - 9], type: 'museum', number: i })
  }

  // Team stickers
  for (const group of GROUPS) {
    for (const team of group.teams) {
      // Sticker 1: Escudo (foil)
      stickers.push({
        id: `${team.code}1`,
        name: `Escudo ${team.name}`,
        type: 'badge',
        teamCode: team.code,
        teamName: team.name,
        group: group.id,
        number: 1,
      })
      // Sticker 2: Foto grupal
      stickers.push({
        id: `${team.code}2`,
        name: `Foto ${team.name}`,
        type: 'teamphoto',
        teamCode: team.code,
        teamName: team.name,
        group: group.id,
        number: 2,
      })
      // Stickers 3-20: Jugadores
      for (let p = 3; p <= 20; p++) {
        stickers.push({
          id: `${team.code}${p}`,
          name: `${team.name} #${p - 2}`,
          type: 'player',
          teamCode: team.code,
          teamName: team.name,
          group: group.id,
          number: p,
        })
      }
    }
  }

  // Coca-Cola exclusive stickers (CC1–CC14)
  for (let i = 1; i <= 14; i++) {
    stickers.push({
      id: `CC${i}`,
      name: `Coca-Cola Exclusiva #${i}`,
      type: 'cocacola',
      number: i,
    })
  }

  return stickers
}

export const CC_STICKERS_IDS = Array.from({ length: 14 }, (_, i) => `CC${i + 1}`)

export const ALL_STICKERS: Sticker[] = buildStickers()

export const STICKER_MAP: Record<string, Sticker> = Object.fromEntries(
  ALL_STICKERS.map(s => [s.id, s])
)

export const TOTAL_STICKERS = ALL_STICKERS.length

export function getStickersByTeam(teamCode: string): Sticker[] {
  return ALL_STICKERS.filter(s => s.teamCode === teamCode)
}

export function getStickersByGroup(groupId: string): Sticker[] {
  return ALL_STICKERS.filter(s => s.group === groupId)
}

export function getTeamByCode(code: string): Team | undefined {
  for (const g of GROUPS) {
    const t = g.teams.find(t => t.code === code)
    if (t) return t
  }
  return undefined
}
