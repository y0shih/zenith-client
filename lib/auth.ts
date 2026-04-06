import type { UserRole } from '@/types/user'

export function getDefaultRouteForRole(role: UserRole | null | undefined) {
  switch (role) {
    case 'candidate':
      return '/profile'
    case 'employer':
    case 'tenant_admin':
      return '/dashboard/employer'
    case 'system_admin':
      return '/dashboard/admin'
    default:
      return '/jobs'
  }
}

export function getInitials(fullName: string | null | undefined) {
  if (!fullName) {
    return 'ZU'
  }

  const parts = fullName
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean)

  if (!parts.length) {
    return 'ZU'
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function canManageTenant(role: UserRole | null | undefined) {
  return role === 'employer' || role === 'tenant_admin'
}
