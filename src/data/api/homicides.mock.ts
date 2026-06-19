export interface MockHomicideYearSummary {
  year: number
  total: number
  ratePer100k: number
  variation: number
}

export interface MockHomicideDepartmentSummary {
  department: string
  total: number
  ratePer100k: number
}

export interface MockHomicidesResponse {
  source: string
  sourceDescription: string
  updatedAt: string
  isMock: true
  years: MockHomicideYearSummary[]
  departments: MockHomicideDepartmentSummary[]
}

export const homicidesMockResponse: MockHomicidesResponse = {
  source: 'Observatorio simulado RIA',
  sourceDescription: 'Servicio academico simulado de indicadores de seguridad publica.',
  updatedAt: '2026-06-18T18:45:00.000Z',
  isMock: true,
  years: [
    {
      year: 2021,
      total: 298,
      ratePer100k: 8.4,
      variation: -2.6,
    },
    {
      year: 2022,
      total: 321,
      ratePer100k: 9.1,
      variation: 7.7,
    },
    {
      year: 2023,
      total: 309,
      ratePer100k: 8.7,
      variation: -3.7,
    },
    {
      year: 2024,
      total: 334,
      ratePer100k: 9.4,
      variation: 8.1,
    },
    {
      year: 2025,
      total: 316,
      ratePer100k: 8.9,
      variation: -5.4,
    },
  ],
  departments: [
    {
      department: 'Montevideo',
      total: 142,
      ratePer100k: 10.6,
    },
    {
      department: 'Canelones',
      total: 58,
      ratePer100k: 9.3,
    },
    {
      department: 'Maldonado',
      total: 21,
      ratePer100k: 10.1,
    },
    {
      department: 'Rivera',
      total: 16,
      ratePer100k: 14.2,
    },
    {
      department: 'Salto',
      total: 13,
      ratePer100k: 10.4,
    },
  ]
}
