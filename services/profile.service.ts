import { api } from './api'
import { UpdateCandidateProfilePayload, CandidateProfile } from '@/types/user'

export const profileService = {
  getProfile: () => 
    api.get<CandidateProfile>('/profiles/candidate'),

  updateProfile: (payload: UpdateCandidateProfilePayload) =>
    api.put<CandidateProfile>('/profiles/candidate', payload),
}
