import {
  currencyMockResponse,
  type MockCurrencyRate,
  type MockCurrencyResponse,
} from '@/data/api/currency.mock'
import { simulateApiCall } from '@/services/mockApi'

export interface CurrencyRate extends MockCurrencyRate {}
export interface CurrencyResponse extends MockCurrencyResponse {}

export function getCurrencyRates(): Promise<CurrencyResponse> {
  return simulateApiCall(currencyMockResponse, {
    delayMs: 800,
    shouldFail: true,
  })
}
