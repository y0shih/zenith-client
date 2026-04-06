import { formatDistanceToNow } from 'date-fns'

export function formatRelativeDate(value: string | null | undefined) {
  if (!value) {
    return 'Unknown'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatCurrencyRange(min: number | null, max: number | null) {
  if (min == null && max == null) {
    return 'Salary not listed'
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

  if (min != null && max != null) {
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }

  if (min != null) {
    return `From ${formatter.format(min)}`
  }

  return `Up to ${formatter.format(max as number)}`
}

export function formatEnumLabel(value: string | null | undefined) {
  if (!value) {
    return 'Not specified'
  }

  return value.replace(/_/g, ' ')
}

export function shortenId(value: string | null | undefined, length = 8) {
  if (!value) {
    return 'N/A'
  }

  return value.slice(0, length)
}
