'use client'

import { useEffect, useState } from 'react'
import { FileText, Star, CheckCircle2, Upload } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { profileService } from '@/services/profile.service'
import type { CandidateResume } from '@/types/user'
import { cn } from '@/lib/utils'

interface ResumePickerProps {
  token: string
  selectedUrl: string | undefined
  onSelect: (resume: CandidateResume | null) => void
  /** Called when the user wants to upload a new file instead */
  onUploadNew: () => void
}

export function ResumePicker({ token, selectedUrl, onSelect, onUploadNew }: ResumePickerProps) {
  const [resumes, setResumes] = useState<CandidateResume[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    profileService
      .listResumes(token)
      .then((data) => {
        if (!isMounted) return
        setResumes(data ?? [])
        // Auto-select primary resume if nothing is selected
        if (!selectedUrl && data && data.length > 0) {
          const primary = data.find((r) => r.is_primary) ?? data[0]
          onSelect(primary)
        }
      })
      .catch(() => {/* silently fail, user can still upload new */})
      .finally(() => { if (isMounted) setIsLoading(false) })
    return () => { isMounted = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-secondary py-6 justify-center border-2 border-dashed border-border">
        <Spinner className="w-4 h-4" />
        Loading your resumes…
      </div>
    )
  }

  if (resumes.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-border cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        onClick={onUploadNew}
      >
        <Upload className="w-8 h-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">No resumes in your library</p>
          <p className="text-xs text-secondary mt-1">Click to upload a new PDF</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {resumes.map((resume) => {
        const isSelected = selectedUrl === resume.file_url
        return (
          <button
            key={resume.id}
            type="button"
            onClick={() => onSelect(isSelected ? null : resume)}
            className={cn(
              'w-full flex items-center gap-3 p-3 border-2 text-left transition-all',
              isSelected
                ? 'border-primary bg-primary/5 shadow-[2px_2px_0_0_#0F172A]'
                : 'border-border hover:border-primary/50 hover:bg-muted/50',
            )}
          >
            <FileText className={cn('w-5 h-5 shrink-0', isSelected ? 'text-primary' : 'text-muted-foreground')} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {resume.file_name}
                {resume.is_primary && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-primary font-bold">
                    <Star className="w-3 h-3 fill-primary" /> Primary
                  </span>
                )}
              </p>
            </div>
            {isSelected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
          </button>
        )
      })}

      <button
        type="button"
        onClick={onUploadNew}
        className="w-full flex items-center gap-2 p-3 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm text-secondary hover:text-primary"
      >
        <Upload className="w-4 h-4" />
        Upload a new CV instead
      </button>
    </div>
  )
}
