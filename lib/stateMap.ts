import { statesConfig } from '@/config/states.config'

export const getPropertyUrl = (stateId: string): string => {
  const state = statesConfig.find((s) => s.id === stateId)
  return state?.propertyPortalUrl ?? 'https://igrs.gov.in'
}

export const getPropertyPortalName = (stateId: string): string => {
  const state = statesConfig.find((s) => s.id === stateId)
  return state?.propertyPortalName ?? 'State Registration Portal'
}
