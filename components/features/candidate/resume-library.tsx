'use client'

import { useEffect, useState } from 'react'
import { FileText, Star, Trash2, Pencil, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { profileService } from '@/services/profile.service'
import type { CandidateResume } from '@/types/user'
import { formatRelativeDate } from '@/lib/display'
import { cn } from '@/lib/utils'

interface ResumeLibraryProps {
  token: string
  refreshTrigger?: number
}

export function ResumeLibrary({ token, refreshTrigger }: ResumeLibraryProps) {
  const [resumes, setResumes] = useState<CandidateResume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    profileService
      .listResumes(token)
      .then((data) => { if (isMounted) setResumes(data ?? []) })
      .catch(() => toast.error('Could not load your resume library.'))
      .finally(() => { if (isMounted) setIsLoading(false) })
    return () => { isMounted = false }
  }, [token, refreshTrigger])


  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await profileService.deleteResume(id, token)
      setResumes((prev) => prev.filter((r) => r.id !== id))
      toast.success('Resume removed.')
    } catch {
      toast.error('Failed to delete resume.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetPrimary = async (resume: CandidateResume) => {
    try {
      const updated = await profileService.updateResume(
        resume.id,
        { file_name: resume.file_name, is_primary: true },
        token,
      )
      setResumes((prev) =>
        prev.map((r) =>
          r.id === resume.id ? updated : { ...r, is_primary: false },
        ),
      )
      toast.success(`"${resume.file_name}" set as primary.`)
    } catch {
      toast.error('Failed to update resume.')
    }
  }

  const startRename = (resume: CandidateResume) => {
    setEditingId(resume.id)
    setEditName(resume.file_name)
  }

  const confirmRename = async (resume: CandidateResume) => {
    if (!editName.trim()) { setEditingId(null); return }
    try {
      const updated = await profileService.updateResume(
        resume.id,
        { file_name: editName.trim(), is_primary: resume.is_primary },
        token,
      )
      setResumes((prev) => prev.map((r) => (r.id === resume.id ? updated : r)))
      toast.success('Resume renamed.')
    } catch {
      toast.error('Failed to rename resume.')
    } finally {
      setEditingId(null)
    }
  }

  return (
    <section className="border-2 border-primary bg-card shadow-[6px_6px_0_0_#0F172A]">
      <div className="border-b-2 border-border px-6 py-5">
        <h2 className="font-heading text-xl font-bold text-primary">Resume Library</h2>
        <p className="text-secondary text-sm mt-0.5">{resumes.length} CV{resumes.length !== 1 ? 's' : ''} uploaded</p>
      </div>
      <div className="p-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center gap-2 text-secondary py-4 justify-center">
            <Spinner className="w-4 h-4" />
            Loading resumes…
          </div>
        ) : resumes.length === 0 ? (
          <p className="text-sm text-secondary text-center py-4">
            Upload a CV using the Resume field above.
          </p>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume.id}
              className={cn(
                'flex items-center gap-3 p-3 border-2 transition-colors group',
                resume.is_primary ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
              )}
            >
              <FileText className={cn('w-5 h-5 shrink-0', resume.is_primary ? 'text-primary' : 'text-muted-foreground')} />

              <div className="flex-1 min-w-0">
                {editingId === resume.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmRename(resume)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      className="flex-1 border border-border px-2 py-0.5 text-sm font-medium focus:outline-none focus:border-primary"
                    />
                    <button onClick={() => confirmRename(resume)} className="text-primary hover:text-primary/80">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-foreground truncate leading-tight">
                    {resume.original_name ?? resume.file_name}
                    {resume.is_primary && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-primary font-bold">
                        <Star className="w-3 h-3 fill-primary" /> Primary
                      </span>
                    )}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeDate(resume.created_at)}</p>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {!resume.is_primary && (
                  <button
                    title="Set as primary"
                    onClick={() => handleSetPrimary(resume)}
                    className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-none transition-colors"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  title="Rename"
                  onClick={() => startRename(resume)}
                  className="p-1.5 hover:bg-muted rounded-none transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  title="Delete"
                  onClick={() => handleDelete(resume.id)}
                  disabled={deletingId === resume.id}
                  className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-none transition-colors disabled:opacity-50"
                >
                  {deletingId === resume.id ? <Spinner className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
