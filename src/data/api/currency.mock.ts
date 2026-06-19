export interface MockCurrencyRate {
  code: string
  name: string
  buy: number
  sell: number
  variation: number
}

export interface MockCurrencyResponse {
  base: 'UYU'
  source: string
  updatedAt: string
  rates: MockCurrencyRate[]
}

export const currencyMockResponse: MockCurrencyResponse = {
  base: 'UYU',
  source: 'Mesa de cambios simulada',
  updatedAt: '2026-06-18T15:30:00.000Z',
  rates: [
    {
      code: 'USD',
      name: 'Dólar estadounidense',
      buy: 39.1,
      sell: 41.35,
      variation: 0.18,
    },
    {
      code: 'EUR',
      name: 'Euro',
      buy: 45.15,
      sell: 48.2,
      variation: -0.12,
    },
    {
      code: 'BRL',
      name: 'Real brasileño',
      buy: 6.85,
      sell: 8.15,
      variation: 0.07,
    },
    {
      code: 'ARS',
      name: 'Peso argentino',
      buy: 0.028,
      sell: 0.052,
      variation: -0.31,
    },
  ],
}
