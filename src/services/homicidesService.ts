import {
  homicidesMockResponse,
  type MockHomicideDepartmentSummary,
  type MockHomicideYearSummary,
  type MockHomicidesResponse,
} from '@/data/api/homicides.mock'
import { simulateApiCall } from '@/services/mockApi'

export interface HomicideYearSummary extends MockHomicideYearSummary {}
export interface HomicideDepartmentSummary extends MockHomicideDepartmentSummary {}
export interface HomicidesResponse extends MockHomicidesResponse {}

export function getHomicidesStats(): Promise<HomicidesResponse> {
  return simulateApiCall(homicidesMockResponse, {
    delayMs: 900,
    // Cambiar a true para probar el flujo de error y fallback a cache.
    shouldFail: false,
  })
}
